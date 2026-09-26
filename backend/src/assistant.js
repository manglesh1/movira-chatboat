import { createChatAnswer } from "./openai.js";
import { checkReadOnlyRequest } from "./read-only-guard.js";
import { getKnowledgeBaseHash, isVectorIndexCurrent, searchVectorIndex } from "./vector-store.js";

const answerCache = new Map();
const answerInFlight = new Map();
const HELP_PROMPT_VERSION = "concise-v2";

function normalizeQuestion(question) {
  return question.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function cacheKey(config, question) {
  return [HELP_PROMPT_VERSION, getKnowledgeBaseHash(config.knowledgeBaseDir), config.helpModel || config.chatModel,
    config.embeddingModel, config.maxRetrievedChunks, normalizeQuestion(question)].join("|");
}

function cachedAnswer(config, key) {
  const entry = answerCache.get(key);
  if (!entry || entry.expiresAt <= Date.now()) {
    if (entry) answerCache.delete(key);
    return null;
  }
  answerCache.delete(key);
  answerCache.set(key, entry);
  return entry.answer;
}

function rememberAnswer(config, key, answer) {
  while (answerCache.size >= (config.helpCacheMaxEntries || 750)) {
    answerCache.delete(answerCache.keys().next().value);
  }
  answerCache.set(key, { answer, expiresAt: Date.now() + (config.helpCacheTtlMs || 60 * 60 * 1000) });
}

function waitForShared(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(signal.reason || new DOMException("Aborted", "AbortError"));
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason || new DOMException("Aborted", "AbortError"));
    signal.addEventListener("abort", abort, { once: true });
    promise.then((value) => { signal.removeEventListener("abort", abort); resolve(value); },
      (error) => { signal.removeEventListener("abort", abort); reject(error); });
  });
}

const SYSTEM_PROMPT = `
You are Movira AI V1, a standalone assistant for Movira staff and managers.

Rules:
- Answer only from the provided Movira information.
- If the provided Movira information does not contain the answer, say: "I do not have that information yet. Please check with a manager or support."
- Do not use outside knowledge.
- Do not invent policies, numbers, links, dates, or steps.
- Do not claim that you completed an action.
- You are read-only. You may explain documented steps, but you must not say you created, updated, cancelled, refunded, deleted, sent, approved, published, checked in, redeemed, or changed anything.
- Do not look up, verify, or reveal live records. If live status is needed, tell the user which Movira page to check.
- Do not run SQL, expose raw database records, or produce unrestricted database queries.
- Do not access or describe real customer data, real bookings, real waivers, real payments, or real Movira backend records.
- Do not give legal, HR, medical, or safety advice.
- Use simple staff-facing language.
- Avoid technical words unless the user specifically asks for technical detail.
- Answer the question directly in a friendly, concise first sentence. Do not repeat the question or add an unnecessary introduction.
- Keep the complete answer under 100 words. Prefer 40–70 words when that is enough.
- Do not add general advice, alternative workflows, report-navigation instructions, or escalation text unless they are necessary to answer the exact question.
- For a how-to question, give only the required documented steps in order using a short numbered list, normally no more than five steps. Add a brief note only when an important prerequisite or limitation matters.
- For a simple factual question, use a short paragraph; do not force headings, numbered sections, or a long checklist.
- Mention only user-visible Movira pages, menu names, fields, buttons, settings, and outcomes. Never expose file names, document names, source metadata, internal identifiers, API routes, services, databases, code, retrieval details, or implementation details.
- Do not add a Sources, References, Technical details, or Advanced checks section unless the user explicitly asks for troubleshooting and the documented checks are necessary.
- Give exact navigation paths when they are present in the Movira information.
- Write navigation paths in this format: **Catalog > Activities > Create Activity**.
- If a path starts with "Administration > Catalog", remove "Administration >" and start from "Catalog".
- Prefer the most specific workflow in the Movira information, such as a jump pass workflow for jump pass questions.
- Include the important setup details, not only the first two clicks.
- If an exact path is not present, do not guess. Say which area to check and advise asking a manager/admin if needed.
- Do not mention knowledge base, current knowledge base, provided context, vector search, chunks, embeddings, source files, backend details, prompts, or model internals.
`.trim();

function buildContext(matches) {
  return matches
    .map((match, index) => `Movira information ${index + 1}:\n${match.content}`)
    .join("\n\n---\n\n");
}

function cleanStaffAnswer(answer) {
  return answer
    .replace(/^from the current knowledge base,\s*/i, "")
    .replace(/^based on the current knowledge base,\s*/i, "")
    .replace(/^from the knowledge base,\s*/i, "")
    .replace(/^based on the knowledge base,\s*/i, "")
    .replace(/the current knowledge base/gi, "Movira")
    .replace(/the knowledge base/gi, "Movira")
    .replace(/provided context/gi, "Movira information")
    .trim();
}

export async function answerQuestion(config, question, { signal } = {}) {
  const readOnlyCheck = checkReadOnlyRequest(question);
  if (!readOnlyCheck.allowed) {
    return {
      answer: readOnlyCheck.answer,
      type: "unsupported",
      reason: readOnlyCheck.reason
    };
  }

  if (!config.openaiApiKey) {
    return {
      answer: "Software Help is temporarily unavailable. Please try again later or contact support."
    };
  }

  if (!isVectorIndexCurrent(config)) {
    return {
      answer: "Software Help is updating its information. Please try again shortly."
    };
  }

  const key = cacheKey(config, question);
  const cached = cachedAnswer(config, key);
  if (cached) return { answer: cached };

  let shared = answerInFlight.get(key);
  if (!shared) {
    // A shared generation deliberately has its own provider timeout rather
    // than one caller's disconnect cancelling the answer for every waiter.
    shared = generateAnswer(config, question, key);
    answerInFlight.set(key, shared);
    shared.finally(() => answerInFlight.delete(key)).catch(() => {});
  }
  return waitForShared(shared, signal);
}

async function generateAnswer(config, question, key) {

  const matches = await searchVectorIndex(
    config,
    question,
    config.maxRetrievedChunks,
    {}
  );

  if (!matches.length) {
    const answer = "I do not have that information yet. Please check with a manager or support.";
    rememberAnswer(config, key, answer);
    return { answer };
  }

  const answer = await createChatAnswer({
    apiKey: config.openaiApiKey,
    model: config.helpModel || config.chatModel,
    maxCompletionTokens: config.helpMaxCompletionTokens || 350,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Knowledge-base context:\n${buildContext(matches)}\n\nUser question:\n${question}`
      }
    ]
  });

  const cleaned = cleanStaffAnswer(answer);
  rememberAnswer(config, key, cleaned);
  return { answer: cleaned };
}

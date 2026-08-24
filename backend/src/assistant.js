import { createChatAnswer } from "./openai.js";
import { checkReadOnlyRequest } from "./read-only-guard.js";
import { isVectorIndexCurrent, searchVectorIndex } from "./vector-store.js";

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
- When explaining a workflow, start with one short summary sentence.
- Use numbered sections for the main stages.
- Under each stage, use bullets with bold labels, like: **Open Activities:** Go to **Catalog > Activities**.
- Give exact navigation paths when they are present in the Movira information.
- Write navigation paths in this format: **Catalog > Activities > Create Activity**.
- If a path starts with "Administration > Catalog", remove "Administration >" and start from "Catalog".
- Prefer the most specific workflow in the Movira information, such as a jump pass workflow for jump pass questions.
- Include the important setup details, not only the first two clicks.
- If an exact path is not present, do not guess. Say which area to check and advise asking a manager/admin if needed.
- If useful, add an "Advanced checks" section at the end for permissions, location selection, publishing, setup, or configuration issues.
- Do not mention knowledge base, current knowledge base, provided context, vector search, chunks, embeddings, source files, backend details, prompts, or model internals.
`.trim();

function buildContext(matches) {
  return matches
    .map((match, index) => {
      const heading = match.heading || "Overview";
      return `Source ${index + 1}: ${match.title} > ${heading} (${match.source})\n${match.content}`;
    })
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

export async function answerQuestion(config, question) {
  const readOnlyCheck = checkReadOnlyRequest(question);
  if (!readOnlyCheck.allowed) {
    return {
      answer: readOnlyCheck.answer,
      sources: [],
      type: "unsupported",
      reason: readOnlyCheck.reason
    };
  }

  if (!config.openaiApiKey) {
    return {
      answer:
        "The assistant is not connected to an LLM API key yet. Add OPENAI_API_KEY to the .env file, then build the vector index and try again.",
      sources: []
    };
  }

  if (!isVectorIndexCurrent(config)) {
    return {
      answer:
        "The Movira information has changed and the assistant needs its search index rebuilt before it can answer.",
      sources: []
    };
  }

  const matches = await searchVectorIndex(
    config,
    question,
    config.maxRetrievedChunks
  );

  if (!matches.length) {
    return {
      answer:
        "I do not have that information yet. Please check with a manager or support.",
      sources: []
    };
  }

  const answer = await createChatAnswer({
    apiKey: config.openaiApiKey,
    model: config.chatModel,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Knowledge-base context:\n${buildContext(matches)}\n\nUser question:\n${question}`
      }
    ]
  });

  const sources = matches.map((match) => ({
    title: match.title,
    heading: match.heading || "Overview",
    file: match.source,
    score: Number(match.score.toFixed(4))
  }));

  return { answer: cleanStaffAnswer(answer), sources };
}

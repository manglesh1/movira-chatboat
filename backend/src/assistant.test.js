import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { answerQuestion } from "./assistant.js";
import { getKnowledgeBaseHash } from "./vector-store.js";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "movira-help-cache-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "guide.md"), "# Activity\nOpen Catalog and create the activity.");
  const indexPath = path.join(root, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify({ embeddingModel: "embedding-test",
    knowledgeBaseHash: getKnowledgeBaseHash(root), chunks: [{ id: "one", source: "guide.md",
      heading: "Activity", content: "Open Catalog and create the activity.", embedding: [1, 0] }] }));
  return { openaiApiKey: "test", helpModel: "help-test", chatModel: "unused",
    embeddingModel: "embedding-test", knowledgeBaseDir: root, indexPath,
    minSimilarityScore: 0.2, maxRetrievedChunks: 5, helpMaxCompletionTokens: 300,
    helpCacheTtlMs: 60000, helpCacheMaxEntries: 50, embeddingCacheTtlMs: 60000,
    embeddingCacheMaxEntries: 50 };
}

test("normalized repeats reuse one embedding and one generated Help answer", async (t) => {
  const config = fixture(t);
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  let embeddings = 0; let answers = 0;
  globalThis.fetch = async (url) => {
    if (String(url).includes("embeddings")) {
      embeddings += 1;
      return new Response(JSON.stringify({ data: [{ index: 0, embedding: [1, 0] }] }));
    }
    answers += 1;
    return new Response(JSON.stringify({ choices: [{ message: { content: "Open **Catalog > Activities**." } }] }));
  };
  const first = await answerQuestion(config, "How do I create an activity?");
  const second = await answerQuestion(config, " how do i create an activity ");
  assert.equal(first.answer, second.answer);
  assert.equal(embeddings, 1); assert.equal(answers, 1);
});

test("simultaneous duplicate Help questions share one provider generation", async (t) => {
  const config = fixture(t);
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  let embeddings = 0; let answers = 0;
  globalThis.fetch = async (url) => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    if (String(url).includes("embeddings")) {
      embeddings += 1;
      return new Response(JSON.stringify({ data: [{ index: 0, embedding: [1, 0] }] }));
    }
    answers += 1;
    return new Response(JSON.stringify({ choices: [{ message: { content: "Use the documented workflow." } }] }));
  };
  const results = await Promise.all(Array.from({ length: 20 }, () => answerQuestion(config, "Explain activity creation")));
  assert.equal(new Set(results.map((result) => result.answer)).size, 1);
  assert.equal(embeddings, 1); assert.equal(answers, 1);
});

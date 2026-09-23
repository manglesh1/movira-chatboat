import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getKnowledgeBaseHash, loadVectorIndex, isVectorIndexCurrent, searchVectorIndex } from "./vector-store.js";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "movira-rag-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "guide.md"), "# Help\nDocumented workflow.");
  const config = { knowledgeBaseDir: root, indexPath: path.join(root, "index.json"), embeddingModel: "test-model" };
  const writeIndex = (extras = {}) => fs.writeFileSync(config.indexPath, JSON.stringify({ embeddingModel: config.embeddingModel,
    knowledgeBaseHash: getKnowledgeBaseHash(root), chunks: [{ id: "a", embedding: [1, 0] }], ...extras }));
  writeIndex(); return { root, config, writeIndex };
}
test("index cache reuses parsed index and invalidates after index replacement", (t) => {
  const f = fixture(t); const original = loadVectorIndex(f.config);
  assert.strictEqual(loadVectorIndex(f.config), original);
  f.writeIndex({ chunks: [{ id: "replacement", embedding: [0, 1] }] });
  assert.notStrictEqual(loadVectorIndex(f.config), original);
});
test("document additions, edits, and removals invalidate freshness", (t) => {
  const f = fixture(t); assert.equal(isVectorIndexCurrent(f.config), true);
  fs.writeFileSync(path.join(f.root, "guide.md"), "# Changed\nNew workflow.");
  assert.equal(isVectorIndexCurrent(f.config), false); f.writeIndex();
  fs.writeFileSync(path.join(f.root, "new.md"), "Another document."); assert.equal(isVectorIndexCurrent(f.config), false);
  f.writeIndex(); fs.unlinkSync(path.join(f.root, "new.md")); assert.equal(isVectorIndexCurrent(f.config), false);
});
test("embedding model mismatch refuses retrieval without provider call", async (t) => {
  const f = fixture(t); f.config.embeddingModel = "other-model";
  assert.equal(isVectorIndexCurrent(f.config), false);
  assert.deepEqual(await searchVectorIndex(f.config, "question"), []);
});

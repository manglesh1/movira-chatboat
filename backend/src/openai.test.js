import test from "node:test";
import assert from "node:assert/strict";
import { createEmbedding, createEmbeddings, createChatAnswer } from "./openai.js";

test("help provider errors retain only safe diagnostics, never upstream payloads", async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => new Response(JSON.stringify({ error: {
    code: "credit_balance_exhausted", type: "insufficient_quota", message: "private key and prompt details",
  } }), { status: 429, headers: { "x-request-id": "req_safe" } });
  for (const [operation, stage] of [
    [() => createEmbedding({ apiKey: "secret", model: "embedding", input: "private" }), "embedding"],
    [() => createChatAnswer({ apiKey: "secret", model: "chat", messages: [] }), "help_answer"],
  ]) {
    await assert.rejects(operation(), (error) => {
      assert.equal(error.provider.code, "credit_balance_exhausted");
      assert.equal(error.provider.stage, stage);
      assert.equal(error.provider.requestId, "req_safe");
      assert.ok(!JSON.stringify(error).includes("private"));
      assert.ok(!error.message.includes("private"));
      return true;
    });
  }
});

test("help preserves success and client aborts; network failures have safe metadata", async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async (_url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(JSON.stringify({ data: [{ embedding: [1, 2] }], choices: [{ message: { content: "Answer" } }] }));
  };
  assert.deepEqual(await createEmbedding({ input: "hi" }), [1, 2]);
  assert.equal(await createChatAnswer({ messages: [] }), "Answer");
  const controller = new AbortController(); controller.abort();
  globalThis.fetch = async () => { throw new DOMException("cancelled", "AbortError"); };
  await assert.rejects(createEmbedding({ signal: controller.signal }), { name: "AbortError" });
  globalThis.fetch = async () => { throw new TypeError("sensitive connection failure"); };
  await assert.rejects(createEmbedding({}), (error) => error.provider.code === "network_error" && !error.message.includes("sensitive"));
});

test("embedding batches preserve provider index order", async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => new Response(JSON.stringify({ data: [
    { index: 1, embedding: [0, 1] }, { index: 0, embedding: [1, 0] },
  ] }));
  assert.deepEqual(await createEmbeddings({ input: ["first", "second"] }), [[1, 0], [0, 1]]);
});

test("malformed success responses are tagged as provider failures", async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => new Response(JSON.stringify({ data: [{ embedding: [] }], choices: [] }));
  for (const operation of [() => createEmbedding({}), () => createChatAnswer({})]) {
    await assert.rejects(operation(), (error) => error.provider.code === "malformed_response");
  }
});
test("GPT-5 Help request omits temperature and uses completion tokens", async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  const bodies = [];
  globalThis.fetch = async (_url, options) => {
    bodies.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ choices: [{ message: { content: "Answer" } }] }));
  };
  await createChatAnswer({ model: "gpt-5-mini", messages: [] });
  await createChatAnswer({ model: "gpt-4.1-mini", messages: [] });
  assert.equal(bodies[0].max_completion_tokens, 650);
  assert.ok(!("temperature" in bodies[0]));
  assert.ok(!("max_tokens" in bodies[0]));
  assert.equal(bodies[1].temperature, 0.2);
  assert.equal(bodies[1].max_tokens, 650);
});

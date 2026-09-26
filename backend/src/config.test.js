import test from "node:test";
import assert from "node:assert/strict";
import { getConfig } from "./config.js";

test("embedded help configuration does not mutate host environment", () => {
  const before = process.env.PORT;
  const config = getConfig("unused-root", { loadEnvironment: false,
    environment: { PORT: "9999", OPENAI_MODEL: "configured-model", OPENAI_API_KEY: "test-key" } });
  assert.equal(config.port, 9999); assert.equal(config.chatModel, "configured-model");
  assert.equal(config.helpModel, "gpt-4.1-mini"); assert.equal(config.plannerModel, "gpt-4.1-mini");
  assert.equal(config.maxRetrievedChunks, 5); assert.equal(config.helpMaxCompletionTokens, 350);
  assert.equal(process.env.PORT, before);
});

test("staff-specific model and token settings are bounded", () => {
  const config = getConfig("unused-root", { loadEnvironment: false, environment: {
    STAFF_AI_HELP_MODEL: "fast-help", STAFF_AI_PLANNER_MODEL: "fast-planner",
    STAFF_AI_HELP_MAX_TOKENS: "99999", RAG_MAX_RETRIEVED_CHUNKS: "99",
  } });
  assert.equal(config.helpModel, "fast-help"); assert.equal(config.plannerModel, "fast-planner");
  assert.equal(config.helpMaxCompletionTokens, 800); assert.equal(config.maxRetrievedChunks, 8);
});

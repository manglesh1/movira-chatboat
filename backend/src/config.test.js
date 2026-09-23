import test from "node:test";
import assert from "node:assert/strict";
import { getConfig } from "./config.js";

test("embedded help configuration does not mutate host environment", () => {
  const before = process.env.PORT;
  const config = getConfig("unused-root", { loadEnvironment: false,
    environment: { PORT: "9999", OPENAI_MODEL: "configured-model", OPENAI_API_KEY: "test-key" } });
  assert.equal(config.port, 9999); assert.equal(config.chatModel, "configured-model");
  assert.equal(process.env.PORT, before);
});

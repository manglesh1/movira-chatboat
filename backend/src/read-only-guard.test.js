import assert from "node:assert/strict";
import test from "node:test";
import { checkReadOnlyRequest } from "./read-only-guard.js";

test("allows documented help questions about actions", () => {
  assert.equal(checkReadOnlyRequest("How do I create an activity?").allowed, true);
  assert.equal(checkReadOnlyRequest("Explain the refund process.").allowed, true);
  assert.equal(checkReadOnlyRequest("What should staff check before cancelling a booking?").allowed, true);
});

test("blocks requests that ask the AI to perform changes", () => {
  assert.equal(checkReadOnlyRequest("Please cancel booking 1234 for me.").allowed, false);
  assert.equal(checkReadOnlyRequest("Refund this booking now.").allowed, false);
  assert.equal(checkReadOnlyRequest("Can you send a payment link for booking 991?").allowed, false);
});

test("blocks live record lookups and sensitive data", () => {
  assert.equal(checkReadOnlyRequest("Check if booking 1234 is paid.").allowed, false);
  assert.equal(checkReadOnlyRequest("Show me the customer email for booking 1234.").allowed, false);
  assert.equal(checkReadOnlyRequest("Give me all customers.").allowed, false);
  assert.equal(checkReadOnlyRequest("What is the payment provider API key?").allowed, false);
});

test("blocks database access requests", () => {
  assert.equal(checkReadOnlyRequest("Run SQL to get all payments.").allowed, false);
  assert.equal(checkReadOnlyRequest("Give me a raw database query for customers.").allowed, false);
});

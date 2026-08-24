const HELP_INTENT_PATTERN =
  /\b(how do i|how can i|how to|where do i|where can i|what is|what are|why|explain|show me how|steps|guide|process|workflow|troubleshoot|what should)\b/i;

const DIRECT_ACTION_PATTERN =
  /\b(please|pls|can you|could you|would you|go ahead|do it|for me)\b.*\b(create|add|update|edit|change|delete|remove|cancel|refund|void|process|approve|override|send|resend|book|reserve|check in|check-in|redeem|complete|publish|configure|assign)\b|\b(create|add|update|edit|change|delete|remove|cancel|refund|void|process|approve|override|send|resend|book|reserve|check in|check-in|redeem|complete|publish|configure|assign)\b.*\b(for me|now|this booking|that booking|booking\s*#?\d+|ticket\s*#?\w+|customer\s*#?\w+|payment\s*#?\w+|transaction\s*#?\w+)\b/i;

const LIVE_LOOKUP_PATTERN =
  /\b(check|look up|lookup|find|open|pull up|show|get|tell me)\b.*\b(booking|customer|guest|waiver|payment|transaction|ticket|refund|card|invoice|order)\b.*\b(#?\d{2,}|status|paid|unpaid|email|phone|record|details|history|list)\b/i;

const SENSITIVE_DATA_PATTERN =
  /\b(full card|card number|cvv|cvc|password|passcode|pin|api key|secret|token|private key|credential|all customers|customer list|export customers|raw customer|raw payment|raw booking)\b/i;

const DATABASE_PATTERN =
  /\b(run|execute|write|generate|give me)\b.*\b(sql|database query|db query|select \*|raw query)\b/i;

const REFUSAL_ANSWER =
  "I cannot perform changes, look up live records, reveal sensitive data, or run database queries. I can still explain the documented Movira steps, safety checks, and where an authorized staff member should go in Movira.";

function isHelpQuestion(question) {
  return HELP_INTENT_PATTERN.test(question);
}

export function checkReadOnlyRequest(question) {
  const normalizedQuestion = String(question || "").trim();

  if (!normalizedQuestion) {
    return { allowed: true };
  }

  if (SENSITIVE_DATA_PATTERN.test(normalizedQuestion)) {
    return {
      allowed: false,
      reason: "sensitive_data",
      answer: REFUSAL_ANSWER
    };
  }

  if (DATABASE_PATTERN.test(normalizedQuestion)) {
    return {
      allowed: false,
      reason: "database_access",
      answer: REFUSAL_ANSWER
    };
  }

  if (LIVE_LOOKUP_PATTERN.test(normalizedQuestion) && !isHelpQuestion(normalizedQuestion)) {
    return {
      allowed: false,
      reason: "live_record_lookup",
      answer: REFUSAL_ANSWER
    };
  }

  if (DIRECT_ACTION_PATTERN.test(normalizedQuestion) && !isHelpQuestion(normalizedQuestion)) {
    return {
      allowed: false,
      reason: "direct_action",
      answer: REFUSAL_ANSWER
    };
  }

  return { allowed: true };
}

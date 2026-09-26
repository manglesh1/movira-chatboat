import fs from "node:fs";
import path from "node:path";

export function loadEnv(projectRoot) {
  const envPath = path.join(projectRoot, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = rest.join("=").trim();
    }
  }
}

export function getConfig(projectRoot, { loadEnvironment = true, environment = process.env } = {}) {
  if (loadEnvironment) loadEnv(projectRoot);

  function boundedNumber(value, fallback, min, max) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
  }

  return {
    port: Number(environment.PORT || 8787),
    openaiApiKey: environment.OPENAI_API_KEY || "",
    chatModel: environment.OPENAI_MODEL || "gpt-4.1-mini",
    // Staff Help is intentionally independent from the application's global
    // model. It is a short, grounded formatting task and does not need the
    // slower reasoning model used by other features.
    helpModel: environment.STAFF_AI_HELP_MODEL || "gpt-4.1-mini",
    plannerModel: environment.STAFF_AI_PLANNER_MODEL || "gpt-4.1-mini",
    plannerMaxCompletionTokens: boundedNumber(environment.STAFF_AI_PLANNER_MAX_TOKENS, 500, 200, 1000),
    embeddingModel: environment.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    minSimilarityScore: boundedNumber(environment.RAG_MIN_SIMILARITY_SCORE, 0.28, 0, 1),
    maxRetrievedChunks: boundedNumber(environment.RAG_MAX_RETRIEVED_CHUNKS, 5, 1, 8),
    helpMaxCompletionTokens: boundedNumber(environment.STAFF_AI_HELP_MAX_TOKENS, 350, 150, 800),
    helpCacheTtlMs: boundedNumber(environment.STAFF_AI_HELP_CACHE_TTL_MS, 60 * 60 * 1000, 60 * 1000, 24 * 60 * 60 * 1000),
    helpCacheMaxEntries: boundedNumber(environment.STAFF_AI_HELP_CACHE_MAX_ENTRIES, 750, 50, 5000),
    embeddingCacheTtlMs: boundedNumber(environment.STAFF_AI_EMBEDDING_CACHE_TTL_MS, 60 * 60 * 1000, 60 * 1000, 24 * 60 * 60 * 1000),
    embeddingCacheMaxEntries: boundedNumber(environment.STAFF_AI_EMBEDDING_CACHE_MAX_ENTRIES, 1000, 50, 5000),
    indexEmbeddingBatchSize: boundedNumber(environment.STAFF_AI_INDEX_BATCH_SIZE, 32, 1, 64),
    knowledgeBaseDir: path.join(projectRoot, "knowledge-base"),
    indexPath: path.join(projectRoot, "backend", ".cache", "vector-index.json"),
    frontendDir: path.join(projectRoot, "frontend")
  };
}

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

  return {
    port: Number(environment.PORT || 8787),
    openaiApiKey: environment.OPENAI_API_KEY || "",
    chatModel: environment.OPENAI_MODEL || "gpt-4.1-mini",
    embeddingModel: environment.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    minSimilarityScore: Number(environment.RAG_MIN_SIMILARITY_SCORE || 0.28),
    maxRetrievedChunks: Number(environment.RAG_MAX_RETRIEVED_CHUNKS || 9),
    knowledgeBaseDir: path.join(projectRoot, "knowledge-base"),
    indexPath: path.join(projectRoot, "backend", ".cache", "vector-index.json"),
    frontendDir: path.join(projectRoot, "frontend")
  };
}

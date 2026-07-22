import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createEmbedding } from "./openai.js";

const SUPPORTED_EXTENSIONS = new Set([".md", ".txt"]);

function stableId(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function chunkText(text, maxChars = 1200, overlap = 180) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    const end = Math.min(start + maxChars, cleaned.length);
    chunks.push(cleaned.slice(start, end).trim());
    if (end === cleaned.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks;
}

function splitMarkdownSections(text) {
  const sections = [];
  const lines = text.split(/\r?\n/);
  let currentHeading = "Overview";
  let currentLines = [];

  function pushCurrentSection() {
    const content = currentLines.join("\n").trim();
    if (!content) return;
    sections.push({
      heading: currentHeading,
      content
    });
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      pushCurrentSection();
      currentHeading = headingMatch[2].trim();
      currentLines = [line];
      continue;
    }

    currentLines.push(line);
  }

  pushCurrentSection();
  return sections.length ? sections : [{ heading: "Overview", content: text }];
}

function buildDocumentChunks(file) {
  if (path.extname(file.file).toLowerCase() !== ".md") {
    return chunkText(file.text).map((content, index) => ({
      content,
      heading: "Overview",
      sectionIndex: 0,
      chunkInSection: index
    }));
  }

  return splitMarkdownSections(file.text).flatMap((section, sectionIndex) => {
    const sectionChunks = chunkText(section.content);

    return sectionChunks.map((content, chunkInSection) => ({
      content,
      heading: section.heading,
      sectionIndex,
      chunkInSection
    }));
  });
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function readKnowledgeFiles(knowledgeBaseDir) {
  if (!fs.existsSync(knowledgeBaseDir)) return [];

  return fs
    .readdirSync(knowledgeBaseDir)
    .filter((file) => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => {
      const filePath = path.join(knowledgeBaseDir, file);
      return {
        file,
        title: path.basename(file, path.extname(file)).replaceAll("-", " "),
        text: fs.readFileSync(filePath, "utf8")
      };
    });
}

export function getKnowledgeBaseHash(knowledgeBaseDir) {
  const files = readKnowledgeFiles(knowledgeBaseDir);
  const hash = crypto.createHash("sha256");

  for (const file of files) {
    hash.update(file.file);
    hash.update("\n");
    hash.update(file.text);
    hash.update("\n---\n");
  }

  return hash.digest("hex");
}

export async function buildVectorIndex(config) {
  if (!config.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is required to build the vector index.");
  }

  const files = readKnowledgeFiles(config.knowledgeBaseDir);
  const knowledgeBaseHash = getKnowledgeBaseHash(config.knowledgeBaseDir);
  const chunks = [];

  for (const file of files) {
    const fileChunks = buildDocumentChunks(file);

    for (let index = 0; index < fileChunks.length; index += 1) {
      const fileChunk = fileChunks[index];
      const content = normalizeText(fileChunk.content);
      const embedding = await createEmbedding({
        apiKey: config.openaiApiKey,
        model: config.embeddingModel,
        input: content
      });

      chunks.push({
        id: stableId(`${file.file}:${index}:${content}`),
        source: file.file,
        title: file.title,
        heading: fileChunk.heading,
        chunkIndex: index,
        sectionIndex: fileChunk.sectionIndex,
        chunkInSection: fileChunk.chunkInSection,
        content,
        embedding
      });
    }
  }

  fs.mkdirSync(path.dirname(config.indexPath), { recursive: true });
  fs.writeFileSync(
    config.indexPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        embeddingModel: config.embeddingModel,
        knowledgeBaseHash,
        chunks
      },
      null,
      2
    )
  );

  return { chunkCount: chunks.length, fileCount: files.length };
}

export function loadVectorIndex(config) {
  if (!fs.existsSync(config.indexPath)) return null;
  return JSON.parse(fs.readFileSync(config.indexPath, "utf8"));
}

export function isVectorIndexCurrent(config) {
  const index = loadVectorIndex(config);
  if (!index?.knowledgeBaseHash) return false;
  return index.knowledgeBaseHash === getKnowledgeBaseHash(config.knowledgeBaseDir);
}

export async function searchVectorIndex(config, question, limit = 5) {
  const index = loadVectorIndex(config);
  if (!index || !index.chunks?.length || !isVectorIndexCurrent(config)) {
    return [];
  }

  const questionEmbedding = await createEmbedding({
    apiKey: config.openaiApiKey,
    model: config.embeddingModel,
    input: question
  });

  const minScore = Number.isFinite(config.minSimilarityScore)
    ? config.minSimilarityScore
    : 0;

  return index.chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(questionEmbedding, chunk.embedding)
    }))
    .filter((chunk) => chunk.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

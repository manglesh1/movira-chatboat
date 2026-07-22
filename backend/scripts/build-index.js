import path from "node:path";
import { fileURLToPath } from "node:url";
import { getConfig } from "../src/config.js";
import { buildVectorIndex } from "../src/vector-store.js";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), "..", "..");
const config = getConfig(projectRoot);

try {
  const result = await buildVectorIndex(config);
  console.log(`Vector index built: ${result.chunkCount} chunks from ${result.fileCount} files.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

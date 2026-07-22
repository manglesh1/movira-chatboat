import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getConfig } from "../src/config.js";
import { searchVectorIndex } from "../src/vector-store.js";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), "..", "..");
const config = getConfig(projectRoot);
const evalPath = path.join(projectRoot, "evals", "rag-questions.json");

if (!fs.existsSync(evalPath)) {
  console.error("Missing evals/rag-questions.json.");
  process.exit(1);
}

const cases = JSON.parse(fs.readFileSync(evalPath, "utf8"));
let passed = 0;

for (const testCase of cases) {
  const matches = await searchVectorIndex(config, testCase.question, 5);
  const returnedSources = [...new Set(matches.map((match) => match.source))];
  const expectedSources = testCase.expectedSources || [];
  const hasExpectedSource = expectedSources.some((source) =>
    returnedSources.includes(source)
  );

  if (hasExpectedSource) {
    passed += 1;
  }

  console.log(`\nQuestion: ${testCase.question}`);
  console.log(`Result: ${hasExpectedSource ? "PASS" : "FAIL"}`);
  console.log(`Expected: ${expectedSources.join(", ") || "Any source"}`);
  console.log(
    `Retrieved: ${returnedSources.length ? returnedSources.join(", ") : "No matches"}`
  );

  for (const match of matches.slice(0, 3)) {
    console.log(
      `- ${match.source} > ${match.heading} (${match.score.toFixed(4)})`
    );
  }
}

console.log(`\nRetrieval eval: ${passed}/${cases.length} passed.`);

if (passed !== cases.length) {
  process.exit(1);
}

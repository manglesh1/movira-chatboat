import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getConfig } from "./src/config.js";
import { answerQuestion } from "./src/assistant.js";
import { buildVectorIndex, isVectorIndexCurrent, loadVectorIndex } from "./src/vector-store.js";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(__filename), "..");
const config = getConfig(projectRoot);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
  });
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(config.frontendDir, safePath);

  if (!filePath.startsWith(config.frontendDir) || !fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const extension = path.extname(filePath);
  response.writeHead(200, { "Content-Type": contentTypes[extension] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(response);
}

async function handleApi(request, response) {
  if (request.method === "GET" && request.url === "/api/health") {
    const index = loadVectorIndex(config);
    sendJson(response, 200, {
      ok: true,
      hasApiKey: Boolean(config.openaiApiKey),
      hasVectorIndex: Boolean(index?.chunks?.length),
      isVectorIndexCurrent: isVectorIndexCurrent(config),
      chunkCount: index?.chunks?.length || 0,
      minSimilarityScore: config.minSimilarityScore,
      maxRetrievedChunks: config.maxRetrievedChunks
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/reindex") {
    try {
      const result = await buildVectorIndex(config);
      sendJson(response, 200, { ok: true, ...result });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/staff-ai") {
    try {
      const body = await readJsonBody(request);
      const question = String(body.message || "").trim();

      if (!question) {
        sendJson(response, 400, { error: "Message is required." });
        return;
      }

      const result = await answerQuestion(config, question);
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: "API route not found." });
}

const server = http.createServer(async (request, response) => {
  if (request.url.startsWith("/api/")) {
    await handleApi(request, response);
    return;
  }

  serveStatic(request, response);
});

server.listen(config.port, "127.0.0.1", () => {
  console.log(`Movira AI standalone is running at http://127.0.0.1:${config.port}`);
});

# Movira AI Chatbot

Movira AI Chatbot is a standalone Retrieval Augmented Generation (RAG) assistant for MovieRa operational knowledge. It answers staff and manager questions from approved Markdown knowledge-base files.

This local version does not connect to the live MovieRa backend, customer records, bookings, waivers, payments, or production database.

## What It Does

- Reads approved MovieRa knowledge-base Markdown files.
- Splits documents into RAG-friendly chunks.
- Creates embeddings for each chunk.
- Searches the local vector index for relevant context.
- Sends only retrieved MovieRa context to the LLM.
- Shows grounded answers with source documents.
- Refuses unsupported or unsafe requests.

## Project Structure

```text
backend/
  server.js                      Local API and static frontend server
  src/
    assistant.js                 RAG answer flow and guardrails
    config.js                    Environment/config loading
    openai.js                    OpenAI embedding/chat calls
    vector-store.js              Chunking, indexing, and vector search
  scripts/
    build-index.js               Builds the local vector index
    evaluate-retrieval.js        Checks retrieval quality

frontend/
  index.html                     Chat UI
  app.js                         Browser chat logic
  styles.css                     UI styling

knowledge-base/
  01-...md through 21-...md      Active MovieRa knowledge-base files

evals/
  rag-questions.json             Retrieval test questions

docs/
  Knowledge Base Generation Prompt.md
  Movira AI Standalone MVP Scope.md
  RAG Database Plan.md
```

## Setup

Create a real local `.env` from the dummy example:

```bash
cp .env.example .env
```

Then add your own API key in `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Optional RAG tuning values:

```env
RAG_MIN_SIMILARITY_SCORE=0.28
RAG_MAX_RETRIEVED_CHUNKS=9
```

The real `.env` file is ignored by git. Only `.env.example` should be committed.

Build the vector index:

```bash
npm run index
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:8787
```

## Commands

```bash
npm run index
```

Builds `backend/.cache/vector-index.json` from the Markdown files in `knowledge-base/`.

```bash
npm run eval:rag
```

Checks whether common questions retrieve the expected source documents.

```bash
npm run dev
```

Starts the local chatbot at `http://localhost:8787`.

## RAG Flow

1. Approved MovieRa documents live in `knowledge-base/`.
2. `npm run index` reads each document.
3. Markdown documents are split by headings, then into smaller overlapping chunks.
4. Each chunk is embedded with the configured embedding model.
5. Chunks, headings, source files, and embeddings are saved to `backend/.cache/vector-index.json`.
6. When a user asks a question, the backend embeds the question.
7. The backend searches the local vector index and keeps only chunks above `RAG_MIN_SIMILARITY_SCORE`.
8. The LLM receives only the matched MovieRa context and must answer from that context.
9. The UI shows the answer and the source documents used.

Run retrieval checks after changing knowledge-base files or RAG settings:

```bash
npm run eval:rag
```

## Database Direction

The local JSON vector index is fine for this local RAG phase.

Before putting this inside the live MovieRa web app, move the vector index to:

```text
Postgres + pgvector
```

Why:

- It can handle 20-30 simultaneous users comfortably for this RAG workload.
- It keeps normal app data and vector search in one database.
- It supports metadata filters later, such as role, venue, account, and document status.
- It is easier to back up, monitor, and migrate than a local JSON file.

Future production tables:

```text
rag_documents
rag_chunks
rag_queries
rag_feedback
```

For the current phase, keep the local vector index until the RAG quality is good.

## V1 Guardrails

- Answer only from uploaded knowledge-base content.
- Show source documents.
- Say when the answer is missing.
- Do not perform real actions.
- Do not access real MovieRa data.
- Do not invent operational facts.
- Do not expose secrets, API keys, customer data, payment data, or live records.

## Admin Dashboard Integration

The authenticated admin dashboard chat now uses this service for staff questions. Keep this service running alongside the main API:

```bash
npm run dev
```

The main API connects to `http://127.0.0.1:8787` by default. Set `STAFF_AI_URL` on the main API when the Staff AI service is hosted elsewhere. Staff answers remain read-only and include the matched guide sources; the separate customer assistant is unchanged.

## Important Notes

- Rebuild the index with `npm run index` after changing files in `knowledge-base/`.
- If the knowledge base changes but the index is stale, the assistant asks for a rebuild instead of answering from old content.
- Do not commit real API keys, customer data, payment data, waiver data, or live MovieRa records.

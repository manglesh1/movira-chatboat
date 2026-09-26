# RAG Storage Plan

## Current production design

Movira Staff Help uses a versioned JSON vector index built from the global Markdown help files:

```text
knowledge-base/*.md
  -> batched embedding build
  -> backend/.cache/vector-index.json
  -> read-only in-memory search in every API instance
```

This is the appropriate design while Help documents are maintained with the application. The current index is small, loads without an operational-database query, and is identical for every park. New parks require no new Help index.

At request time, the system embeds the question, retrieves at most five strong sections, and asks the Help model for a short grounded answer. Exact normalized repeat questions and question embeddings use bounded expiring caches. Source names and retrieval metadata remain internal.

PostgreSQL stores only expiring Staff AI conversation/selection context and cross-instance request leases. It does not store raw staff questions, generated Help answers, analytics results, or customer data.

## When pgvector becomes useful

Move Help documents and chunks to PostgreSQL with pgvector only when Movira needs runtime document upload, approval, activation, deletion, version rollback, or document-level permission filters without an application deployment.

Suggested future tables:

```text
staff_ai_documents
staff_ai_document_versions
staff_ai_chunks
```

Do not create query/answer history tables by default. Add them only with an explicit privacy and retention design.

## Operational rules

- Rebuild the vector index whenever a Markdown file or embedding model changes.
- Deploy the documents and matching index as one versioned artifact.
- Refuse Help requests when the index hash is stale.
- Keep retrieval limits and completion-token limits bounded.
- Never use RAG for live park analytics; use the authorized reporting APIs.
- Load-test provider and database capacity before increasing per-instance concurrency.

# RAG Database Plan

## Current Phase

The standalone RAG implementation uses a local JSON vector index:

```text
backend/.cache/vector-index.json
```

This is acceptable while testing RAG quality locally because it keeps setup simple and avoids adding database work too early.

## Recommended Production Database

Use:

```text
Postgres + pgvector
```

This is the best first production choice for MovieRa because it can support the expected 20-30 simultaneous users and later support filters for role, venue, account, document type, and document status.

## Why Postgres + pgvector

- One database can store documents, chunks, embeddings, queries, and feedback.
- Vector search can run with normal metadata filters.
- It is easier to back up and monitor than a local JSON file.
- It fits the future MovieRa app integration better than a separate vector-only service.
- 20-30 concurrent users is a modest workload if indexes, pooling, and request limits are configured correctly.

## Future Tables

```text
rag_documents
rag_chunks
rag_queries
rag_feedback
```

## rag_documents

```text
id
title
source_name
source_type
content_hash
status
created_at
updated_at
```

## rag_chunks

```text
id
document_id
title
heading
chunk_index
content
embedding
embedding_model
content_hash
created_at
updated_at
```

## rag_queries

```text
id
question
answer
matched_chunk_ids
latency_ms
created_at
```

## rag_feedback

```text
id
query_id
rating
comment
created_at
```

## Scale Notes For 20-30 Users

Use connection pooling and keep each request lightweight:

```text
Frontend request
  -> backend
  -> embed question
  -> pgvector top-k search
  -> LLM answer
  -> response with sources
```

Recommended starting settings:

```text
top_k: 6-10 chunks
minimum_similarity_score: 0.28-0.35
max input length: 2,000-4,000 characters
database pool size: 10-20 connections
request timeout: 30-45 seconds
```

Move from local JSON to Postgres only after local RAG answers are accurate.

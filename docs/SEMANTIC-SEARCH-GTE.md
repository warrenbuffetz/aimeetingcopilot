# Semantic search — Supabase gte-small

## Architecture audit (pre-change baseline)

| Area | Finding |
|------|---------|
| **Q&A storage** | `prepared_qa` (+ `navigator_meta`, `follow_ups`) — unchanged |
| **Legacy vectors** | `search_embeddings.embedding vector(1536)` + HNSW, OpenAI `text-embedding-3-small` via seed script |
| **Live analyze path** | `POST /api/analyze` → `analyzeQuestionLocal` → lexical/context hybrid; optional OpenAI RPC when `USE_OPENAI_SEMANTIC=true` |
| **Hybrid merge** | `rankPreparedQaHybrid` (62% semantic / 38% lexical) + round boost + context-aware follow-ups |
| **Auth** | Supabase Auth (`requireUser` on analyze); RLS on `prepared_qa` by `user_id` |
| **STT** | Browser Whisper / Web Speech — independent of semantic layer |
| **Production gap** | OpenAI embeddings skipped (no credits) → `search_embeddings` empty |

## New stack

| Piece | Role |
|-------|------|
| **`prepared_qa_embeddings`** | `vector(384)`, gte-small, per question variant |
| **Edge `gte-embed`** | Inference for backfill (service role) or authenticated user |
| **Edge `match-prepared-qa`** | Embed query + `match_prepared_qa_embeddings` RPC (user JWT) |
| **App** | `SEMANTIC_PROVIDER=supabase_gte` (default) → `semanticSearchGte` + existing hybrid |

Legacy `search_embeddings` (1536) is **not** dropped.

## Environment

```bash
# apps/web/.env.local and Vercel
SEMANTIC_PROVIDER=supabase_gte   # default
# SEMANTIC_PROVIDER=lexical_only  # rollback

# Deprecated — no longer used for retrieval:
# USE_OPENAI_SEMANTIC=true
```

OpenAI may remain configured for optional chat generation paths in `analyze.ts` (non-live analyze); live copilot uses local/hybrid prepared matching.

## Manual setup (Supabase)

1. **Run migration**  
   `supabase/migrations/20251026130000_prepared_qa_embeddings_gte.sql`  
   (SQL editor or `supabase db push`)

2. **Deploy Edge Functions**  
   ```bash
   supabase functions deploy gte-embed --project-ref YOUR_REF
   supabase functions deploy match-prepared-qa --project-ref YOUR_REF
   ```

3. **Backfill vectors** (does not change Q&A text)  
   ```bash
   npm run embed:qa:gte
   ```  
   Report: `data/migration/embed-gte-report.json`

4. **Vercel**  
   Ensure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.  
   No OpenAI key required for semantic matching.

## Evaluation

```bash
npm run eval:retrieval
# or full suite
npm test
```

Lexical/hybrid/context accuracy is measured offline against the Questrade seed library.  
After backfill, validate hosted Edge inference on staging (local Deno AI may differ from hosted runtime).

## Operational notes

- Seed script **skips** OpenAI embedding upserts when `SEMANTIC_PROVIDER=supabase_gte`.
- Semantic status on live UI is separate from microphone/STT badges.
- Analyze requests: cached 45s, stale-response guard via sequence id.

# Questrade expansion review — final apply report

**Date:** 2026-10-26  
**Apply script:** `scripts/apply-questrade-expansion-review.mjs --apply`  
**Detail JSON:** `data/migration/apply-questrade-expansion-review-report.json`

## Review metadata

| Item | Count |
|------|------:|
| `reviewStatus` updates (imported expansion rows) | 90 |
| Review skipped (dedup / alias-only) | 2 |
| Arc canonical Q&A rewrite | 1 (`needs_review` preserved) |
| Q5 transition aliases added | 5 (13 total on Q5) |
| P0 alt phrase merges | 25 import keys → **150** phrases proposed; applied per-key in report |
| Embed candidates | 26 Q&A IDs |

## Arc current-status fix

- **ID:** `1c3f6b10-2b62-4807-bffd-ef21beef30d7`
- **Old:** What was actually live when you left Arc'teryx, and what was still planned?
- **New:** What is live from Arc'teryx's membership and Sperro SV work, and what remains planned?
- Answer text updated from `questrade-arc-current-status-answer-proposal.json`.

## Seed & Supabase

- `npm run seed:questrade:full` — **261** seed rows; **258** active in audit (3 inactive).
- `seed-library.mjs` now upserts by stable `qa.id` and updates `question` on existing rows (fixes Arc rename without duplicate PK).

## Embeddings

- `EMBED_QA_IDS=<26 ids>` + `npm run embed:qa:gte`
- **156** variants embedded, **67** unchanged, **0** failures  
- Report: `data/migration/embed-gte-report.json`

## Retrieval

- P0 `altPhrasings` merged into lexical `followUps` via `lexicalRowsFromEnriched` (shared + `analyze-local.ts`).
- Tests: `expansion-retrieval-validation.test.ts` (9 cases) + existing Sperro / expansion conversation tests — **41/41** navigator tests passing.

## Sperro five-pack

- Answer text untouched; `reviewStatus: ok` on Q1 meta preserved.

## Commands (replay)

```bash
npm run apply:expansion-review:dry
npm run apply:expansion-review
npm run seed:questrade:full
EMBED_QA_IDS="$(node -e "console.log(require('./data/migration/apply-questrade-expansion-review-report.json').embedCandidateIds.join(','))")" npm run embed:qa:gte
npm run audit:questrade:qa
cd packages/shared && npx vitest run src/navigator/__tests__/
```

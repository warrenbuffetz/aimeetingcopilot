# Questrade Top 115 curated contextual follow-ups — import report

## Reconciliation (`npm run reconcile:questrade-curated-followups`)

| Metric | Count |
|--------|------:|
| Round placements examined | 115 |
| Unique anchor placements | 115 |
| Curated edges examined | 557 |
| Edges resolved to live IDs | **557** |
| Unresolved anchors | **0** |
| Unresolved targets | **0** |
| Excluded inactive/superseded | 0 |
| Anchors with **no** eligible children | 1 |

### Anchor with empty follow-up list (by design)

- **What are your compensation expectations?** (`93f1f35c-…`) — recruiter placement has no curated children; UI shows empty state (test 9).

### Five-pack resolution

Local keys **F1–F5** resolve via `importKey` `sperro-five-qa-2026-q01` … `q05` against live export (e.g. F1 → `1fd9478b-…` current Arc'teryx/Sperro, **not** stale `e8638ed2` from seed file).

## Storage

| Artifact | Purpose |
|----------|---------|
| `data/editorial/questrade-top115-curated-contextual-followups.json` | Source curated graph |
| `data/migration/questrade-curated-contextual-followups-resolved.json` | Live UUID resolution + reasons |
| `packages/shared/src/navigator/questrade-curated-contextual-followups-resolved.json` | Runtime bundle for Live UI |
| `navigator_meta.curatedContextualFollowUpsByRound` | Optional DB copy (apply script) |

## Runtime algorithm

`packages/shared/src/navigator/contextual-follow-ups.ts`:

1. Lookup `anchorId + activeInterviewRound` in resolved map (fallback to other rounds only if current round missing).
2. Filter: profile eligibility, inactive, asked, paraphrase of current question.
3. Up to 4 (8 on Show more). **No** TOP INTERVIEW QUESTIONS backfill, **no** module-wide intent scoring.
4. If no curated path: narrow `relatedQuestionIds` / child links only.

## Supabase apply (optional)

```bash
npm run apply:questrade-curated-followups:dry-run   # inspected: 90 anchors would update meta
npm run apply:questrade-curated-followups           # writes meta only; no Q/A/embeddings
```

Dry-run (2026-10-27): **90** anchors updated, **0** missing, **0** errors.

## Tests

`npx vitest run packages/shared/src/navigator/__tests__/contextual` — **16 passed** (intro per round, Interac, Sperro, direct deposit, compensation empty, Simplii exclusion, round reorder).

## Unchanged

- No prepared answer text, evidence flags, or embeddings modified.
- Simplii profile records untouched.

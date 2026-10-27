# Questrade Tier 2 consistency — change report

Generated: 2026-10-27 (apply pass)

## Summary

Implemented approved **Option C (hybrid)** for Aeroplan/HBC measurement, **Arc'teryx body replacement** on `1c3f6b10-…`, behavioural intent routing, and archive of illustrative experiment essays. No weakness rewrite. Simplii: report-only (export not present in repo).

## Primary vs archived

| Intent | Primary ID | Archived ID | Action |
|--------|------------|-------------|--------|
| Aeroplan 40% measurement | `0e33272e-0d91-49a8-8d6d-e74881372454` | `8f93a4d4-6570-4ae8-8e29-ff5f1c6218b4` | Superseded + `retrievalExcluded`; aliases merged; 4 supplemental talking points |
| HBC 15% measurement | `722da43e-9883-44ce-800c-97a0aafbc694` | `3218b561-2159-442e-a3aa-074756f877c0` | Same; relative-vs-pp talking points |
| Arc'teryx live vs planned | `1c3f6b10-2b62-4807-bffd-ef21beef30d7` | — | Full + spoken + short body replaced (current-employment rehearsal) |
| Weakness | `39a0bcf9-7d01-4cde-8da4-4ff893da44b3` | — | Unchanged |
| Product mistake (Q3) | `c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f` | `e9627c89-…` (already inactive) | Unchanged; `unverified_detail` preserved |
| Didn't go to plan | `15aa03e2-46af-4d60-9d73-90ed342c6ccc` | — | Sperro supplemental talking point + link to `1fd9478b-…` |

## Embeddings

- Re-embedded: `1c3f6b10-…` only (searchable answer text changed).
- Not re-embedded: primaries where only `supplementalTalkingPoints` / metadata changed.

## Retrieval

- `packages/shared/src/navigator/conversational-retrieval.ts`: `QUESTRADE_TIER2_CANONICAL` IDs + intent boosts (measurement, weakness, mistake, didn't-go-to-plan, failed-product penalty, Arc'teryx live/planned).
- HBC attribution follow-up `2af89a04-…` repointed to primary parent `722da43e-…` (not archived illustrative essay).

## Commands

```bash
npm run apply:questrade:tier2:apply:embed   # idempotent re-apply
npm run test -w @interview-copilot/web -- --run questrade-tier2-consistency
npm run report:simplii:shared               # when Simplii export exists
```

## Tests

`questrade-tier2-consistency.test.ts` — 10 validation scenarios from your spec (+ archive exclusion checks).

## Still flagged for your factual review

- Aeroplan primary: exact funnel numerator/denominator (`needs_review` on `0e33272e`).
- HBC primary: relative 15% vs source reporting (`needs_review` on `722da43e`).
- Arc'teryx: Sperro benefit fulfilment involvement (`reviewNotes` on `1c3f6b10`).
- Explicit **failed product** question: no verified canonical; retrieval avoids auto-routing to Q3/Sperro adaptability stories.

# Questrade tone audit — Pass 1 (P0) applied

Applied: 2026-10-27 via `scripts/apply-questrade-tone-audit-p0.mjs --apply --embed`

## What changed (13 rows)

| ID | Fix |
| --- | --- |
| `93f1f35c` | Documented comp consistency in `reviewNotes` (canonical $185–205K base; `fbb01b9e` inactive duplicate) |
| `009d20a6`, `f7e403b2`, `8150bb81` | Stripped export artifacts (wrapping quotes + stray section headings) from `answer` |
| `db88df8e` | Removed author-verification sentence from canonical `answer`; added spoken variant |
| `c8d4a611` | Rewrote to past-tense evaluation narrative (no invented benchmark %) |
| `7c079cf5` | Removed markdown section headings from `answer`; added ~90s spoken variant |
| `a8fe6bd5`, `6844c2e7` | Full `answer` retained; added spoken variants only |
| `0e33272e`, `722da43e` | Full cautious `answer` retained; spoken polish from audit proposals |
| `af5bd3a4` | Softened opening; verification caveat; `evidenceStatus` → `unverified_detail` |
| `c88f487e` | Full story retained; decision-first spoken variant + factual `reviewNotes` |

## Embeddings

Re-embedded 7 IDs where canonical `answer` text changed (3 new variants, 26 unchanged aliases).

## Factual queue

See `data/review/questrade-tone-audit-evidence-queue.md` for `af5bd3a4` and `c88f487e`.

## Pass 2

P1 approval table: `data/review/questrade-tone-audit-p1-review.md` (33 rows, not applied).

# Live interview: contextual follow-ups vs top interview questions

## Centre panel — contextual follow-ups

**Module:** `packages/shared/src/navigator/contextual-follow-ups.ts` → `suggestContextualFollowUps`

**Inputs:** full catalog, session context, active matched prepared row, last few detected questions.

**Ranking (highest first):**

1. **Questrade Top 115** round-specific curated paths (`data/editorial/questrade-top115-curated-contextual-followups.json`, resolved to `packages/shared/src/navigator/questrade-curated-contextual-followups-resolved.json`). Reconcile: `npm run reconcile:questrade-curated-followups`.
2. If no curated path: narrow `relatedQuestionIds` / child links only (no module-wide intent flood).
3. Same experience module + intent transitions — **disabled** for `career-general` intros (prevents generic PM flood).
4. Product-case rows stay on the same case module/section; experience stories stay on the same employer module.
5. Light lexical signal from recent detections (same module only).

**Limits:** up to **4** strong suggestions by default (no backfill); optional **Show more** (8). Minimum score **0.55**. Empty copy: “No strong follow-ups identified for this answer.”

**Profile isolation:** `interviewProfile` filters Simplii-branded / `simplii-*` import keys on Questrade, and Questrade/Questbank/Temenos on Simplii. Defence against mixed catalog when no profile is selected in the loader.

**Exclusions:** retrieval-excluded rows, already-asked IDs, paraphrases of the current detected or library question (≥0.88 lexical similarity), active row itself.

**Recompute deps (Live):** matched prepared row ID, detected question, asked IDs — not full navigator browse context.

**UI:** Up to 5 `AnswerPreviewCard` previews; **Open in main panel** uses browse path (`skipContextUpdateRef`, `openPreparedRow`) — no auto-analyze, respects answer lock.

## Right navigator — top interview questions

**Module:** `packages/shared/src/navigator/top-interview-questions.ts` → `suggestTopInterviewQuestions`

**Inputs:** catalog + `activeInterviewRound` (defaults to recruiter) + asked IDs (for display only).

**Not used:** active experience module, active intent, or latest detected question (stable shortlist).

**Ranking:**

1. Curated per-round list (`data/editorial/questrade-top-questions-by-round.json`, mirrored in shared package) — rank order and VH/H/M/L tiers; reason label e.g. `Recruiter #3 · VH`.
2. Fuzzy match editorial wording to catalog rows (≥0.55 Jaccard/substring), with manual maps in `data/editorial/questrade-top-question-library-overrides.json` for close paraphrases.
3. Remaining slots: heuristic fallback (`roundRelevance`, P0/P1 tags, round topic patterns, `isPreferred`, canonical dedupe).

Intro / Why Questrade / current Arc'teryx appear high in **recruiter, hiring manager, and panel** lists (not recruiter-only).

**Gap report:** `node scripts/resolve-editorial-top-questions.mjs` → `data/migration/editorial-top-questions-gaps.md`.

**UI:** Heading **TOP INTERVIEW QUESTIONS**; 5 visible by default, **Show all** expands to the full round list (35 / 40 / 40); optional **Hide asked**; subtle **Asked** label when `askedQuestionIds` contains the row ID.

## Asked-question tracking

- Unchanged: `applyContextResolution` appends `matchedRowId` only when a prepared answer is matched to a detection — not when browsing suggestions or mentioning a topic.
- Right panel can hide asked rows without changing rank order.

## Other answer matches

- Collapsed `<details>` **OTHER ANSWER MATCHES** below contextual follow-ups.
- Auto-opens when confidence &lt; prepared threshold or ≥2 alternatives.
- Percent similarity removed from UI; label **Alt** only.

## Tests

- `packages/shared/src/navigator/__tests__/contextual-and-top-questions.test.ts` — recruiter shortlist, stability vs experience context, round change, RBC contextual chain.

## Metadata gaps

- Many rows lack dense `relatedQuestionIds`; contextual list leans on intent transitions until graph is enriched.
- `roundRelevance` missing on some banking-generic rows → lower recruiter placement (expected).
- Experience-gap cards use separate import keys; contextual links follow `relatedExternalIds` only after DB link resolution.

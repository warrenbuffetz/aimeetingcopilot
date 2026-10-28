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

**Profile isolation:** See `docs/profile-content-strategy.md`. Runtime eligibility (`isPreparedRowEligibleForProfile`) hides only **job-specific** rows (career/motivation, why-this-company) for the other employer—not shared experience answers that mention a company in passing. Editorial top lists and contextual paths remain per profile.

**Exclusions:** retrieval-excluded rows, already-asked IDs, paraphrases of the current detected or library question (≥0.88 lexical similarity), active row itself.

**Recompute deps (Live):** matched prepared row ID, detected question, asked IDs — not full navigator browse context.

**UI:** Top-question `AnswerPreviewCard` previews; **Open in main panel** uses browse path (`skipContextUpdateRef`, `openPreparedRow` with library question as headline) — no auto-analyze, respects answer lock.

## Right navigator — top interview questions

**Module:** `packages/shared/src/navigator/top-interview-questions.ts` → `suggestTopInterviewQuestions`

**Inputs:** catalog + `activeInterviewRound` (defaults to recruiter) + asked IDs (for display only).

**Not used:** active experience module, active intent, or latest detected question (stable shortlist).

**Active experience UI:** Hidden on the Navigator **Next** tab (matching still uses a pin set from **Experiences** / **All Answers** or auto-detection). **Interview round (editorial)** stays on **Next**.

**Browse library filters (Experiences + All Answers):** `packages/shared/src/navigator/browse-filters.ts` → `filterCatalogForBrowse`. **Active experience** (auto or manual pin) and **Interview round** narrow the Experiences tree, All Answers list, section dropdown, and review queue. Round filter keeps rows with `roundRelevance` of medium or higher for that round. Counts on experience modules, round options, company/module/intent groups, and library sections reflect the filtered totals so you can see applicability. Non–`product_experience` rows (e.g. people leadership) appear under **Other library sections** on Experiences when they match the filters.

**Section dropdown by profile:** `librarySectionsForProfile` hides the branded label **Questrade Product Cases** on Simplii only. Other sections (including People Leadership) are shared labels and appear on both profiles.

**Active experience dropdown by profile:** `experienceModulesForProfile` hides `questrade-*` modules on Simplii and `digital-banking-*` modules on Questrade. Shared resume modules (RBC, HBC, Aeroplan, Arc'teryx) and career/leadership pins stay on both.

**Story Map tab:** `docs/story-map-navigator.md` — MAP | progressive drill-down, multi-branch indexing (`packages/shared/src/navigator/story-map/`), in-map search, browse-only (Open in main panel uses existing `fromBrowse` path).

**Ranking:**

1. Curated per-round list (`data/editorial/questrade-top-questions-by-round.json`, mirrored in shared package) — rank order and VH/H/M/L tiers; reason label e.g. `Recruiter #3 · VH`.
2. Fuzzy match editorial wording to catalog rows (≥0.55 Jaccard/substring), with manual maps in `data/editorial/questrade-top-question-library-overrides.json` for close paraphrases.
3. Remaining slots: heuristic fallback (`roundRelevance`, P0/P1 tags, round topic patterns, `isPreferred`, canonical dedupe).

Intro / Why Questrade / current Arc'teryx appear high in **recruiter, hiring manager, and panel** lists (not recruiter-only).

**Gap report:** `node scripts/resolve-editorial-top-questions.mjs` → `data/migration/editorial-top-questions-gaps.md`.

**UI:** Heading **TOP INTERVIEW QUESTIONS**; as many collapsed rows as fit the panel height (ResizeObserver), then **Show N more** / **Show fewer** for the rest; optional **Hide asked**; subtle **Asked** label when `askedQuestionIds` contains the row ID.

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

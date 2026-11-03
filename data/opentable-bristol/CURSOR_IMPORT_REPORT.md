# Cursor import report — OpenTable Bristol (Nov 3, 2026)

## Canonical merge

- **Conflicts on overlapping keys:** 0 (stopped-and-ask rule not triggered).
- **`apps/web/src/data/bristol-canonical-answers.json`:** 6 Questrade UUIDs unchanged; **125** OpenTable keys (14 legacy + 111 `opentable-bristol-20261103-*`).
- **Legacy `opentable-rec-*` on Bristol rows:** none.

## Profile content

- **`bristol-focused-curated.json`:** 111 questions, **7** Questions for Bristol, full authored answers.
- **New IDs:** B61–B66, SC11–SC13.
- **UI:** Scenario panel shows structured response + collapsible **Suggested twist response**; **Personal review** badge when `evidenceStatus === requires_personal_review` (B45, B51, B56–B58, B59, B60).

## Docs copied to `data/opentable-bristol/`

- `README_CURSOR_IMPORT.md`, `MAPPING_REPAIR_REPORT.md`, `ANSWER_REVIEW.md`, `45_MINUTE_INTERVIEW_PLAN.md`
- `answer-authoring-backlog-complete.json`, `answer-authoring-backlog-by-type-complete.json`
- `P0_PREDICTION_UPDATED.md`, `WEAKNESS_TRACKER_UPDATED.md`

## Generator

- `npm run generate:bristol-focused` **preserves** imported curated JSON when 111+ authored rows are present.
- Force seed rebuild: `BRISTOL_FORCE_REGEN=1 npm run generate:bristol-focused`

## Validation

- `validateBristolDataset()` — empty issues
- `npm test` — Bristol + Jaz (19 tests) pass

## Unchanged

- Questrade Jaz curated answers, Simplii review data, shared Questrade canonical bodies (byte-identical on overlap).
- Browser-local Bristol edit overrides (`bristol-focused/edits`) — still apply on top of curated text.

## Your follow-up

1. Review **Personal review** items in `/live/bristol`.
2. Rehearse from `45_MINUTE_INTERVIEW_PLAN.md` and `ANSWER_REVIEW.md`.
3. Confirm role scope with Bristol (B66) — do not treat recruiter vs JD ambiguity as resolved.

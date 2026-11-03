# Cursor import instructions — OpenTable / Bristol (45-minute call)

## What this package contains

- `bristol-focused-curated.json` — **main profile payload**, 111 answered question and reference records; includes question priority, aliases, short/long answer, scenario twists and responses, updated battlecard, interview predictions, seven questions for Bristol and provenance.
- `bristol-canonical-answers-merge.json` — **merge candidate** that preserves all original Questrade/shared and earlier OpenTable entries and adds 111 Bristol-only record IDs. Do not replace a newer local canonical file wholesale.
- `answer-authoring-backlog-complete.json` and `answer-authoring-backlog-by-type-complete.json` — reconciliation/status manifests for the same 111 items.
- `ANSWER_REVIEW.md` — entire answer library in readable prose, including follow-up twists.
- `45_MINUTE_INTERVIEW_PLAN.md` — compact priority and rehearsal guide.
- `MAPPING_REPAIR_REPORT.md` — previous mapping problems and checks.

## Implement in Cursor — paste this prompt

> Import the attached **OpenTable_Bristol_Cursor_Import** package into the existing **OpenTable — Bristol (Focused)** profile. First inspect the current implementation, schema, and its actual canonical/override answer resolver. Use `bristol-focused-curated.json` as the desired profile content, including all 111 question IDs and `questionsForBristol`. Map `shortAnswer`, `answer`, provenance, P0/P1/P2 priority, aliases, scenario twist, and `responseToTwist` into the application's existing data structures. If an additive field isn't supported, adapt it without dropping content. Use `bristol-canonical-answers-merge.json` as a **reference for safe additive entries**, not as a blind file replacement: merge only the new `opentable-bristol-20261103-*` entries into the current canonical store if they aren't there, preserve any edits newer than this export, and do not modify or duplicate Questrade shared answers. Bristol-specific overrides must resolve before any shared fallback; no Questrade-specific override may resolve into the Bristol profile. Remove old *mislinked* record pointers in this profile; don't delete the underlying historical records. Verify every displayed question matches its answer, all 111 records are searchable, scenarios show both original case and twist, pins/topic map still work, and Questrade/Simplii are unchanged. Report conflicts instead of silently overwriting. Do not generate or rewrite interview content.

## Important mapping rules

1. The old export had mismatched question-to-answer mappings in **B04–B06, B41–B48 and B52–B54**, among others. The IDs, not the old record number, are the authoritative identity for this profile.
2. `opentableRecordId` values have been intentionally regenerated as `opentable-bristol-20261103-{curatedKey}`. This avoids accidental reuse of earlier `opentable-rec-008`, etc., whose **questions differ from the current labels**.
3. Shared canonical links remain ONLY where the original story is genuinely the same topic (B40, B49, B50, B55). Their OpenTable overrides are more specifically worded; do not rewrite shared canonical bodies for Questrade.
4. Scenario and reference content is hypothetical/educational. Do not treat it as a factual OpenTable initiative or user-shipped product.
5. Seven entries are flagged `requires_personal_review` (B45, B51, B56, B57, B58, B59, B60). These are drafted conservatively, but user should confirm exact personal history or philosophy.
6. Respect the interview instruction: **do not use AI during the live behavioral interview**. These answers are for practice and review beforehand, not live AI assistance.

## Interview-specific product reality checks

The recruiter described a broader restaurant team remit: front of house, availability planning, experiences, and global expansion. The public job description emphasizes building AI/ML-enabled restaurant revenue products. **Do not resolve the ambiguity by inventing a reporting line or changed role scope. Ask Bristol.**

OpenTable already has restaurant-defined Table Automations, one-tap changes to availability and pacing, Turn Times and Availability Insights, and natural-language reporting in testing. The proposed service-aware advisor is an **extension hypothesis**, not an invention of existing controls.

Official source pages for product check:
- Job description: https://job-boards.greenhouse.io/opentable/jobs/8737825002
- August 2026 product release: https://www.opentable.com/blog/press/page/summer-product-launch/
- Table Automations: https://www.opentable.com/restaurant-solutions/products/table-management/automations/
- Product innovation and testing: https://www.opentable.com/restaurant-solutions/product-innovation/

## Acceptance tests

- All 111 records show the correct question and corresponding answer.
- Every answer has a compact `shortAnswer` and an untruncated full `answer`.
- SC01–SC13 include original scenario, twist and a twist response; SC11–SC13 are new.
- B61–B66 are new and accessible in the correct categories.
- Shared canonical Questrade records are byte-for-byte unchanged by this package.
- All 14 prior OpenTable canonical entries are retained; new records are additive.
- No legacy wrong `opentable-rec-*` pointers remain on Bristol questions after migration.
- Bristol's product scope remains explicitly unresolved pending his/her actual explanation.
- Topic Map, question search, shortcuts, pinning, and short/full modes continue to work.

## Validation completed in this export

- Python JSON parse for all payloads: passed.
- 111 distinct question IDs and 111 distinct new OpenTable record IDs: passed.
- Question title, full answer and records cross-match: passed.
- All original Questrade canonical and historic OpenTable records unchanged: passed.
- All entries have non-placeholder answer text: passed.

**Limit:** These files have not been imported or regression-tested against your running Cursor application here; the instructions above require Cursor to do that validation in the application.

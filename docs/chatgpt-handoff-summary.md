# ChatGPT handoff — Simplii Senior PM interview library

Phases **1–5** are complete. Phase **6** runs when `imports/simplii_final_qa.json` is ready.

## Simplii profile (empty, functional)

| Field | Value |
|-------|--------|
| Name | Simplii Financial — Senior Product Manager |
| Employer | Simplii Financial (CIBC) |
| Interview | Wed Oct 28, 2026, 12:00–12:45 PM Eastern (in `job_description`) |
| Prepared Q&A | **0** (intentionally empty pending external content) |

Refresh profile metadata: `node scripts/ensure-simplii-profile.mjs`

## Upload these files to ChatGPT

1. `exports/questrade_interview_library.json` — full Questrade source library
2. `exports/questrade_proposed_expansion.json` — proposed 92-pack entries **not** already in Supabase
3. `exports/questrade_content_inventory.json` — per-question IDs, relationships, brand-term hints
4. `schemas/interview_qa_import.schema.json`
5. `docs/interview_qa_import_contract.md`
6. Simplii JD: `JD_Sr Product Manager.pdf` (workspace attachment)

Regenerate exports after Questrade library changes:

```bash
npm run export:questrade-library
```

## Source library snapshot (at export time)

Re-run `npm run export:questrade-library` for current counts. Typical shape:

| Metric | Approx. |
|--------|--------|
| Total Questrade rows | 261 |
| Active | 258 |
| Inactive / superseded | 3 |
| Parents with embedded follow-ups | ~110 |
| Embedded follow-up snippets | ~395 |
| Proposed expansion not in DB | 1 (see `questrade_proposed_expansion.json` summary) |

**Note:** `Questrade_Proposed_Followup_Expansion.json` is represented in-repo as `data/migration/questrade-followup-expansion-current-arcteryx.json`. Most entries were already imported into Supabase via the follow-up-92 pipeline; the export file lists only entries **not** present in the database.

## ChatGPT deliverable

Produce `imports/simplii_final_qa.json` conforming to schema v1.0.0:

- Simplii-specific motivation and case questions (no bulk unreviewed Questrade clone).
- Natural spoken answers; preserve verified metrics and ownership boundaries from source exports.
- `externalId` stable per canonical question.
- `adaptationType` + `sourceQuestradeRecordId` when reusing source material.
- `preparationTier` P0/P1/P2 and `roundRelevance` for recruiter / hiring manager / panel.
- Embedded `followUps` and/or standalone rows with `parentExternalId` as needed.

## Phase 6 (after JSON is ready)

```bash
node scripts/import-simplii-final-qa.mjs imports/simplii_final_qa.json
node scripts/import-simplii-final-qa.mjs imports/simplii_final_qa.json --apply --embed
npm run validate:simplii   # optional hygiene checks
```

## Cursor constraints honored

- Questrade records not modified by export/reset/import tooling (integrity hash verified).
- No auto-generated Simplii answers in the live profile.
- No API keys or credentials in export files.

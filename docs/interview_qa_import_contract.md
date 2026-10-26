# Interview Q&A import contract (v1.0.0)

Externally authored Simplii content is delivered as a single JSON package and imported **verbatim** by `scripts/import-simplii-final-qa.mjs`. Cursor does not rewrite answers during import.

## File location

| Role | Path |
|------|------|
| ChatGPT output (Phase 6) | `imports/simplii_final_qa.json` |
| JSON Schema | `schemas/interview_qa_import.schema.json` |
| Validator (runtime) | `scripts/lib/validate-interview-qa-import.mjs` |

## Target profile

- **Name:** `Simplii Financial — Senior Product Manager`
- **ID:** Resolved at import time (create empty profile with `node scripts/ensure-simplii-profile.mjs`).
- Optional `targetProfile.id` in the package if the UUID is known.

## Package shape

```json
{
  "schemaVersion": "1.0.0",
  "packageId": "simplii-2026-10-28-pass-1",
  "authoredBy": "ChatGPT",
  "authoredAt": "2026-10-27T12:00:00Z",
  "targetProfile": {
    "name": "Simplii Financial — Senior Product Manager"
  },
  "records": [ /* see below */ ]
}
```

## Record fields (canonical row)

Each `records[]` item is one `prepared_qa` row in Supabase.

| Field | Required | Maps to |
|-------|----------|---------|
| `externalId` | Yes | `navigator_meta.importKey` + `externalContentId` (idempotent upsert) |
| `canonicalQuestion` | Yes | `prepared_qa.question` |
| `answer` | Yes | `prepared_qa.answer` (full spoken script) |
| `spokenAnswer` | No | `navigator_meta.spokenAnswer` |
| `shortAnswer` | No | `navigator_meta.shortAnswer` |
| `aliases` | No | `navigator_meta.altPhrasings` |
| `followUps` | No | `prepared_qa.follow_ups` (`{ question, answer, notes? }`) |
| `parentExternalId` | No | Adds this row’s UUID to parent’s `relatedQuestionIds` (pass 2) |
| `relatedExternalIds` | No | `navigator_meta.relatedQuestionIds` (UUIDs after import) |
| `adaptationType` | Yes | `navigator_meta.adaptationType` (`reused`, `lightly_edited`, `rewritten`, `newly_authored`) |
| `sourceQuestradeRecordId` | No | `navigator_meta.sourceQuestradeRecordId` (provenance only) |
| `preparationTier` | No | `navigator_meta.preparationTier` + `topicTags` |
| `roundRelevance` | No | `navigator_meta.roundRelevance` |
| `questionIntent` | No | `navigator_meta.intent` |
| `experienceModuleId` / `experienceLabel` | No | Navigator experience context |
| `librarySection` / `libraryCategory` | No | Library browse + Live ranking |
| `evidenceStatus` | No | `navigator_meta.evidenceStatus` |
| `reviewRequired` | No | Sets `reviewStatus: needs_review` when true |
| `reviewNotes` | No | `navigator_meta.reviewNotes` |
| `revisionStatus` | No | `navigator_meta.revisionStatus` (`current`, `superseded`, `archived`) |
| `isPreferred` | No | `prepared_qa.is_preferred` (retrieval boost) |
| `category` | No | `prepared_qa.category` |

### Embedded vs standalone follow-ups

- **Embedded:** `followUps` on the parent record (same as today’s Questrade library).
- **Standalone:** Separate `records[]` row with `parentExternalId` pointing to the parent’s `externalId`. Importer links via `relatedQuestionIds` on the parent.

## Experience modules

Use existing module IDs from `packages/shared/src/navigator/experience-modules.ts` (e.g. `rbc-cashback`, `career-general`, `leadership-general`). For new digital-banking case groupings, `digital-banking-*` IDs are available.

## Import commands (Phase 6)

```bash
node scripts/import-simplii-final-qa.mjs imports/simplii_final_qa.json           # dry-run
node scripts/import-simplii-final-qa.mjs imports/simplii_final_qa.json --apply
node scripts/import-simplii-final-qa.mjs imports/simplii_final_qa.json --apply --embed
```

Reports: `data/migration/simplii-final-import-report.json`

## Validation behavior

- Structural errors → import aborted; no DB writes (in `--apply` mode, validation runs first).
- Duplicate normalized questions → reported as warnings (not auto-merged).
- Missing `parentExternalId` / `relatedExternalIds` targets → errors.
- Questrade profile hash checked before/after apply; must be unchanged.

## Content authority

- Answers in the JSON file are stored exactly as provided.
- Importer does **not** paraphrase, trim, or “improve” copy.
- Factual review flags should use `reviewRequired` + `reviewNotes` rather than silent edits.

## Deprecated workflow

`scripts/import-simplii-profile.mjs` (auto-clone from Questrade) is **deprecated**. Use exports + ChatGPT authoring + this importer instead.

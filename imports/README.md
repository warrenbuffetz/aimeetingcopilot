# Simplii content import

Place ChatGPT-authored package here:

**`simplii_final_qa.json`**

See `docs/interview_qa_import_contract.md` and `schemas/interview_qa_import.schema.json`.

Dry-run: `node scripts/import-simplii-final-qa.mjs imports/simplii_final_qa.json`

## Experience-gap pack (61 shared employer/project answers)

| File | Profile |
|------|---------|
| `questrade_experience_gap_qa.json` | Questrade — Senior PM, Everyday Banking |
| `simplii_experience_gap_qa.json` | Simplii Financial — Senior Product Manager |

Dual dry-run (legacy plan report): `node scripts/dry-run-experience-gap-import.mjs`

Apply drafts (both profiles): `npm run import:experience-gap:apply`

Apply + embeddings: `npm run import:experience-gap:apply:embed`

Report: `data/migration/experience-gap-import-apply-report.json`

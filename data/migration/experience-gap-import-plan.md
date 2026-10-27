# Experience-gap Q&A import plan (dry-run)

Generated: 2026-10-26T23:48:06.115Z

**Not authorized:** production deployment or overwriting existing live answers.

## Inputs
- Pack: `/Users/johnlee/Documents/Cursor/ai meeting copilot/docs/Interview_Experience_Gap_QA_Cursor_Pack.md`
- Questrade JSON: `/Users/johnlee/Documents/Cursor/ai meeting copilot/imports/questrade_experience_gap_qa.json`
- Simplii JSON: `/Users/johnlee/Documents/Cursor/ai meeting copilot/imports/simplii_experience_gap_qa.json`
- JSON provenance: user_supplied_json

## Profiles
- Questrade: **Questrade — Senior PM, Everyday Banking** (`f96f6db8-c0e9-4341-be68-c29f6975dc5e`)
- Simplii: **Simplii Financial — Senior Product Manager** (`1aff0813-6615-4a12-bfd6-ce7603604f6b`, resolved by exact name)

## Validation
- Questrade package: OK (0 errors, 1 warnings)
- Simplii package: OK (0 errors, 1 warnings)
- Cross-profile shared text issues: **61**
- Link issues — Questrade: 0, Simplii: 0

## Planned actions (per 61 cards, both profiles)
- Questrade: create_draft=47, consolidate_or_route=7, proposed_revision=4, competing_intent_risk=3
- Simplii: create_draft=48, consolidate_or_route=7, proposed_revision=3, competing_intent_risk=3

Action kinds:
- `create_draft` — new gap row; `isAuthoritative: false`, `reviewRequired: true`
- `proposed_revision` — normalized question already exists; keep existing version, do not auto-update via `sourceQuestradeRecordId`
- `consolidate_or_route` — same module+intent with preferred live row; route broad employer questions to overview (`isPreferred`)
- `competing_intent_risk` — module+intent overlap without exact question match; avoid second live answer without supersede

## Employer overview routing (4 modules)
- `arc-overview` → module `arcteryx-membership` (Arc'teryx — Employer Overview)
- `rbc-overview` → module `rbc-core` (RBC — Employer Overview)
- `hbc-overview` → module `hbc-portfolio` (HBC — Employer Overview)
- `air-overview` → module `aeroplan-cobrand` (Air Canada / Aeroplan — Employer Overview)

## Shared content rule
61 `sharedConcept:*` tags; full, short, aliases and review notes must match across profiles (delivery-length alternatives only).

## Idempotency
Import keys are stable (`qt-exp-gap-*` / `sim-exp-gap-*`). After a future `--apply`, re-running this dry-run should classify rows as `idempotent_skip` by importKey.

## Outputs
- Machine report: `data/migration/experience-gap-import-plan.json`

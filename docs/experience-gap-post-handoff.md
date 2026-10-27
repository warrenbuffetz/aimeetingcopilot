# Experience-gap pack — what was executed vs what you still do

This tracks the **Interview_Experience_Gap_QA_Cursor_Pack.md** handoff after technical import.

## Done in the repo (automated)

| Step | Command / artifact |
|------|-------------------|
| Dual import (61×2 drafts) | `npm run import:experience-gap:apply` |
| Employer module IDs + broad-question routing | `packages/shared/src/navigator/experience-modules.ts`, `context.ts` |
| Handoff validation | `npm run validate:experience-gap` → `data/migration/experience-gap-handoff-validation.md` |
| Employer overviews enabled for **practice retrieval** (4 per profile) | `npm run experience-gap:practice-overviews` |
| Embeddings for promoted rows | Already run (32 + 20 new variants on Questrade / Simplii). Re-run after content changes: `EMBED_PROFILE_NAME=Questrade npm run embed:qa:gte` |

Draft rows stay `is_authoritative: false`. Depth cards remain `retrievalExcluded: true` until you promote them.

## Your checklist (content — not automatable)

1. **Facts table** in the pack — confirm chronology, metrics, and boundaries before treating any hypothetical card as autobiographical.
2. **Review notes** — cards marked illustrative / hypothetical / forward-looking: confirm or edit in the library (or JSON + re-import).
3. **Consolidation** — where a draft duplicates an existing live question, use the draft’s `linkedLivePreparedQaId` in metadata to decide whether to supersede the old row or keep both (recruiter vs HM depth).
4. **Promote depth cards when ready** — after review:
   ```bash
   node scripts/promote-experience-gap-practice.mjs --package-all --apply
   ```
   Then re-embed both profiles.
5. **Role-specific ranking** — adjust `roundRelevance` / `preparationTier` per profile in JSON if Questrade vs Simplii priority should differ (shared answer text unchanged).
6. **Production** — the pack explicitly deferred production deploy and overwriting authoritative live answers; treat `npm run experience-gap:practice-overviews` as practice-only until you sign off on content.

## Quick verification

- `/live` with Questrade or Simplii profile: ask *“Tell me more about your time at Arc'teryx.”* — should match the new employer overview (after overviews promote + embed).
- Answer library: filter **Experience deep dive** — 61 new rows per profile with **needs review**.

## Re-import after JSON edits

```bash
npm run import:experience-gap:apply
npm run validate:experience-gap
```

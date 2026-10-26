# Import review — Questrade follow-up expansion (current Arc'teryx scenario)

**Status:** Proposed only — **seed not modified** (awaiting your approval).

**Source:** `data/migration/questrade-followup-expansion-current-arcteryx.json` (92 draft entries)

**Reconciliation:** `data/migration/followup-expansion-92-reconciliation.md` (machine output)

## Executive summary

| Item | Count |
| --- | ---: |
| Proposed entries | 92 |
| P0 (prioritize review) | 25 |
| P1 | 67 |
| **New distinct canonical Q&As** (vs seed + inventory embedded) | **92** |
| Mapped to existing canonical answer | 0 |
| Alias-only (paraphrase) | 0 |
| Unresolved conflicts | 0 |
| Entries flagged for factual / evidence review | 1 |
| Parent `sourceParentId` links invalid | 0 |
| Seed canonical rows (pre-import) | 166 |
| Embedded follow-ups in inventory (reference) | 376 |

**Dry-run import** (`npx tsx scripts/import-followup-expansion-92.ts`): would create **92** new seed rows, **0** aliases, **92** parent-child meta links, **92** embedding candidates after apply.

**Embeddings:** Not run. After `--apply`, run `npm run embed:qa:gte` (gte-small, 384-d, changed rows only).

## Reconciliation categories

- **New distinct:** All 92 proposed questions are materially different from existing canonical and embedded inventory wording (Jaccard &lt; 0.78 vs catalog). Each has a full draft answer and valid `sourceParentId` from Supabase-ranked inventory.
- **Equivalents / aliases:** None auto-detected at current thresholds.
- **Conflicts:** None (no exact duplicate question with a different saved answer).

## Evidence and review

| `evidenceType` | Treatment on import |
| --- | --- |
| `scenario_framework` | `rehearsal_framework`, `needs_review` |
| `resume_supported_review` | `resume_supported`, `needs_review` |
| `needs_personal_example` | `unverified_detail`, `needs_review` |

**Requires personal review before activation:**

- `followup-expansion-2026-10-d13d503e478400a0` — *Tell me about a product decision you got wrong. What changed your mind?* (`needs_personal_example`)

Do not promote to `verified_accomplishment` without a real story.

## Parent-child relationships

Import uses:

- `navigator_meta.canonicalQuestionId` → parent UUID (`sourceParentId`)
- `navigator_meta.relatedQuestionIds` → `[parentId]` on child; parent gets child UUID appended
- New rows remain **standalone** prepared Q&As (searchable without walking the parent)

Registry (idempotent): `data/migration/import-registry-followup-expansion-92.json` (empty until apply).

## Career / Arc'teryx employment consistency (existing seed — no auto-edits)

| Question | Seed status | Notes |
| --- | --- | --- |
| Tell me about yourself. | Present | Current Arc'teryx role; no forbidden-pattern hits |
| Why are you looking to leave Arc'teryx? | Present | Selective exploration framing |
| Why Questrade instead of continuing at Arc'teryx? | Present | OK |
| What would it take for you to leave your current role? | Present | OK |
| Why does joining Questrade during its expansion into banking appeal to you? | Present | OK |
| Why move into everyday banking from rewards and loyalty? | Present | OK |
| **What are you currently working on at Arc'teryx?** | **Missing from seed** | **Not in the 92-pack** — use *Tell me about a complex integration you led.* or add canonical row |
| **How would you manage transitioning away from an ongoing membership initiative?** | **Missing from seed** | **Not in the 92-pack** — add separately or extend expansion |

**Proposed career follow-up (review, do not treat as verified):**

- *You're still at Arc'teryx and leading membership. Why consider Questrade now?* — parent: Why are you looking to leave Arc'teryx?

**Retired seed wording:** `Why did you leave Arc'teryx?` remains in `retireQuestions` (correct).

No seed answers imply Jan 2026 departure, layoff, unemployment, or full membership launch success.

## Retrieval changes (code, not content)

- Broader **ambiguous follow-up** detection (Interac, failure, customer visibility, consent-style probes).
- **Context-aware lexical boost** when employer/product is explicit in the utterance or session module is active.
- **Hybrid rank:** session module boost on ambiguous follow-ups; damped interview-round boost so round labels do not override strong context.

**Tests:** `followup-expansion-conversations.test.ts` + existing `interview-simulation.test.ts` / `context.test.ts`.

**Before/after retrieval metrics:** Run `npm run eval:retrieval` before and after import + embed for numeric comparison (not run in this pass).

## Gap audit (post-reconciliation)

Additional realistic follow-ups **not** in the 92-pack (candidates for a future batch):

- *How did you prevent duplicate payouts?* (under RBC Interac story)
- *What happens to the membership program if you leave?* (under transition / career)

See `gapProposals` in `followup-expansion-92-reconciliation.json`.

## Approved next steps

1. Review P0 drafts in reconciliation markdown (especially career and RBC/HBC ownership probes).
2. Edit answers in the expansion JSON if needed (preserve `importKey` and `sourceParentId`).
3. `npm run import:followup-92:apply` (or `npx tsx scripts/import-followup-expansion-92.ts --apply --p0-only` for phased rollout).
4. `npm run embed:qa:gte` then `npm run seed:questrade:full` when ready for Supabase.
5. Re-run `npm run eval:retrieval` and spot-check `/live` chains.

**Rollback:** Restore seed/meta from git; clear registry file; re-seed from previous JSON.

# Sperro five Q&A import — final report

**Completed:** 2026-10-26  
**Source:** `data/seed/questrade-sperro-five-qa-import.json`  
**Script:** `npx tsx scripts/import-sperro-five-qa.ts --apply`

## 1. Seed / Supabase summary

| Action | Count |
| --- | ---: |
| New rows inserted (seed file) | **5** |
| Existing canonical answers overwritten without review | **0** |
| Duplicates avoided | **5** (would have been 5 blind inserts; reconciled to upsert by question + stable UUID) |
| Conflicts requiring manual merge | **0** |

**Supabase seed run (`npm run seed:questrade:full`):**

- **Updated:** `What are you currently working on at Arc'teryx?` (Sperro SV answer + meta)
- **Created:** Q2, Q3, Q4, Q5 (four new `prepared_qa` rows)
- Library size after seed: **171** prepared Q&As in full JSON

**Preserved (not replaced):**

- `Tell me about a complex integration you led.` — still the broader membership-platform integration story (distinct from Q1 Sperro current-work narrative).

## 2. Canonical record IDs (seed / import registry)

| # | Import key | UUID |
| --- | --- | --- |
| Q1 | `sperro-five-qa-2026-q01` | `e8638ed2-3f9a-4c58-bc6b-5cfae62df074` |
| Q2 | `sperro-five-qa-2026-q02` | `7c4b9e12-3a6f-4d8e-9b01-5e2c8f7a1d30` |
| Q3 | `sperro-five-qa-2026-q03` | `c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f` |
| Q4 | `sperro-five-qa-2026-q04` | `a3f8c2d1-6e7b-4a9c-8d0e-1f2a3b4c5d6e` |
| Q5 | `sperro-five-qa-2026-q05` | `b8e9f0a1-2c3d-4e5f-6a7b-8c9d0e1f2a3b` |

*(If Q1 already existed in Supabase under another UUID before explicit `id` seeding, the live row ID is the one tied to that question text after upsert; registry above is the canonical import UUID used in `navigator_meta.relatedQuestionIds`.)*

## 3. Evidence / review status

| Q | evidenceStatus | reviewStatus |
| --- | --- | --- |
| Q1 | `resume_supported` | `needs_review` |
| Q2 | `resume_supported` | `needs_review` |
| Q3 | `unverified_detail` | `needs_review` (illustrative HBC Quests story — **not** verified accomplishment) |
| Q4 | `rehearsal_framework` | `needs_review` |
| Q5 | `rehearsal_framework` | `needs_review` |

## 4. Parent / related links

**Primary chain (canonicalQuestionId):**

- Q2 → Q1  
- Q4 → Q1 (career follow-up from current-work story; also related to Q2)  
- Q5 → Q4  

**Q1 `relatedQuestionIds` (peers + chain):** Tell me about yourself, Q2, funding ($5.2M), headless platform, idea-to-product, personal ownership, Why leave Arc'teryx, Q4, Q5.

**Q3 links:** HBC Quests scale question, product initiative that didn't go to plan (independent HBC behavioural row).

## 5. Embeddings (gte-small, 384-d)

**Ran:** `npm run embed:qa:gte`  
**Result:** 36 variant embeddings written/refreshed; 235 unchanged; 0 failures (`data/migration/embed-gte-report.json`).

Includes canonical + alternate phrasings for new/changed rows (no full-library rebuild).

## 6. Retrieval tests A–F

**Ran:** `npm run test -w @interview-copilot/web -- sperro-five-qa-retrieval` — **6/6 passed.**

| Test | Prompt | Top match |
| --- | --- | --- |
| A | Can you tell me a little more about what you're working on at Arc'teryx? | Q1 |
| B | Why didn't you just launch the whole membership platform? (after Arc'teryx context) | Q2 |
| C | So why would you leave before seeing that launch? (after Q1) | Q4 |
| D | How would you make sure the team could continue without you? (after Q4) | Q5 |
| E | Tell me about a product decision you got wrong at HBC. | Q3 (`hbc-quests`) |
| F | Going back to Sperro SV, what did you personally own? (after HBC) | Arc'teryx ownership / Sperro-relevant row |

**Full suite:** 58 tests passed (includes prior navigator / conversation tests).

## 7. Retrieval / context code (minimal)

- Child-question boost when `activeQuestionId` matches `canonicalQuestionId` (+ alt phrase overlap).
- Broader ambiguous follow-up patterns for membership / transition phrasing.

No Live UI or STT changes.

## 8. Gaps / notes

- Expansion draft *Tell me about a product decision you got wrong. What changed your mind?* remains a **separate** longer canonical in the 92-pack (not imported); Q3 uses the reviewed shorter canonical wording.
- Consider adding explicit canonical for *What are you currently working on at Arc'teryx?* in ranked inventory export on next audit refresh.

## 9. Commands for replay

```bash
npm run import:sperro-five-qa:apply
npm run seed:questrade:full
npm run embed:qa:gte
npm run test -w @interview-copilot/web -- sperro-five-qa-retrieval
```

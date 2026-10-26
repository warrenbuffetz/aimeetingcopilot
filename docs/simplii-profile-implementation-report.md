# Simplii Financial — Senior PM interview profile

> **Superseded for content:** Simplii Q&A is authored externally (ChatGPT) and imported via `imports/simplii_final_qa.json`. See `docs/chatgpt-handoff-summary.md`. The auto-clone described below is **deprecated**; the live Simplii profile is kept **empty** until Phase 6 import.

**Created:** 2026-10-26  
**Simplii profile ID:** `1aff0813-6615-4a12-bfd6-ce7603604f6b`  
**Source profile:** Questrade — Senior PM, Everyday Banking (`f96f6db8-c0e9-4341-be68-c29f6975dc5e`)

## Source library audit (Questrade at clone time)

| Metric | Value |
|--------|------:|
| Total rows (profile-scoped) | 261 |
| Active canonical Q&A | 258 |
| Inactive / superseded | 3 |
| Parents with embedded follow-ups | ~111 (Questrade); **110** retained on Simplii |
| Embedded follow-up snippets (Simplii) | **395** |
| Follow-up expansion (92) | Already reflected in Questrade DB (not re-imported separately) |

## Reuse distribution (cloned sources only)

| Disposition | Count |
|-------------|------:|
| REUSE_UNCHANGED | 127 |
| REUSE_WITH_LIGHT_EDIT | 10 |
| REWRITE_FOR_SIMPLII | 8 |
| RETAIN_AS_GENERAL_BANKING | 107 |
| EXCLUDE_FROM_SIMPLII | 9 |
| **NEW_SIMPLII_QUESTION** | **20** |

**Excluded examples:** Temenos ledger question, Questrade MCP vendor strategy (Claude/ChatGPT brokerage), Balance Sheet / Questrade-only hub positioning, non-generalizable MCP/Flows architecture prompts.

## Simplii library totals

| Metric | Value |
|--------|------:|
| Total persisted rows | 272 |
| Active Simplii Q&A | 269 |
| Inactive (superseded chain) | 3 |
| Standalone new questions | 20 |
| GTE embedding variants indexed | 451 |
| Duplicate active questions | 0 |
| Questrade residual brand terms (validated) | 0 |

## Isolation & idempotency

- Questrade integrity hash unchanged after import (`validate:simplii` / `questradeIntegrity.unchanged: true`).
- Simplii rows keyed by `navigator_meta.cloneSourceQuestradeId` (clones) or `simpliiImportKey` (new questions).
- Re-running `npm run import:simplii:apply` updates in place (0 duplicate creates on second run).

## Commands

```bash
npm run import:simplii          # dry-run + audit JSON
npm run import:simplii:apply      # upsert profile + Q&A
EMBED_PROFILE_NAME=Simplii npm run embed:qa:gte
npm run validate:simplii
```

Artifacts: `data/migration/simplii-clone-audit.json`, `docs/simplii-profile-validation.json`.

## Profile metadata

- **Name:** Simplii Financial — Senior Product Manager  
- **Employer:** Simplii Financial (CIBC)  
- **Interview:** Wednesday, October 28, 2026, 12:00–12:45 PM Eastern (in `job_description` header)  
- **JD:** Excerpt + competencies in profile `job_description`; full PDF attached in workspace.

## P0 preparation list (64 by `preparationTier`; essentials for Oct 28)

Prioritize recruiter + squad-PM depth over Questrade strategy cases.

| Question | Why it matters |
|----------|----------------|
| Tell me about yourself. | Opens every round; anchors Arc'teryx + financial depth without over-indexing director narrative. |
| What interests you about Simplii Financial…? | Recruiter/hiring manager fit; ties JD squad ownership to your track record. |
| Why Simplii instead of continuing at Arc'teryx? | Motivation and selectivity; avoids generic “passion for fintech.” |
| How do you identify the right customer problem…? | Core JD discovery competency. |
| How do you structure and prioritize your backlog…? | Backlog ownership in squad model. |
| Walk me through how you write a user story for a regulated banking feature. | Execution depth expected of Senior PM, not strategist-only. |
| How do you define acceptance criteria…? | JD explicit; differentiates you in panel with engineering/risk. |
| How would you diagnose abandonment during digital account opening? | Digital banking scenario + measurement mindset. |
| How would you approach recurring failures in a money-transfer journey? | Maps to RBC payment evidence; ops + CX. |
| How would you evaluate whether customers are becoming more engaged with their everyday banking accounts? | Primary-banking engagement without inventing Simplii KPIs. |
| How do you separate business outcomes from delivery metrics? | Outcome accountability in JD. |
| Tell me about something you launched that did not perform as expected. | Honest outcome ownership (HBC activation vs conversion). |
| Tell me about a time you influenced a decision without formal authority. | Influencing without authority — central to role. |
| How would you measure improvements to digital account onboarding? | Funnel + cohort thinking for digital bank. |
| How would you increase direct deposit adoption? | Retained general-banking case from Questrade library, reframed. |

Full P0 list (all 64): run `npm run validate:simplii` and inspect `p0Questions`, or query `preparationTier = 'P0'` on profile `1aff0813-6615-4a12-bfd6-ce7603604f6b`.

## Review flags (non-blocking)

- Some **RETAIN_AS_GENERAL_BANKING** answers use neutral phrasing (“a digital bank”) where the original was Questrade-specific case practice — accurate for interview hypotheticals; edit in Library if you want more Simplii voice.
- **64 P0** tiers are heuristic; `is_preferred` on many legacy rows still boosts retrieval — tune in Library as you rehearse.
- Arc'teryx timeline wording: verify live answers against your resume dates if any answer still implies ongoing employment inconsistently.

## Application integration

- **Profiles / Library / Live:** Select **Simplii Financial — Senior Product Manager**; retrieval is scoped by `profile_id` and GTE embeddings (`prepared_qa_embeddings`).
- **Dashboard:** Per-profile Q&A counts when multiple profiles exist.
- **Experience modules:** `digital-banking-*` modules added for remapped case content (library section → Product & Banking Knowledge).

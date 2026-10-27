# Simplii cross-panel migration report

**Date:** 2026-10-27  
**Profile:** Simplii Financial — Senior Product Manager (`1aff0813-6615-4a12-bfd6-ce7603604f6b`)  
**Source:** `data/migration/simplii_cross_panel_qa_master.md`  
**Apply report:** `data/migration/simplii-cross-panel-apply-report.json`

## Summary counts

| Metric | Count |
|--------|------:|
| Part I answer revisions applied | 18 |
| Part II new Q&As created (new rows) | 27 |
| High-pressure follow-up rows (HP1–HP10) | 10 |
| **Total new rows created** | **37** |
| Part II semantic duplicates consolidated (enriched existing row) | 0 |
| HP parent links (importKey graph) | 10 HP rows × multiple parents each |
| Simplii active Q&As (after) | 352 |
| Simplii total rows (incl. inactive) | 355 |
| GTE variants embedded (post-apply) | 124 new / 908 total |

## Questrade regression

| Check | Result |
|-------|--------|
| Row count | 328 → 328 |
| Content hash (`questrade-pre-cross-panel.json`) | `8c8808f7…` unchanged |
| Simplii terms in Questrade library | 0 (`validate-profile-isolation.mjs`) |
| Questrade terms in Simplii library | 0 |

**Explicit confirmation: Questrade prepared Q&A content and configuration were not modified by this migration.**

## Navigator — Hiring Manager / Cross-Functional Panel

- **Curated list:** `packages/shared/src/navigator/simplii-editorial-top-questions.json` → `cross_functional_panel` (20 VH/H/M entries).
- **Editorial matching:** `simplii-editorial-question-overrides.json` maps curated wording → `importKey` when fuzzy match is weak.
- **Ranking:** `suggestTopInterviewQuestions(..., { interviewProfile: "simplii" })` uses Simplii editorial order first; heuristic fill applies Simplii panel topic boosts and **dampens deep technical** RBC payment plumbing for the panel round.
- **Live / Navigator wiring:** `use-interview-context.ts` passes profile name so Simplii sessions use Simplii editorial limits and ranking only.

### Top 15 most-likely — **before** (pre-migration behaviour)

Before cross-panel work, Simplii used the **same Questrade-weighted** editorial and heuristic ranking (no Simplii editorial JSON). The shortlist for `cross_functional_panel` was dominated by **experience deep dives** (RBC payment state, idempotency, architecture, copilot technicals) because round relevance and topic tags favoured those rows. Representative pre-change P0/P1 surface (from `simplii-pre-cross-panel` library metadata, not curated order):

1. Tell me about building Avion Select from zero to one.
2. How did you measure the 15% improvement in application completions?
3. Explain your interview copilot's semantic matching architecture…
4. RBC Interac / payment-state / duplicate-payment follow-ups (high round weight)
5. Enterprise payments ownership probes
6. … (technical and depth questions outranked generic banking PM prompts)

### Top 15 most-likely — **after** (Simplii cross-functional panel)

Curated **Panel #1–#15** (matched to library rows at runtime):

| # | Tier | Question |
|---|------|----------|
| 1 | VH | Tell me about yourself. |
| 2 | VH | What interests you about Simplii Financial, and why does this Senior Product Manager role make sense for you? |
| 3 | VH | What's the strongest reason to hire you for this Simplii role? |
| 4 | VH | How do you prioritize your product backlog? |
| 5 | VH | How do you decide what goes into a sprint? |
| 6 | VH | How do you work with Risk, Legal and Compliance? |
| 7 | VH | Tell me about a genuine disagreement with another stakeholder. |
| 8 | VH | How do you write a user story and acceptance criteria that engineering can actually use? |
| 9 | VH | How do you partner with a BA or Scrum Master without overlapping roles? |
| 10 | VH | How do you handle a mid-sprint requirement change? |
| 11 | VH | Tell me about using customer data to define a problem before proposing a solution. |
| 12 | VH | How do you define a metric precisely, including its numerator, denominator and time window? |
| 13 | VH | Tell me about a time you cut scope while protecting customer value. |
| 14 | VH | What would you improve first in the Simplii mobile app? |
| 15 | VH | How do you know whether a launch was successful? |

Ranks 16–20 add conditional depth (RBC ownership boundary, transfers complaints, squad disagreement, onboarding abandonment, transfer failures).

### Interviewer lenses (preparation metadata)

Panel-gap and JD rows carry `topicTags` / round relevance for:

- **Director / HM:** prioritization, ownership, stakeholder influence, commercial trade-offs.
- **BA / Agile:** stories, acceptance criteria, sprint change, dependencies, Risk partnership.
- **Analytics:** metrics definition, hypothesis validation, funnel/adoption (P1 deep dives).

These are **not** hard-coded to named interviewers; they filter/boost within the Simplii profile only.

## Follow-up handling (HP1–HP10)

- Rows: `simplii-hp-01` … `simplii-hp-10`, `retrievalRole: high_pressure_followup`, probe phrases in `altPhrasings`.
- **DB:** parent `follow_ups` + `relatedQuestionIds` updated on apply.
- **Navigator:** `simplii-hp-paths.ts` + `suggestContextualFollowUps` with `interviewProfile: "simplii"` surfaces HP children by parent `importKey`.

## Examples

### Primary → spoken answer (excerpt)

**Q:** How do you prioritize your product backlog?  

**A (opening):** *"I start with what we're trying to improve and what constraints are non-negotiable. In a bank, a regulatory commitment, material customer harm or an active reliability issue can ou…"*

### Primary → high-pressure follow-up

**Anchor (example):** Walk me through a user story for a failed Interac e-Transfer or cashback withdrawal. (`simplii-jd-005`)  

**Follow-up (HP4):** RBC — After a timeout, how do you prevent duplicates and establish payment status without owning the rail?  

**A (opening):** *"The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response…"*

### Simplii-only filtering

`isPreparedRowEligibleForProfile` + profile-scoped catalog in Live/Navigator ensures Simplii sessions never rank Questrade-only rows; isolation audit: 0 cross-brand hits.

### Questrade unaffected

Hash and row count match `data/migration/baselines/questrade-pre-cross-panel.json`; no Simplii import keys in Questrade `navigator_meta`.

## Profile-specific matching / search

- Editorial override map for Simplii import keys (`editorial-question-match.ts`).
- Embeddings re-run scoped: `EMBED_PROFILE_NAME=Simplii` after apply.
- No global default changes for Questrade lexical or GTE thresholds.

## Content requiring factual validation

Preserve distinctions documented in Part III of the master MD:

| Area | Note |
|------|------|
| RBC Avion | ~3,200 withdrawal requests/quarter, ~$1.2M annualized payout, 5M+ enterprise settlement events — confirm denominators and ownership vs consumer journey. |
| HBC | ~15% application-completion improvement — attribution and measurement window. |
| Arc'teryx | MVP / funding case vs post-tenure launches. |
| Illustrative behavioural | Some stakeholder / AC dispute examples marked illustrative — `evidenceBoundary` on HP rows where parsed. |

## Tests performed

| Test | Result |
|------|--------|
| `node scripts/apply-simplii-cross-panel-master.mjs` (dry-run) | Part I 18, Part II 27, HP 10; Questrade hash unchanged |
| `npm run apply:simplii:cross-panel:apply` | Applied + embed 124 variants |
| `npm run validate:simplii` | 352 active, 0 dupes, 0 forbidden hits |
| `node scripts/validate-profile-isolation.mjs` | 0 cross-profile contamination |
| `npm run typecheck` | Pass |
| `vitest` `contextual-and-top-questions.test.ts`, `experience-tree.test.ts` | 9/9 pass |

## Files modified

**Content / migration**

- `data/migration/simplii_cross_panel_qa_master.md` (authoritative copy in repo)
- `scripts/apply-simplii-cross-panel-master.mjs`
- `data/migration/baselines/simplii-pre-cross-panel.json`, `questrade-pre-cross-panel.json`
- `data/migration/simplii-cross-panel-apply-report.json`

**Shared Navigator (Simplii-gated; Questrade paths unchanged)**

- `packages/shared/src/navigator/simplii-editorial-top-questions.json`
- `packages/shared/src/navigator/simplii-editorial-question-overrides.json`
- `packages/shared/src/navigator/simplii-hp-paths.ts`
- `packages/shared/src/navigator/editorial-top-questions.ts`
- `packages/shared/src/navigator/editorial-question-match.ts`
- `packages/shared/src/navigator/top-interview-questions.ts`
- `packages/shared/src/navigator/contextual-follow-ups.ts`

**Web**

- `apps/web/src/hooks/use-interview-context.ts`
- `apps/web/src/app/live/page.tsx` (profile passed into ranking)

**QA / docs**

- `scripts/validate-simplii-profile.mjs` (Questrade baseline path)
- `packages/shared/src/navigator/__tests__/experience-tree.test.ts` (typing fix)
- `package.json` (`apply:simplii:cross-panel` scripts)

**Not modified:** Questrade `prepared_qa` rows, Questrade editorial JSON, or Questrade spoken answers.

## Commands for re-run

```bash
npm run apply:simplii:cross-panel          # dry-run
npm run apply:simplii:cross-panel:apply     # apply + embed
npm run validate:simplii
node scripts/validate-profile-isolation.mjs
```

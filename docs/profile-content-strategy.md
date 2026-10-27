# Profile content strategy

## Principle

**One shared interview library** for experience, skills, leadership, and banking/product craft. Prepared Q&A should be **profile-specific only when the question or answer is genuinely about this employer or role** (e.g. “Why Questrade?”, “Why Simplii Financial?”, role/JD fit).

Everything else—RBC/HBC/Aeroplan/Arc'teryx stories, behavioural leadership, panel cases, metrics, payments depth—**should exist once** and be reused across interview profiles.

When a shared answer needs a company-specific beat (usually the **closing paragraph**), authors should either:

1. Keep a neutral shared body and add per-employer closings in metadata (`employerClosing`), or  
2. Maintain separate job-specific rows tagged with `profileExclusive` (imported into each profile DB until a shared store exists).

Runtime code (`isPreparedRowEligibleForProfile`, `preparedAnswerForProfile`) follows this model: **do not hide shared rows** just because the answer mentions another employer in passing; only **job-specific** rows are exclusive.

## What stays profile-specific today (expected)

| Area | Why |
|------|-----|
| Editorial **top questions** lists | Round order and wording differ by employer (`questrade-top-questions-by-round.json` vs `simplii-editorial-top-questions.json`). |
| **Curated contextual follow-up** paths | Parent questions differ by brand. |
| **DB `profile_id`** on rows | Each profile still has its own import corpus; long-term goal is shared rows + overlays, not duplicate maintenance. |
| **Active experience module labels** | `questrade-*` vs `digital-banking-*` are **display aliases** for case modules (Questbank branding vs generic digital banking). Same stories should map to one canonical module over time. |
| **Section title “Questrade Product Cases”** | Hidden on Simplii in the UI because the label is Questrade-branded; Simplii case content lives under digital-banking modules and shared sections. |

## What should be shared (target)

- Resume deep dives and follow-ups  
- Leadership & behavioural (including people-management stories unless truly Simplii-only JD)  
- Product & banking knowledge not tied to “why this company”  
- Panel hypotheticals with neutral employer framing  

## Authoring metadata

Optional on import / `navigator_meta`:

- **`profileExclusive`**: `"questrade"` \| `"simplii"` — row only surfaces for that profile (job-specific).  
- **`employerClosing`**: `{ "questrade": "…", "simplii": "…" }` — appended or substituted when presenting the answer live.

## Validation

`scripts/validate-profile-isolation.mjs` still flags cross-brand strings in DB rows (legacy hygiene). As content converges on shared bodies + closings, tighten that script to **job-specific rows only** (same rules as `isJobSpecificPreparedRow`).

## Code references

- `packages/shared/src/navigator/profile-content-eligibility.ts` — eligibility + `preparedAnswerForProfile`  
- `docs/live-interview-recommendations.md` — navigator UX filters (browse counts, section labels)

## Workbook

Regenerate after library or import changes:

```bash
npm run generate:career-alignment
```

Output: `data/review/career-motivation-profile-alignment.md` — fill in **employerClosing** columns and adjust **Shared?** / actions, then update `imports/simplii_final_qa.json` and re-import.

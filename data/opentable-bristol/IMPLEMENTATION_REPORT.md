# OpenTable — Bristol (Focused) — implementation report

Profile for **Senior Product Manager — Restaurant Product** (Bristol Lewis). **No Questrade or Simplii answer libraries were modified.**

## Route & entry

| Item | Value |
|------|--------|
| Live navigator | [`/live/bristol`](/live/bristol) |
| Profile id (UI) | `local:opentable-bristol` |
| Profiles card | Interview profiles → **OpenTable — Bristol (Focused)** |

## Architecture

- **UX:** Same pattern as Questrade — Jaz (Focused): topic map, search, pins, answer pane, Experience Maps, **Questions for Bristol**, plus **Battlecard** tab (post–Jaz addendum).
- **Scenario / industry views:** `Live Product Scenarios` (SC01–SC10) render structured scenario panels (twist, probes, metrics, framework). **IP-REF** renders industry reference scaffold (pain points, ranking — verify sources before citing).
- **Answers:** Bundled resolver (not Supabase writes):
  1. `opentableRecordId` → OpenTable import (bundled in `bristol-canonical-answers.json`)
  2. `canonicalAnswerId` → Questrade export UUIDs (shared, **Questrade closings stripped**)
  3. Else → placeholder containing `needs_gpt_draft`
- **Addendum content:** `scripts/bristol-addendum-content.mjs` merged by `scripts/generate-bristol-focused-profile.mjs`
- **Regenerate:** `npm run generate:bristol-focused`

## Question counts (post–Jaz addendum, Nov 2026)

| Bucket | Count |
|--------|------:|
| Primary library questions | **102** |
| — Career & Motivation | 6 (+ B59, B60 philosophy) |
| — **Industry POV & Strategic Judgment** | **13** (IP01–IP12 + IP-REF) |
| — **Live Product Scenarios** | **10** (SC01–SC10) |
| — Experience Stories | 9 |
| — Restaurant Product & Marketplace | 10 |
| — AI/ML & Revenue Optimization | 10 |
| — Restaurant Economics & Metrics | 6 + 11 reference slots |
| — Product Craft & Experimentation | 7 + 8 experiment reference slots |
| — Leadership & Judgment | 10 |
| Questions for Bristol | 6 |
| Pinned (suggested) | increased (many P0 industry/scenario pins) |

## Jaz interview learnings (embedded)

- **Industry POV & Strategic Judgment** — decisive operator problems, OpenTable fit, prioritization with challenge follow-ups
- **Live Product Scenarios** — constraint twists, second-order effects, illustrative numbers labeled
- **Six-step scenario framework** — Clarify → Diagnose → Evaluate → Decide → Validate → Adapt (+ Jaz mistakes to avoid)
- **Weakness tracker** — 7 rows (`WEAKNESS_TRACKER.md` + curated JSON)
- **Battlecard** — single-screen reference (stories, pain points, P0 hypotheses, metrics, AI, scenario entry points, framework, Jaz mistakes)
- **P0 prediction** — 13 items balancing **experience proof**, **industry POV**, **scenario judgment**, AI, philosophy (`P0_PREDICTION.md`)

Predicted questions remain **preparation hypotheses**, not confirmed Bristol questions.

## Reuse vs new

| Status | Notes |
|--------|-------|
| **Reused (OpenTable import)** | Career + experience rows from `opentable-rec-*` |
| **Reused (shared canonical UUID)** | Interac e2e, stakeholder disagreement, influence, ambiguity, prioritization stories |
| **Needs GPT authoring** | Restaurant/AI/economics/craft placeholders + **all IP\*, SC\*, B59/B60** spoken answers |
| **Structure-only (no final answer draft)** | Scenario metadata, IP-REF scaffold, battlecard bullets |

Questrade **Jaz curated JSON** and **Simplii** imports were not changed.

## Validation

- `npm run typecheck` — pass
- `npm test -- src/lib/bristol-focused/bristol-focused.test.ts src/lib/questrade-jaz/jaz-focused.test.ts` — 16 tests pass
- Dataset validator: 102 questions, scenario/industry_reference metadata checks
- Resolver: no `Questrade's everyday-banking` in resolved shared bodies

## Deliverables in this folder

| File | Purpose |
|------|---------|
| `answer-authoring-backlog.json` | Row-level backlog |
| `answer-authoring-backlog-by-type.json` | Grouped backlog (industry_pov, scenarios, etc.) |
| `answer-authoring-backlog.md` | P0 index |
| `P0_PREDICTION.md` | Balanced P0 mix (experience + industry + scenarios) |
| `WEAKNESS_TRACKER.md` | Jaz → Bristol weakness assessment table |
| `GAP_REPORT.md` | Reuse / GPT / research gaps |
| `bristol-focused-curated.json` | Mirror of app bundled curated JSON |

## Next steps

1. Open `/live/bristol` → **Battlecard** for fast review; drill **Industry POV** and **Live Scenarios** in Answers mode.
2. Author spoken answers via GPT using `answer-authoring-backlog-by-type.json` — do not read `needs_gpt_draft` placeholders in interview.
3. Verify IP-REF and industry claims against OpenTable product pages and current industry research before interviews.

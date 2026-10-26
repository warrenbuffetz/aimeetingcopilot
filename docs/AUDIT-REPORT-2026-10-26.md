# Questrade Interview Copilot — audit report (2026-10-26)

Reference: [QUESTRADE-COPILOT-AUDIT-2026-10-22.md](./QUESTRADE-COPILOT-AUDIT-2026-10-22.md)

## Production database (POC user)

| Metric | Value |
|--------|------:|
| `prepared_qa` rows (`poc-demo@interviewcopilot.app`) | **144** (before re-seed; seed file now **149**) |
| Duplicate question titles in DB | **0** |
| `needs_review` in `navigator_meta` | **0** |
| `revisionStatus: superseded` in DB (pre-change) | **0** |

Offline JSON inventory in the Oct 22 audit (147 records across four files) does **not** match a single DB export; production tracks the merged `questrade-interview-full.json` seed.

## Contradictory HBC content (Q90/Q91 analogues)

| Legacy rehearsal row | Canonical replacement | Action |
|----------------------|----------------------|--------|
| `HBC-X1` — What exactly do your 30-day activation and 90-day repeat-spend metrics mean? | Tell me exactly how you defined HBC's 30-day activation and 90-day retention. | `revisionStatus: superseded`, `retrievalExcluded: true` |
| `HBC-X2` — How did you establish that lifecycle incentives improved P&L and modeled LTV? | Did you actually run randomized holdouts… + incremental spending answer | Superseded from live retrieval; history kept in seed |

## Round coverage (before this change)

No Recruiter / Hiring Manager / Panel model existed — only seed `part` (1–12) and navigator experience/intent.

**Added:** `activeInterviewRound` on session context, navigator round selector (editorial `roundRelevance` on priority questions), secondary boost in hybrid rank.

## Retrieval (before / after)

| Capability | Before | After |
|------------|--------|-------|
| Live analyze | Lexical + context boost | Lexical + context; **hybrid** when `USE_OPENAI_SEMANTIC=true` and embeddings exist |
| Superseded rows | Could still match | **Excluded** from analyze + Next suggestions |
| Round signal | None | Editorial boost only; strong matches preserved |

## Content added (seed + meta)

- Canonical **AI at work** answer (tools vs exploring vs hypothetical enterprise automations) + alt phrasing
- **5** Questrade prep items: Questbank expansion, Temenos boundaries, MCP consent, primary-banking metrics, data accuracy
- **spokenAnswer** / **shortAnswer** on high-priority round questions

## Audio UI

Session, capture, and transcription engine status shown separately in Audio setup (Session / Capture / Transcription lines).

## Tests

- `interview-simulation.test.ts` — 30-turn scripted retrieval/context path
- Existing navigator tests (context, follow-ups, apply-39/56) — unchanged pass criteria

## Outstanding

1. Re-seed production: `npm run seed:questrade:full`
2. OpenAI credits for embeddings (semantic/hybrid remains lexical-only until seeded)
3. Hiring-manager panel JSON (13 rows) not in repo — import separately if desired
4. Authenticated UI walkthrough on Vercel (login required) not automated here

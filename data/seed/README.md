# Interview seed data

| File | Contents |
|------|----------|
| `questrade-interview.json` | Part 1 only (synced from full file) |
| `questrade-interview-full.json` | **144 Q&As** (Parts 1–12), still-employed-at-Arc'teryx narrative |
| `questrade-q48-q112.json` | Parts 7–11 only (Q48–Q112); merge with `npm run merge:questrade:full` |
| `questrade-resume-deepdives.json` | Part 12 — 30 resume experience deep dives; `npm run merge:questrade:full data/seed/questrade-resume-deepdives.json` |
| `RESUME-DEEPDIVES-EVIDENCE.md` | Evidence boundaries for Part 12 (illustrative vs verified) |

## Ingest full library

1. Edit `questrade-interview-full.json` (optional `retireQuestions` removes superseded prompts on seed).
2. Run: `npm run seed:questrade:full`

## Follow-ups (no OpenAI in the app)

1. Run `npm run export:custom-gpt` and use `data/export/follow-ups-generation-prompt.md` in ChatGPT/Gemini to generate JSON.
2. Save as `data/seed/questrade-follow-ups.json` (see `questrade-follow-ups.example.json`).
3. Run Supabase migration `20251022190000_prepared_qa_follow_ups.sql` if not applied.
4. Run: `npm run import:follow-ups`

Live **Analyze** uses **local lexical match** by default (`USE_OPENAI_SEMANTIC=false`). Matched answers show **Likely follow-ups** read-ahead on the Live page.

Or override draft guard: `FORCE_SEED=1 npm run seed:questrade:full`

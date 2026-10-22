# Interview Navigator

The right panel on **Live** is the Interview Navigator: context-aware follow-up suggestions plus a browsable library.

## Data model

Each `prepared_qa` row is enriched at runtime (and optionally via `navigator_meta` JSONB after migration):

| Field | Source |
|-------|--------|
| `libraryCategory` | Seed `part` + `category` (e.g. Part 12 → Resume deep dive) |
| `experienceModuleId` | Seed notes (`RBC-00`, `HBC-05`, …) or question keywords |
| `intent` | Seed suffix (`00` = main story, `04` = ownership, …) or question phrasing |
| `evidenceStatus` | `notes` (illustrative / rehearsal / resume-supported) |
| `altPhrasings` | `follow_ups` aliases (same answer) |

Experience modules are defined in `packages/shared/src/navigator/experience-modules.ts`.

## Follow-up ranking

1. Scope to **active experience** (conversation context or manual override).
2. Exclude **asked** question IDs this session.
3. Score by **intent transition** graph (`INTENT_TRANSITIONS` in `intent-transitions.ts`).
4. Return top **3–5** ranked suggestions (no fake probabilities).

## Session context

Stored in `sessionStorage` (`interview-copilot-session-context`):

- Active experience, intent, asked IDs
- Manual experience override (does not change when browsing HBC while live context is RBC)

**Clear context** resets session tracking without touching the library.

## Context resolution

`resolveInterviewContext()` in `packages/shared/src/navigator/context.ts`:

- Topic switch phrases (“let’s switch gears”, explicit company names)
- Ambiguous follow-ups (“how did you measure that?”) stay on the **current experience**
- Re-ranks within the active module before picking an answer

## Adding experiences / follow-ups

1. Add Q&A to seed JSON with `notes: "RBC-07"` (or new module key) and `part` / `category`.
2. Optionally extend `EXPERIENCE_MODULES` and `moduleFromSeedKey()` in `meta-inference.ts`.
3. Run `npm run seed:questrade:full`.
4. Intent transitions are global; tune `INTENT_TRANSITIONS` if a new intent type is added.

## Migrations

- `20251022194500_prepared_qa_navigator_meta.sql` — optional `navigator_meta` column (future seed population).

## Keyboard

- **⌘K / Ctrl+K** — search library (when focus is not in an input).

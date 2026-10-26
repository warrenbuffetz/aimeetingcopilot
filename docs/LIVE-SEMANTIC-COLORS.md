# Live interview semantic colours

Defined in `apps/web/src/app/globals.css` (`.dark` `--ic-*`) and reused via `apps/web/src/lib/live-semantic.ts`.

| Token | Hex | Meaning |
|-------|-----|---------|
| `--ic-detected` | `#67E8F9` | Interviewer / detected prompt, transcript question lines, map source |
| `--ic-library` | `#C4B5FD` | Matched canonical library Q&A, browse/map cards |
| `--ic-suggested` | `#FCD34D` | Likely next / follow-up suggestions (labels & accents only) |
| `--ic-alternative` | `#A1A1AA` | Secondary alternative matches |
| `--ic-answer` | `#F4F4F5` | Primary reading text (detected Q, library Q, prepared answer) |

Surfaces: `--ic-*-surface` at ~7–10% opacity for borders/backgrounds.

**Unchanged:** emerald listening, amber warnings/candidates, red errors.

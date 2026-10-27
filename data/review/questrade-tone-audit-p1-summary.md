# Questrade tone audit — Pass 2 (P1) applied

Applied: 2026-10-27 via `scripts/apply-questrade-tone-audit-p1.mjs --apply --embed`

## Scope

- **33 / 33** P1 rows: `spokenAnswer` + `shortAnswer` in `navigator_meta` (`toneAuditP1` tag).
- **Signed-off full bodies unchanged:** `b8e9f0a1` (membership transition), `c8d9e0f1` (HBC Q3 mistake), `1fd9478b` (Sperro current work).
- **Canonical `answer` trims (4 rows):** `f67032ca`, `4e7a2a67`, `3d530a40`, `91cd5cac` — defensive closers removed; re-embedded.

## Sources

- 8 spoken texts from audit `proposedSpokenVariant` (`data/review/questrade-tone-audit-p1-patches.json`)
- 25 from `scripts/questrade-tone-audit-p1-spoken-overrides.mjs`
- Audit typo alias: MCP success `be18eb7a` `…4a5c…` → live `…4a5d…`

## Reports

- `data/review/questrade-tone-audit-p1-apply-report.json`
- Pass 1: `data/review/questrade-tone-audit-p0-summary.md`

## Tests

- `questrade-audit-retrieval` — 5/5 passed after apply.

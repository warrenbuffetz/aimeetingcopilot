# Simplii people leadership migration

**Date:** 2026-10-27  
**Profile:** `1aff0813-6615-4a12-bfd6-ce7603604f6b`

## Summary

| Metric | Value |
|--------|------:|
| PL questions parsed | 20 |
| New rows created | 19 |
| Existing merged/updated (RBC 14-person → PL05) | 1 |
| `people_leadership` section rows | 20 |
| Simplii active Q&As | 371 |
| Questrade unchanged | yes (328 rows, hash verified on apply) |

## Library section (6th)

- **Code:** `people_leadership` → label **People Leadership & Direct Reports**
- **Questrade:** 0 rows with this section
- **Simplii:** all `simplii-pl-01` … `simplii-pl-20` only

## Navigator

- Panel editorial list extended to **27** items (ranks 21–27 = PL P0 at tier **H**)
- Overrides + topic boosts for people-leadership phrasing
- Contextual follow-ups: `simplii-pl-paths.ts` (parents PL01, PL02, PL05, PL09, PL10)

## Evidence flags

- PL11: `illustrative_scenario` + review note (needs authentic behavioural example)
- PL10, PL20, etc.: `rehearsal_framework` where pack notes require it

## Commands

```bash
npm run apply:simplii:people-leadership        # dry-run
npm run apply:simplii:people-leadership:apply  # apply + embed
```

Report JSON: `data/migration/simplii-people-leadership-apply-report.json`

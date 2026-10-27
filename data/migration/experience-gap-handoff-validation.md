# Experience-gap handoff validation

**Pass:** yes · 2026-10-26T23:53:51.006Z

## Package
- Schema/cross-profile: OK
- Answers match pack (61 cards): 61 OK, 0 drift
- Review-note label drift vs pack (expected): 61 cards

## Database
- Questrade import keys: 61/61, link issues: 0
- Simplii import keys: 61/61, link issues: 0
- Idempotent re-import ready: QT true, Simplii true

## Employer overviews (routing)
- questrade `questrade-john-experience-depth-v1-arc-overview` preferred=true retrievalExcluded=false module=arcteryx-overview
- questrade `questrade-john-experience-depth-v1-rbc-overview` preferred=true retrievalExcluded=false module=rbc-overview
- questrade `questrade-john-experience-depth-v1-hbc-overview` preferred=true retrievalExcluded=false module=hbc-overview
- questrade `questrade-john-experience-depth-v1-air-overview` preferred=true retrievalExcluded=false module=aeroplan-overview
- simplii `simplii-john-experience-depth-v1-arc-overview` preferred=true retrievalExcluded=false module=arcteryx-overview
- simplii `simplii-john-experience-depth-v1-rbc-overview` preferred=true retrievalExcluded=false module=rbc-overview
- simplii `simplii-john-experience-depth-v1-hbc-overview` preferred=true retrievalExcluded=false module=hbc-overview
- simplii `simplii-john-experience-depth-v1-air-overview` preferred=true retrievalExcluded=false module=aeroplan-overview

JSON: `/Users/johnlee/Documents/Cursor/ai meeting copilot/data/migration/experience-gap-handoff-validation.json`

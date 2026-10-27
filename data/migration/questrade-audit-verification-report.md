# Questrade audit verification (automated)

Generated: 2026-10-27

## Tier 1 — Engineering / retrieval

| Scenario | Mechanism | Automated check |
|----------|-----------|-----------------|
| Session context on analyze API | `activeQuestionId`, `lastDetectedQuestion` forwarded server-side | `apps/web/src/app/api/analyze/route.ts` |
| Client sends full session context | `use-live-session.ts` POST body | Wired |
| Conversational boosts | `packages/shared/src/navigator/conversational-retrieval.ts` + hybrid rank | `questrade-audit-retrieval.test.ts` (5 cases) |
| Main-panel evidence labels | `evidenceStatusLabel` on matched block + answer area | `matched-library-question.tsx`, `live/page.tsx` |
| Profile switch quarantine | Clears session + context on `profileId` change | `live/page.tsx` |
| Show more only when overflow | Expanded pool vs default slice | `live/page.tsx` |

## Tier 2 — Content consistency (report only)

- `npm run report:questrade:consistency`
- Outputs: `data/migration/questrade-content-consistency-report.json` + `.md`
- **No answer prose changed** (per `confirm_later` on measurement math).

## Tier 3 — Hypothetical probes

Imported via `imports/questrade_audit_probes_qa.json`:

| ID | Question |
|----|----------|
| `7a4e8b2c-3f1d-4a9e-b6c5-d8e7f9012345` | Trade timeout / duplicate prevention (`rehearsal_framework`) |
| `8b5f9c3d-4e2a-5b0f-c7d6-e9f812345678` | Handover artifacts (`rehearsal_framework`) |

Banking operating-model probe **not** added — existing answer on joining an establishing banking offering covers intent.

## Tier 4 — Curated graph

- Compensation anchor `93f1f35c-…` → notice / hybrid / interviewing logistics (related IDs + Top115 follow-ups).
- MCP design anchor → trade-timeout probe (order 6 on panel placement).
- Reconcile: **561/561 edges resolved**, 0 unresolved anchors/targets.

## Manual re-check (post-deploy)

1. Intro browse → main panel: full body (P0 truncation).
2. Live STT paths for audit table rows §Representative retrieval.
3. Simplii profile pass **deferred** until Questrade rehearsal is stable.

## Commands

```bash
npm run test -w @interview-copilot/web -- --run questrade-audit-retrieval
npm run report:questrade:consistency
npm run reconcile:questrade-curated-followups
```

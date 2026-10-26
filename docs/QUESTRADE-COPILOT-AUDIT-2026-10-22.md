# Questrade Interview Copilot — Audit & Improvement Backlog

Date: October 22, 2026

## Audit boundaries

- The deployment `https://aimeetingcopilot-sse7.vercel.app/live` redirects unauthenticated requests to `/login`. An authenticated production UI/session test could not be completed using the available tools.
- This is an **offline audit of four Q&A JSON files** created for the project, supplemented by screenshots previously supplied and current public Questrade sources. It is **not** a verified production database export or a live STT/retrieval audit.
- Do not include shared demo credentials in a repository, Cursor prompt, issue, log, or generated report. Rotate the demo credential if it was reused or publicly disclosed.

## Offline library inventory

| Source | Records |
| --- | ---: |
| `questrade_copilot_followups.json` | 65 |
| `questrade_resume_deep_dives_revised.json` | 30 |
| `questrade_39_review_resolutions.json` | 39 |
| `questrade_hiring_manager_panel_answers.json` | 13 |
| **Total** | **147** |

Exact-normalized distinct question titles: **117**. Duplicate-title excess: **30 records**. Some identically worded question titles intentionally belong to different employers and should remain separately addressable. These counts do not establish how many records were actually imported into the production application.

Median answer lengths: follow-ups 102 words; deep dives 137; resolutions 136; new hiring-manager/panel 206. Every one of the 13 new hiring-manager/panel responses is approximately 188–229 words, which favors long-form rehearsal over rapid live recall.

No direct title matching “How are you using AI at work?”, “Why Questrade?”, “Tell me about yourself”, or compensation appears in these four available JSON sets. This does not prove that those questions are absent from other source sets or the production database.

## P0: Canonical content and retrieval

1. **Merge by canonical record identity, not normalized question alone.** Generic titles such as “What did you personally decide?” occur under RBC, HBC and Aeroplan. Keep separate records and use the active experience and question intent to disambiguate.
2. **Supersede contradictory versions.** `Q90` and `Q91` from older follow-ups conflict with revised #17 and #28 on HBC activation/retention and randomized holdouts, respectively. Preserve old sources as revision history but exclude superseded content from live retrieval. This applies within the user's accepted hypothetical rehearsal scenario; do not represent it as independent proof of historical claims.
3. **Canonical metadata should include** `canonicalQuestionId`, `experienceModuleId`, `questionIntent`, `roundRelevance`, `panelDiscipline`, `answerType` (historical story vs hypothetical case), `evidenceStatus`, `revisionStatus`, `supersedes`, and `sourceFile`.
4. **Test pronoun and context follow-ups.** After HBC credit-card application, “How did you measure that?” must retrieve application completion rather than portfolio LTV. After RBC Interac, “What did you personally decide?” must retrieve RBC ownership.
5. **Fix session/audio-state ambiguity** visible in prior screenshots: a Pause control can appear alongside an Audio menu that still offers Start. Track session and transcription capture independently and display true operational states.

## P1: Round focus

### Recruiter — prioritize
1. Tell me about yourself (45–60 second answer).
2. Why Questrade, specifically now that Questbank is expanding?
3. Why everyday banking instead of loyalty/rewards?
4. Why did you leave Arc'teryx, and what are you seeking next?
5. What banking/payments experience would transfer directly?
6. Have you actually owned a chequing account product?
7. Compensation, start date, hybrid fit.
8. How are you using AI in your work?

### Hiring manager — prioritize
1. How would you make Questbank a primary account?
2. What customer segment would you start with, and why?
3. How would you measure account primacy, retained deposits and transaction engagement?
4. Walk me through the RBC Interac payout experience, decision and metrics.
5. How did you balance acquisition, activation and P&L at HBC?
6. How would you prioritize account reliability versus new financial-hub features?
7. Tell me about a product decision that failed, and a consequential cross-functional disagreement.
8. How would you build around a third-party core banking platform?
9. What would you deliberately leave out of the financial hub MVP?
10. How would you judge a profitable versus unprofitable payroll adoption strategy?

### Cross-functional panel — prioritize conditionally by discipline
1. EFT returns, pending/posted/available balances and ledger integrity.
2. Settlement reconciliation and payment exception management.
3. Card authorization declines when processor uptime is normal.
4. KYC/fraud versus conversion and false positives.
5. Payroll or bill-payment incident leadership.
6. Vendor/core-system responsibility and data ownership.
7. Deposit contribution margin and incentive unit economics.
8. Experiment improvement overall but harmed segment.
9. AI account insights, MCP permissions, human approval and error handling.

Use `very_high`/`high`/`medium`/`low` labels as editorial judgments, not mathematical probabilities. Round priority should never block exact semantic matches.

## P1: Content improvements

- Provide **Quick (60–95 words), Full (120–180 words), Follow-up (focused 50–100 words)** for every high-priority question. The panel answers currently all exceed 180 words.
- Add a canonical **AI-at-work** answer and follow-up about productivity and safety. Ground it in actual ChatGPT/Claude/Cursor work and the user's independent Bench prototype. Do not claim an automated Slack or customer-feedback bot is deployed if it is not.
- Add a **Questrade-specific 'Why now'** answer linking brokerage/investing relationships, regulated everyday banking, and the challenges of trust/reliability.
- Add **Temenos core and system integration** interview modules: payment states, read models, reconciliation boundaries, operational SLAs, partner dependencies.
- Add **MCP/agentic finance** interview cases: OAuth-style consent, least privilege, read-only-by-default, draft vs execute, human confirmation, observability and error handling.
- Clarify Arc'teryx broader membership investment vs live limited benefits; separate planned timing gain from realized project results.
- Add strong but truthfully framed real failure and disagreement stories before using hypothetical historical scenarios as literal autobiography.

## Public product verification

- Questrade/Temenos May 2026 press release: Questbank adopted Temenos Core Banking SaaS, including Data Hub and Extensibility Framework, to support planned banking services: https://www.globenewswire.com/news-release/2026/05/05/3287437/0/en/temenos-to-power-questrade-financial-group-s-everyday-banking-offering-with-core-banking-saas.html
- Questrade MCP connection guide lists support for Claude, ChatGPT, Cursor, VS Code and Codex and requires customer approval of trades: https://www.questrade.com/learning/using-questrade/connect-your-questrade-account-to-ai
- Questrade agentic finance overview: https://www.questrade.com/agentic-finance

## Verification and acceptance tests required against authenticated production

1. Export live profile-specific Q&A records and compare canonical counts to offline imports; provide missing, duplicated and superseded counts.
2. Confirm revised #17 and #28 supersede Q90 and Q91 in the active retrieval index.
3. Simulate 30 multi-turn interview questions with expected module, intent, retrieved ID and response latency; include cross-topic switches.
4. Test selected round (recruiter/manager/panel) and panel discipline do not suppress relevant answers.
5. Check cold-start from Audio Not Listening through source choice, permission grant, Connected, transcription stream, Pause, Resume and Stop; separately report session state and capture state.
6. Check accessibility and readability of the right navigation at normal 1366/1440/1920px widths; long questions should not be clipped without a way to expand them.
7. Test failure states, network disconnection, browser permission denial, duplicate transcripts, slow STT and no-question idle state.
8. Verify that manual browsing never changes active conversation context and preserves pinned answers.

## Suggested implementation order

- P0: Superseded answer handling and source-of-truth audit; session/audio status clarity.
- P1: Round focus, live follow-up ranking and compact answers; add AI-at-work and company-specific Temenos/MCP modules.
- P2: Rehearsal completion tracking, confidence signals, manual override ranking, and review queue.

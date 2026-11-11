---
title: "Everyday Banking Product Management Playbook"
subtitle: "Customer journey, cross-product design, banking architecture, metrics, and 90 worked interview answers"
author: "Senior Product Manager interview reference"
date: "November 11, 2026"
lang: en-CA
---


# 0. Reader's guide and scope

**Purpose:** An exhaustive but navigable reference for Senior Product Manager interview preparation for the Questrade / Questbank Everyday Banking, Accounts & State domain. This document includes the expanded six-stage journey, system interfaces, friction library, prioritization and metrics, 12 deeply worked priority questions, and **all 78 worked questions** from categories 10.1 to 10.7.

**Source-of-truth convention:** External public facts are explicitly sourced in Section 3 and References. The ownership diagrams, product gaps, design proposals, architecture patterns, numerical examples, metrics and interview questions are *hypothetical*, not claims of Questrade's actual internal design, existing features or interview script.

**For Cursor / retrieval:** Each question has a stable ID (`T01` to `T12`, or `Q10.1-01` through `Q10.7-10`). Every answer is presented as: clarification, root cause, options, decision, metric, guardrail, dependency, and a natural spoken answer. The Markdown source is more AI-friendly than relying solely on OCR or PDF extraction.

![Everyday Banking journey-map overview: customer stages, product swimlanes, cross-product friction points, and metric groups.](assets/journey-map.png){width=100%}

**Text equivalent:** Journey stages are Join & Verify, Fund & Set Up, Spend & Move, Stay in Control, Grow & Optimize, Get Help & Recover. Five swimlanes are Everyday Banking Core, Cards, Money Movement, Investments and Shared Enablers. The eight flagship friction opportunities are: (1) duplicated onboarding; (2) fragmented money view; (3) unclear transfer status; (4) missing card-to-cash-flow context; (5) support handoffs; (6) difficult saving/investing movement; (7) notification overload; (8) inconsistent recovery. Metric clusters are leading indicators, success outcomes, supporting diagnostics and guardrails.

# 1. Role model: Accounts & State as the connecting tissue

A bank processes financial activity through distinct products and technical systems. The customer expects a coherent relationship: **What money do I have? What happened? What can I do? What needs attention?** The Accounts & State PM connects the customer-facing experience across transaction history, balance visibility, account status, control and insight, while peer teams may own card execution, payment rails, brokerage funding and shared controls.

| Domain | Conceptual responsibility | Primary customer job |
|---|---|---|
| Accounts & State | Balances, account status, transaction visibility, insights, coherent account UX | "Understand and control my money" |
| Cards | Issuance, authorization, card controls, disputes | "Spend safely" |
| Money Movement | Transfer and bill-payment workflows, payment rails, execution state | "Move money reliably" |
| Investments | Brokerage holdings, funding, availability to trade | "Grow my money" |
| Shared platform | Core banking, ledger, identity, fraud, data/events, support tools | "Trust the entire system" |

**Clarification:** This is an interview preparation model of plausible ownership. It is not a verified internal Questrade org chart. An Accounts PM may own experience decisions but not all ledger calculations or payment APIs.

**Illustration:** Customer receives a paycheque, buys groceries on a card, pays hydro, sends a family transfer and contributes to a TFSA. Each action touches multiple systems. The customer should not need to reconcile contradictory account states or call multiple product teams to understand one financial day.

# 2. Six-stage customer journey

| Stage | Customer question | Outcome that matters | Likely cross-team interface |
|---|---|---|---|
| 1. Join & Verify | Can I open and trust this account? | Verified, eligible customer | Identity/KYC, Cards offer, Investments reuse rules |
| 2. Fund & Set Up | How do I start using it? | Funded usable account | Money Movement, Cards, payroll/billers |
| 3. Spend & Move | Did my money move correctly? | Intended financial transaction succeeds | Cards, payment rails, core ledger |
| 4. Stay in Control | What happened and what's available? | Confident financial decisions | Transaction projections, insights, support |
| 5. Grow & Optimize | Can I save/invest responsibly? | Helpful sustained money habits | Investments, automation, transfers |
| 6. Help & Recover | How do I resolve an issue safely? | Restored control and trust | Disputes, risk, service case management |

These are not one-time linear funnel stages. Once activated, customers cycle daily through spending, checking, planning and recovery. Stage one occurs infrequently; stage four can occur many times each day. Priority should account for both frequency and harm severity.

## 2.1 Stage 1 - Join & Verify

**Typical flow:** Choose account -> authenticate/identify -> complete KYC/eligibility -> accept terms -> create account -> fund or activate.

**Friction A - repeated identity checks:** Existing investment customers may expect prefilled fields but banking products can trigger additional verification. Reuse only permitted evidence; explain product-specific checks. **Friction B - abandonment:** Instrument step-level failures rather than assuming every abandoned form is a UX problem. **Friction C - opened but unusable:** Show actual provisioning and a clear first-funding next action.

**Candidate solutions:** Allowed data reuse; progressive KYC; save-and-resume; recovery from failed ID verification; contextual first-action onboarding. **Metrics:** onboarding-step completion, pass rate, account funding and first-use conversion. **Guardrails:** compliance exceptions, false rejections, fraud, support escalations.

**Product sense prompts:** "How would you improve account opening for existing investors?" "Why are customers finishing KYC but not funding?" "How would you reduce verification friction without introducing fraud?"

## 2.2 Stage 2 - Fund & Set Up

**Typical flow:** Link bank -> initial deposit -> activate card -> set payroll -> add billers -> establish recurring payments.

**Friction A - switching effort:** Updating payroll and billers spans external institutions, employers and merchants. **Friction B - missing confidence:** Customers fear losing wages or incurring late fees. **Friction C - unclear funds availability:** A deposit may appear before all funds can be spent.

**Candidate solutions:** Guided primary-bank switch checklist, reliable account details, first-funding status, staged reminders, biller-specific instructions, balance availability explanation. Clearly distinguish what the customer has marked complete from what an external biller has confirmed. **Metrics:** first funding, direct-deposit setup, first payment and sustained recurring deposits. **Guardrails:** returned funding, missed salary, late bills, false external confirmation.

**Product sense prompts:** "Make Questrade a primary bank." "How would you help a customer move bills from TD?" "What is the first-30-days experience?"

## 2.3 Stage 3 - Spend & Move

**Typical flow:** Check spendable funds -> card/bill/transfer instruction -> authorization/acceptance -> pending processing -> posted/confirmed or failure -> recovery.

**Friction A - authorization versus posting:** Pending card authorization may look like a duplicate when final clearing is shown. **Friction B - payment status ambiguity:** Source funds decrease while destination has not yet credited. **Friction C - bank-side bill completion isn't biller credit.**

**Candidate solutions:** Linked auth/clearing records, truthful payment timeline, receipt/reference, expected timing only when grounded, safe retry, reversal association. **Metrics:** distinct intended payment completion, correct state comprehension, reduced unnecessary repeats. **Guardrails:** financial correctness, duplicate transfer, fraud, reconciliation breaks.

**Product sense prompts:** "A transfer appears stuck." "A card purchase appears twice." "How would you design pending/posted?" "How should we support instant payments?"

## 2.4 Stage 4 - Stay in Control

**Typical flow:** Balance -> recent activity -> find a transaction -> understand bill and card activity -> consider upcoming obligations -> decide action.

**Friction A - opaque descriptors:** Raw merchant name makes a legitimate transaction unrecognizable. **Friction B - repeat bill checking:** Customer lacks confidence in whether an obligation was paid. **Friction C - available versus posted balance:** Holds and pending authorizations are unexplained. **Friction D - fragmented obligations:** Transaction history has data but poor contextual organization.

**Candidate solutions:** Merchant enrichment, task-oriented search, reliable status detail, availability breakdown, customer-confirmed recurring activity, next-obligation awareness. **Metrics:** transaction-identification task success, payment-state comprehension, lower unresolved status contacts, useful insight actions. **Guardrails:** wrong merchant, incorrect status, misleading inferred due date, privacy leakage.

**Product sense prompts:** "Redesign transaction history." "Why does a customer search hydro five times?" "How would you improve available-balance clarity?" "What personal financial insights matter?"

## 2.5 Stage 5 - Grow & Optimize

**Typical flow:** Check known obligations -> see funds and goals -> choose savings/investments -> transfer money -> track resulting state -> repeat if useful.

**Friction A - money remains idle:** Customer lacks motivation or a convenient appropriate product. **Friction B - confusing funding:** Bank transfer completes before brokerage purchasing power appears. **Friction C - over-automation:** A savings sweep creates rent shortfalls.

**Candidate solutions:** Opt-in recurring contributions, savings goals, explicit transfer timelines, responsibly framed cash-flow context, minimum-balance thresholds and pause/skip controls. Do not assume available bank funds equal disposable funds or suitable investable cash. **Metrics:** sustained safe saving behaviour, completed eligible funding, useful goal actions. **Guardrails:** missed obligations, registered contribution errors, unauthorized transfers, unsuitable suggestions.

**Product sense prompts:** "Would you launch round-ups?" "How would you encourage investors?" "Design safe-to-save."

## 2.6 Stage 6 - Help & Recover

**Typical flow:** Identify issue -> see state and safe actions -> self-service -> contact support -> resolve -> confirm outcome.

**Friction A - repeating details:** Support agents and product teams do not share case context. **Friction B - missing dispute timeline:** Customer doesn't know what is happening. **Friction C - account restriction:** Customer doesn't know what is blocked or what information can be disclosed.

**Candidate solutions:** Shared case reference, customer-safe event timeline, appropriate transaction-linked support, issue-specific recovery and escalation. **Metrics:** safe self-service resolution, first-contact resolution, unresolved issue rate and time. **Guardrails:** security and privacy incidents, incorrect dispute resolution, unauthorized access and fraud-rule leakage.

**Product sense prompts:** "Why are support calls rising?" "How would you improve dispute tracking?" "What if an account is frozen?"

# 3. Verified public context relevant to the interview (as of 2026-11-11)

1. **Temenos and Questbank:** Temenos announced on 2026-05-14 that Questrade Financial Group / Questbank went live on Temenos Core Banking SaaS. This provides public evidence of a modern core banking platform, but not the private Accounts API topology. Source: https://www.temenos.com/press_release/temenos-core-banking-saas-to-power-questrade-financial-groups-banking-offering/
2. **Canada Real-Time Rail:** Payments Canada announced on 2026-11-09 the launch of the RTR, with Questbank in the initial active cohort and centralized fraud controls. Participation in infrastructure does **not** prove every consumer-facing real-time transfer journey is available or covers all recipients. Source: https://www.payments.ca/canada-launches-real-time-rail-bringing-247-payment-infrastructure-national-economy
3. **Wealthsimple's latest public announcement:** On 2026-11-05 Wealthsimple announced features including Wealthsimple Pay instant transfers among eligible clients and upcoming Penny AI assistant/customizable app experiences. Distinguish "available now" from coming features. Source: https://newsroom.wealthsimple.com/wealthsimple-announces-ai-assistant-penny-and-11-more-releases-at-wealthsimple-presents-something-good-is-going-to-happen
4. **RTR phased rollout:** Payments Canada's published phased plan makes adoption and transaction coverage gradual. Source: https://www.payments.ca/systems-services/payment-systems/real-time-rail-payment-system/testing-and-launch

**Interview implication:** Faster infrastructure can raise customer expectations for correct real-time status, fraud protection and account availability. Design around proven customer outcomes and implementation readiness; do not claim Questbank's full consumer feature set is already live based on membership alone.

# 4. Detailed cross-product interface map

![Conceptual ownership and technology boundary map.](assets/ownership.png){width=96%}

## 4.1 Accounts & State <-> Cards

| Interface | Customer friction | Minimum valuable intervention | Authoritative partner |
|---|---|---|---|
| Authorization -> availability | Spendable balance seems lower | Explain reservations and balance semantics | Cards + core balance |
| Authorization -> history | Pending and posted appear twice | Correlate events and present lifecycle | Cards processing |
| Merchant data -> history | Unknown descriptor | Reliable merchant enrichment | Card data provider/enrichment |
| Card freeze -> account | Customer assumes all account activity stops | Clarify restriction scope | Cards + Risk |
| Dispute -> account | Refund/provisional credit is unclear | Linked dispute case and money status | Cards disputes + ledger |

**Senior nuance:** A card freeze may stop a card's transactions while allowing other account activity. A posted debit and a pending authorization must not be treated as two charges without investigating identifiers and lifecycle.

## 4.2 Accounts & State <-> Money Movement

| Interface | Customer friction | Minimum valuable intervention | Authoritative partner |
|---|---|---|---|
| Balance -> transfer | Customer assumes funds usable | Current available funds and eligibility | Core / Risk |
| Instruction -> status | Accepted looks completed | Specific state contract | Money Movement |
| Rail -> history | Event delay | Timestamp and update semantics | Payment orchestration |
| Scheduled bill -> account | Obligation forgotten | Reliable upcoming activity where known | Scheduling service |
| Failure -> recovery | Safe action unclear | Reason-specific instruction | Money Movement + support |
| Reversal -> history | Customer can't match return | Linked original and reversal IDs | Payment ledger |

**Senior nuance:** Money Movement may own execution; Accounts owns the user's comprehension. Align on exact meaning of `accepted`, `processing`, `completed` and `returned`.

## 4.3 Accounts & State <-> Investments

| Interface | Customer friction | Minimum valuable intervention | Authoritative partner |
|---|---|---|---|
| Funding -> brokerage | Money debited but not investable | Linked funding timeline | Investments + Money Movement |
| Banking -> portfolio | Fragmented financial picture | Clearly segmented overview | Investments holdings |
| Cash -> investments | Customer transfers money needed for rent | Context about known obligations | Banking + Investments |
| Registered account transfer | Limits/eligibility unclear | Product-specific validation/guidance | Brokerage + Compliance |

**Senior nuance:** Cash at the bank, brokerage cash, and available-to-trade buying power are different financial concepts. Never silently collapse them into one "available" number.

## 4.4 Cross-cutting interfaces

**Identity and consent:** One customer may have multiple products, legal entities and permissions. Reuse only permitted verification data; joint-account permissions and family sharing need explicit design.

**Data / event semantics:** Each product should supply unique identifiers, reliable states, timestamps, reasons, versioning and documented interpretation.

**Customer support:** Resolve the entire financial job, not a single team ticket. Shared authorized case context helps, but data access needs least privilege and audit.

**Risk:** Fraud, AML, eligibility, limits and restrictions are not optional frontend checks. The experience must faithfully reflect backend enforcement and permissible customer information.

# 5. Friction opportunity library

The following are general opportunity hypotheses and *not* verified Questrade shortcomings. Each line pairs the customer symptom with an initial intervention, a meaningful metric and a risk.

## 5.1 Within Accounts & State

| Friction | First intervention | Outcome metric | Guardrail |
|---|---|---|---|
| Can't find transaction | Amount/date/merchant search | Successful find task | Incorrect result |
| Unknown merchant | Reliable enrichment | Correct recognition | Fraud reporting suppressed |
| Available balance confusing | Authoritative hold breakdown | Balance comprehension | Wrong spendable value |
| Hydro status uncertain | Bill receipt and actual status | Status certainty | False biller-credit claim |
| Subscription view fragmented | Confirmed recurring grouping | Useful obligation identification | False recurrence |
| Too many alerts | Severity hierarchy and preferences | Useful actions | Missed critical alert |
| Unclear cash flow | Known obligations and labeled estimates | Planning task success | False prediction |
| Account restriction unclear | Customer-safe restriction guidance | Correct recovery | Risk-rule leakage |

## 5.2 Accounts versus Cards

| Friction | First intervention | Outcome metric | Guardrail |
|---|---|---|---|
| Pending charge looks duplicated | Auth-clearing correlation | Correct recognition | Hide genuine duplicate |
| Final amount changes | Pending/final semantics | Reduced charge confusion | Misstated amount |
| Purchase appears late | Status freshness indicator | Timely appearance | Stale state as fact |
| Card restriction ambiguous | Scope explanation | Successful freeze task | Unauthorized card use |
| Dispute status invisible | Linked case timeline | Successful case tracking | False resolution |

## 5.3 Accounts versus Money Movement

| Friction | First intervention | Outcome metric | Guardrail |
|---|---|---|---|
| Transfer stuck | Real status and safe next step | Correct status recognition | Duplicate retry |
| Double transfer | Idempotency and confirmation | Unintended duplicates down | Suppressed intended transfer |
| Bill not visibly paid | Bank-side receipt and limitations | Inquiries down | Missed bill |
| Scheduled payment shortfall | Known obligation visibility | Successful planning | NSF |
| Bank switching confusion | Guided biller transition | Verified migration | Missed recurring debit |
| Failed payment vague | Reason-specific recovery | Safe recovery rate | Fraud leakage |

## 5.4 Accounts versus Investments

| Friction | First intervention | Outcome metric | Guardrail |
|---|---|---|---|
| Funding not reflected | Cross-product timeline | Correct state comprehension | False buying power |
| Savings transfer forgotten | Opt-in recurring transfer | Sustained safe saving | Involuntary debit |
| Money needed for bills is invested | Known obligation context | Informed funding | Liquidity shortfall |
| Total position fragmented | Segmented unified overview | Successful financial position task | Stale/double count |
| Product eligibility unclear | Accurate guidance | Appropriate exploration | Unsuitable prompts |

## 5.5 Shared services / recovery

| Friction | First intervention | Outcome metric | Guardrail |
|---|---|---|---|
| Repeated KYC | Permitted reuse of verified data | Repeat steps reduced | Compliance exception |
| Support handoff | Authorized shared case ID/timeline | Resolution | Privacy breach |
| Conflicting notifications | Standard event semantics | Consistent status | False alert |
| Recovery inconsistent | Guided issue classification | Self-serve completion | Unauthorized action |
| Family screenshot shares too much | Redacted receipt preview | Private sharing success | Sensitive data leak |

# 6. Banking-state and architecture primer

## 6.1 Three kinds of state

- **Account state:** Pending opening / active / restricted / closing / closed.
- **Transaction state:** Requested / authorized or accepted / processing / posted or completed / returned / reversed.
- **Balance state:** Ledger/current, available, held or reserved amounts.

A customer can have an active account, an in-flight transfer and a lower available balance simultaneously. All three must be explained without claiming the final recipient has been paid.

![Simplified transaction lifecycle. Different rails have different milestones.](assets/transaction_lifecycle.png){width=95%}

## 6.2 Authoritative systems versus experience projections

The financial system of record establishes balance and posting truth; read models support fast history, search and dashboards. The UI should not independently recompute spendability from a partial transaction list. Search indexes can lag; showing "last updated" may be appropriate for read-only views, not for payment authorization.

## 6.3 Mechanisms and trade-offs

| Mechanism | Why it matters | Product-level design choice |
|---|---|---|
| Idempotency | Avoid duplicate payment on retry | Stable logical request ID and outcome lookup |
| Atomicity | Avoid partial internal ledger operation | Coordinate debit/credit commit within core |
| Event deduplication | Avoid repeated projected entries | Event IDs and processing semantics |
| Versioned state transitions | Avoid regression from late events | Validate state machine order |
| Reconciliation | Detect mismatched ledger and rail records | Alert and resolve exception cases |
| Timeouts and bounded retry | Limit cascading failures | Unknown state versus automatic resend |
| Availability and stale display | Keep safe services usable | Explicit freshness; disable unsafe actions |
| Audit and authorization | Enable investigation and protect data | Entitlements, traceable actions |

## 6.4 Conceptual service topology

App -> Accounts API -> transaction read projection -> events from Cards, Money Movement, and core ledger. Independently, payment authorization and posting continue through authoritative payment/core paths. Risk, identity and entitlements apply to relevant calls. A transaction projection helps customer comprehension; it is not a substitute for core transaction integrity.

## 6.5 Common system design requirements

**Functional:** list transactions, search/filter, show status, create instructions, link references, recover from failures, provide receipts and permitted account controls.

**Non-functional:** correctness, auditability, customer/transaction entitlements, freshness, availability, latency, scale, capacity, reconciliation, observability and incident recovery.

**Failure patterns:** duplicate requests; delayed status; out-of-order events; failed callback; search lag; read-model outage; reversed payment; balance hold mismatch; notification delivery failure; backend timeout with unknown operation result.

# 7. Prioritization: what to solve first

| Priority band | Examples | Why |
|---|---|---|
| Critical integrity | Incorrect balances, duplicate debits, unauthorized transfers, material compliance gaps | Financial harm and trust |
| High-value core task | Unclear payment status, failed first funding, missed payment, inaccessible funds | Banking utility and adoption |
| Important day-to-day | Merchant recognition, transaction search, recurring-bill visibility | Everyday confidence |
| Differentiation | Sophisticated insights, personalization and advanced automation | Stronger value once foundation works |

These bands are illustrative interview reasoning, not Questrade incident classifications. Severity overrides frequency; a rare integrity issue can outrank a common low-risk search annoyance.

**Qualitative decision lens:** customer job, impact/severity, evidence, time to value, integration dependencies, risk and longer-term leverage. Make one clear choice and state what information could change it.

# 8. Full measurement framework

![Metric types: leading, outcome, supporting, guardrails.](assets/metrics.png){width=96%}

## 8.1 Example north-star tree

A potential overall goal is **more customers using the bank as a trusted primary financial relationship**. Its dimensions could be: (a) funded activation, (b) recurring money in/out, (c) daily financial control, (d) retention and trust. Define primary-account activity carefully; frequency of logins or a single promotion deposit is not sufficient.

## 8.2 Metrics by initiative

| Initiative | Leading | Outcome | Supporting | Guardrail |
|---|---|---|---|---|
| Onboarding | Verification task completion | Funded activation | Drop-off and retries | Fraud/KYC |
| First funding | Successful first deposit | Repeat financial activity | Time to funding | Returns |
| Switch primary bank | Payroll/biller setup | Sustained recurring activity | Switch progress | Missed bills |
| Transaction search | Successful find task | Reduced unresolved queries | Query refinements | Wrong results |
| Payment confirmation | Correct state recognition | Unresolved status inquiries down | Repeat checks | False completion |
| Money transfer | Completed intended transfer | Repeat safe payment use | Processing time | Duplicate/fraud |
| Insights | Useful action taken | Better planning/outcome | Insight relevance | False prediction |
| Savings automation | Safe rule setup | Sustained net saving | Pauses/skips | NSF |
| Brokerage funding | Eligible funding completed | Sustained appropriate use | Journey completion | Wrong trade availability |
| Recovery | Safe recovery success | Resolved issues | Time/escalations | Unauthorized action |

## 8.3 Metrics that mislead

- More transaction history views can indicate confusion.
- More notifications sent/opened do not prove usefulness.
- More transfer *attempts* can indicate repeated failures.
- Reduced support contact can conceal failure to reach help.
- More account openings can disguise low funded activity.
- High investment transfer volume may come at the cost of short-term liquidity.
- Longer app sessions can indicate slower task completion.

**Denominators matter:** Status contacts per 1,000 eligible payments are more interpretable than unadjusted contact counts if transaction volume changes. Define event counting, cohort, eligibility and time window.

# 9. How to structure a strong live answer

Use **Clarify -> Problem -> Options -> Choice -> Dependency -> Measure -> Guardrail -> Validate**. It is not necessary to say all labels aloud. One pivotal clarification is often better than five generic questions.

**A natural starting phrase:** "Let me make sure I understand what the customer is trying to do. If they're checking a payment they've already made, I'd approach it differently than if they're planning the next bill. I'll assume the first case and explain what I'd try."

**What raises answer quality:** identify the decision, prioritize using evidence and risk, acknowledge the financial-state contract, select one real customer outcome, and be clear what you would do if evidence contradicts your assumption.

**What lowers answer quality:** propose a full dashboard without diagnosing the job; equate status view clicks with success; use generic RICE scoring without judgment; conflate authorization and settlement; assume the UI can safely change financial states; promise real-time outcome without route support; omit risk/guardrails.

**Interview answer checklist:** correct customer job, credible two options, reasoned choice, sufficient system awareness, specific metric, critical safeguard, concise spoken delivery.


# 10. Exhaustive interview question bank with worked answers

This section contains **exactly 90 worked responses**: 12 extended priority scenarios followed by 78 category questions across sections 10.1-10.7. Repeated themes are deliberately retained under both top-priority and comprehensive-bank IDs so Cursor can retrieve a fully worked answer from either location.

**Answer convention:** "Clarify" is the highest-value question to ask (not a mandatory interrogatory). The "Choose" field represents a reasoned provisional decision under the stated assumption. The "Worked spoken answer" is a conversational synthesis, not text to memorize word for word. Financial mechanisms and ownership are conceptual unless explicitly verified in a source.

## 10.0 Priority 12: extended worked answers

| ID | Priority practice question | Related full question |
|---|---|---|
| T01 | How would you improve transaction history? | `Q10.1-01` |
| T02 | Customers repeatedly check whether they paid a bill. What would you try? | `Q10.1-08` |
| T03 | How would you help customers make Questrade their primary bank? | `Q10.2-04` |
| T04 | How would you improve the customer experience of pending transfers? | `Q10.3-02` |
| T05 | How would you design an account balance experience? | `Q10.1-05` |
| T06 | How would you design personal finance insights? | `Q10.1-09` |
| T07 | How would you help customers understand upcoming bills and cash flow? | `Q10.1-14` |
| T08 | Customers open accounts but do not fund or use them. What would you do? | `Q10.2-02` |
| T09 | How would you help customers move money between banking and investing? | `Q10.4-06` |
| T10 | What happens if payment processing is delayed or an event fails? | `Q10.6-03` |
| T11 | How would you improve the experience of helping a family member with banking? | `Q10.1-13` |
| T12 | A regulatory change alters how quickly money can be transferred. What do you do? | `Q10.7-10` |


### [T01] How would you improve transaction history?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `T01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What job fails today: finding a charge, understanding status, or spotting fraud?

**Customer problem / diagnostic hypothesis.** A chronological ledger is accurate but can be hard to interpret or act on.

**Option A.** Improve search, filters and enriched transaction detail.

**Option B.** Build a comprehensive insights and recurring-bills hub.

**Choose and justify.** Start with successful find-and-understand tasks for the largest validated pain point; richer insights are a second phase.

**Additional senior-level reasoning.** Clarify whether the dominant job is finding a record, understanding what it means, or verifying status. Map the top tasks and failures with support contacts, search logs and customer research. Narrow the MVP to task-focused filters and reliable transaction details, rather than introducing a broad dashboard. Show authorization-versus-posting context, recognizable merchant names only when confidently matched, and clear recovery routes for unauthorized transactions. Prioritize by frequency multiplied by customer harm, not click counts.

**Primary metric.** Successful transaction-identification rate and reduction in unresolved lookup contacts.

**Guardrail.** Never mislabel merchant or posting state; protect private transaction data.

**Cross-team or technical dependency.** Accounts experience with Cards, Money Movement, ledger, data-enrichment services.

**Worked spoken answer.**

"My first question would be: What job fails today: finding a charge, understanding status, or spotting fraud? My working hypothesis is that a chronological ledger is accurate but can be hard to interpret or act on.. I see two credible paths: improve search, filters and enriched transaction detail, or build a comprehensive insights and recurring-bills hub. Start with successful find-and-understand tasks for the largest validated pain point; richer insights are a second phase. This depends on Accounts experience with Cards, Money Movement, ledger, data-enrichment services; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful transaction-identification rate and reduction in unresolved lookup contacts, with never mislabel merchant or posting state; protect private transaction data as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T02] Customers repeatedly check whether they paid a bill. What would you try?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `T02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do they mean bank submission, payment-network completion, or biller credit?

**Customer problem / diagnostic hypothesis.** Payment state terminology overstates the bank’s evidence.

**Option A.** Clarify bank-side status, reference and timestamp on payment detail.

**Option B.** Full utility-company confirmation integration.

**Choose and justify.** Start with a truthful receipt and status; expand external confirmation only if feasible and valuable.

**Additional senior-level reasoning.** Separate checking a past payment from remembering a future bill. For a past payment, show biller, amount, submission or processing status, date and bank reference from an authoritative source. Do not claim biller credit unless confirmed. Compared with a full bill tracker, this solves the immediate uncertainty with fewer predicted due-date dependencies. Confirm the actual cause through interviews and related support contacts before expanding.

**Primary metric.** Successful payment-status identification and lower unresolved inquiries.

**Guardrail.** Misleading bill-paid claim and duplicate re-payment.

**Cross-team or technical dependency.** Money Movement status contract and biller data availability.

**Worked spoken answer.**

"My first question would be: Do they mean bank submission, payment-network completion, or biller credit? My working hypothesis is that payment state terminology overstates the bank’s evidence.. I see two credible paths: clarify bank-side status, reference and timestamp on payment detail, or full utility-company confirmation integration. Start with a truthful receipt and status; expand external confirmation only if feasible and valuable. This depends on Money Movement status contract and biller data availability; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful payment-status identification and lower unresolved inquiries, with misleading bill-paid claim and duplicate re-payment as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T03] How would you help customers make Questrade their primary bank?
**Category:** 10.2 Activation and growth.  **Answer ID:** `T03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What observable behaviours define primary use for this customer segment?

**Customer problem / diagnostic hypothesis.** Customers may test banking without moving their income and bills.

**Option A.** Progressive switching journey: first deposit, card use, payroll, billers.

**Option B.** Promotional rewards for balances and transactions.

**Choose and justify.** Prioritize durable routine adoption and trust; incentives can complement but cannot replace reliable utility.

**Additional senior-level reasoning.** Separate account opening from recurring adoption. Segment unfunded, funded-but-unused, first-use-only and partial switchers. Diagnose barriers such as payroll setup, payment reliability and biller migration. Prioritize a context-aware path from first funding to a verified repeating use case. The goal is not merely more sign-ups: it is customers confidently moving real financial routines.

**Primary metric.** Monthly users with recurring inbound income and meaningful outgoing use.

**Guardrail.** Missed bill/payroll, financial complaints, unsustainable reward economics.

**Cross-team or technical dependency.** Accounts, Cards, Money Movement, CRM, support.

**Worked spoken answer.**

"My first question would be: What observable behaviours define primary use for this customer segment? My working hypothesis is that customers may test banking without moving their income and bills.. I see two credible paths: progressive switching journey: first deposit, card use, payroll, billers, or promotional rewards for balances and transactions. Prioritize durable routine adoption and trust; incentives can complement but cannot replace reliable utility. This depends on Accounts, Cards, Money Movement, CRM, support; I would validate the relevant data contract and ownership before committing to the experience. I would measure monthly users with recurring inbound income and meaningful outgoing use, with missed bill/payroll, financial complaints, unsustainable reward economics as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T04] How would you improve the customer experience of pending transfers?
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `T04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** For which payment type, and what milestone can the bank prove?

**Customer problem / diagnostic hypothesis.** A green success screen can overstate what actually completed.

**Option A.** Show authoritative stage, reference, timing and next action.

**Option B.** Deep integrations for recipient-side confirmation.

**Choose and justify.** First define state semantics; ship truthful status and receipt before broader integrations.

**Additional senior-level reasoning.** Start with the distinction between actual delayed processing and delayed status projection. Map accepted, processing, completed, failed and returned semantics for the specific rail. Show status and safe next action; a screen timeout is not a failed transfer. Compare the low-risk visibility improvement with the harder task of changing the payment mechanism; select based on whether customer pain is uncertainty or actual latency.

**Primary metric.** Correct outcome comprehension and fewer unresolved contacts.

**Guardrail.** False completed labels and duplicate payment attempts.

**Cross-team or technical dependency.** Money Movement state and rail acknowledgments.

**Worked spoken answer.**

"My first question would be: For which payment type, and what milestone can the bank prove? My working hypothesis is that a green success screen can overstate what actually completed.. I see two credible paths: show authoritative stage, reference, timing and next action, or deep integrations for recipient-side confirmation. First define state semantics; ship truthful status and receipt before broader integrations. This depends on Money Movement state and rail acknowledgments; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct outcome comprehension and fewer unresolved contacts, with false completed labels and duplicate payment attempts as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T05] How would you design an account balance experience?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `T05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the balance wrong or is its definition unclear?

**Customer problem / diagnostic hypothesis.** The customer may conflate posted, available, pending and held amounts.

**Option A.** Balance breakdown with labels and contextual explanations.

**Option B.** Predictive full-month cash-flow calendar.

**Choose and justify.** First clarify authoritative values and explain actual differences; projections can follow after core trust.

**Additional senior-level reasoning.** Begin by determining whether the data is wrong or simply confusing. Distinguish posted balance, available balance and identifiable reservations or holds. Use the authoritative balance service for spendability, not a frontend sum of visible transactions. Add a compact explanation and supporting details. In an outage, a labeled older read-only view may be safe, but payment authorization cannot assume cached funds are current.

**Primary metric.** Balance comprehension and fewer unresolved balance inquiries.

**Guardrail.** Wrong spendable amount or release promise.

**Cross-team or technical dependency.** Core banking balance/hold APIs, Accounts design, Risk.

**Worked spoken answer.**

"My first question would be: Is the balance wrong or is its definition unclear? My working hypothesis is that the customer may conflate posted, available, pending and held amounts.. I see two credible paths: balance breakdown with labels and contextual explanations, or predictive full-month cash-flow calendar. First clarify authoritative values and explain actual differences; projections can follow after core trust. This depends on Core banking balance/hold APIs, Accounts design, Risk; I would validate the relevant data contract and ownership before committing to the experience. I would measure balance comprehension and fewer unresolved balance inquiries, with wrong spendable amount or release promise as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T06] How would you design personal finance insights?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `T06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which financial decision is the customer currently struggling to make?

**Customer problem / diagnostic hypothesis.** Pretty charts do not create value unless they improve a decision.

**Option A.** Recurring-charge discovery and upcoming-obligation context.

**Option B.** Sophisticated AI financial coaching across all accounts.

**Choose and justify.** Start with explainable, high-confidence insights customers can verify and act upon.

**Additional senior-level reasoning.** Choose one real decision—such as identifying an upcoming recurring obligation—rather than building a generic chart dashboard. Start with high-confidence transaction patterns, user correction, explainability and explicit next actions. Separate known scheduled payments from predictions. Reserve AI/personalized advice for later once data quality, consent and harm controls are proven.

**Primary metric.** Confirmed useful actions or improved obligation identification.

**Guardrail.** Wrong categorization, invasive personalization, dangerous advice.

**Cross-team or technical dependency.** Transaction enrichment, consent, analytics and notification preferences.

**Worked spoken answer.**

"My first question would be: Which financial decision is the customer currently struggling to make? My working hypothesis is that pretty charts do not create value unless they improve a decision.. I see two credible paths: recurring-charge discovery and upcoming-obligation context, or sophisticated AI financial coaching across all accounts. Start with explainable, high-confidence insights customers can verify and act upon. This depends on Transaction enrichment, consent, analytics and notification preferences; I would validate the relevant data contract and ownership before committing to the experience. I would measure confirmed useful actions or improved obligation identification, with wrong categorization, invasive personalization, dangerous advice as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T07] How would you help customers understand upcoming bills and cash flow?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `T07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are missed payments caused by forgetting, insufficient funds or payment processing failure?

**Customer problem / diagnostic hypothesis.** A reminder cannot solve an underlying payment-rail failure or insufficient liquidity.

**Option A.** Known upcoming-payment reminders and available-funds context.

**Option B.** Automatic payment and cash sweeping on behalf of customer.

**Choose and justify.** Start with the intervention aligned to the dominant root cause; require authorization for automation.

**Additional senior-level reasoning.** Determine whether the customer misses bills through forgetting, insufficient available funds or an underlying payment failure. Start with a consolidated view of known scheduled bills and customer-confirmed recurring estimates, alongside available balance and notification options. Avoid presenting inferred due dates as facts or automatically paying bills without consent.

**Primary metric.** Reduction in avoidable missed payments among eligible customers.

**Guardrail.** False due dates, failed debits, excess alert volume.

**Cross-team or technical dependency.** Money Movement scheduled payments, recurrence, balance, consent.

**Worked spoken answer.**

"My first question would be: Are missed payments caused by forgetting, insufficient funds or payment processing failure? My working hypothesis is that a reminder cannot solve an underlying payment-rail failure or insufficient liquidity.. I see two credible paths: known upcoming-payment reminders and available-funds context, or automatic payment and cash sweeping on behalf of customer. Start with the intervention aligned to the dominant root cause; require authorization for automation. This depends on Money Movement scheduled payments, recurrence, balance, consent; I would validate the relevant data contract and ownership before committing to the experience. I would measure reduction in avoidable missed payments among eligible customers, with false due dates, failed debits, excess alert volume as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T08] Customers open accounts but do not fund or use them. What would you do?
**Category:** 10.2 Activation and growth.  **Answer ID:** `T08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which funding step fails: link, instruction, settlement, or motivation?

**Customer problem / diagnostic hypothesis.** An account opened is not an account delivering value.

**Option A.** Improve first funding guidance and error recovery.

**Option B.** Offer cash bonuses for initial deposits.

**Choose and justify.** Fix proven operational and comprehension issues before paying users to work around them.

**Additional senior-level reasoning.** Instrument the entire journey: account creation, eligible funding, first deposit, first payment, return visit and recurring use. Distinguish technical failure from uncertainty and weak value proposition. For the largest drop-off, test a narrowly targeted next step or error-recovery intervention. Do not mistake a promotional deposit for long-term primary banking adoption.

**Primary metric.** First successful funding rate within 30 days.

**Guardrail.** Failed/returned deposits, fraud, misleading availability.

**Cross-team or technical dependency.** Money Movement, account-linking, ledger, onboarding.

**Worked spoken answer.**

"My first question would be: Which funding step fails: link, instruction, settlement, or motivation? My working hypothesis is that an account opened is not an account delivering value.. I see two credible paths: improve first funding guidance and error recovery, or offer cash bonuses for initial deposits. Fix proven operational and comprehension issues before paying users to work around them. This depends on Money Movement, account-linking, ledger, onboarding; I would validate the relevant data contract and ownership before committing to the experience. I would measure first successful funding rate within 30 days, with failed/returned deposits, fraud, misleading availability as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T09] How would you help customers move money between banking and investing?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `T09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which step is delayed: debit, settlement, brokerage posting, or purchasing power?

**Customer problem / diagnostic hypothesis.** Bank-side transferred status differs from availability to trade.

**Option A.** Cross-product timeline with separate bank and investment milestones.

**Option B.** Make all transfers immediately tradeable.

**Choose and justify.** Provide truthful visibility and investigate actual delay separately.

**Additional senior-level reasoning.** Map source debit, payment rail processing, brokerage receipt, posting and available-to-trade state separately. One joined timeline can reduce uncertainty without forcing both products into a false universal “completed” label. Validate eligibility, account ownership, registered contribution considerations, transfer limits and reversal paths. Choose an MVP route with known dependable data.

**Primary metric.** Correct status comprehension and fewer ambiguous funding inquiries.

**Guardrail.** False available-to-trade claims, mismatched balances.

**Cross-team or technical dependency.** Money Movement, brokerage back office, core ledger.

**Worked spoken answer.**

"My first question would be: Which step is delayed: debit, settlement, brokerage posting, or purchasing power? My working hypothesis is that bank-side transferred status differs from availability to trade.. I see two credible paths: cross-product timeline with separate bank and investment milestones, or make all transfers immediately tradeable. Provide truthful visibility and investigate actual delay separately. This depends on Money Movement, brokerage back office, core ledger; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct status comprehension and fewer ambiguous funding inquiries, with false available-to-trade claims, mismatched balances as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T10] What happens if payment processing is delayed or an event fails?
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `T10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which rails, lifecycle milestones and customer-visible claims are in scope?

**Customer problem / diagnostic hypothesis.** An event projection needs stable IDs, state semantics and robust handling for duplicate and delayed messages.

**Option A.** Payment service publishes versioned events to normalized status projection.

**Option B.** Poll every upstream system on every screen view.

**Choose and justify.** Use reliable event-driven projection plus authoritative status lookup when needed; avoid fabricated completion.

**Additional senior-level reasoning.** A delay is not proof of failure. Use durable payment identifiers, idempotent request handling, event versioning/deduplication, explicit unknown states and reconciliation. Distinguish a harmless late read projection from a missing financial posting. The experience must show only supported outcomes and allow controlled escalation. Test retries, duplicate events and out-of-order events before rollout.

**Primary metric.** Timely correct status projection and customer comprehension.

**Guardrail.** State regression, false completion, missing reversal.

**Cross-team or technical dependency.** Money Movement, event bus, state store, reconciliation.

**Worked spoken answer.**

"First I would scope the requirements: Which rails, lifecycle milestones and customer-visible claims are in scope? An event projection needs stable IDs, state semantics and robust handling for duplicate and delayed messages. I see two technical approaches: payment service publishes versioned events to normalized status projection, or poll every upstream system on every screen view. Use reliable event-driven projection plus authoritative status lookup when needed; avoid fabricated completion. I would establish the ownership and failure semantics across Money Movement, event bus, state store, reconciliation. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are timely correct status projection and customer comprehension, with state regression, false completion, missing reversal as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T11] How would you improve the experience of helping a family member with banking?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `T11`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do family members need to view information or transact on each other’s behalf?

**Customer problem / diagnostic hypothesis.** Household coordination is difficult but permissions and privacy vary by relationship.

**Option A.** Scoped, redacted transaction sharing or joint-account views.

**Option B.** Full delegated multi-user household banking.

**Choose and justify.** Start with the least privileged verified use case; expand permissions only with proper authorization.

**Additional senior-level reasoning.** Clarify whether assistance means explaining one payment or granting authority to transact. For one-off understanding, a privacy-safe, user-previewed receipt with limited fields is a smaller intervention than delegation. A delegated-access system requires identity, relationship-based permissions, revocation, auditing and regulatory review. Do not treat an ordinary screenshot as an acceptable privacy solution.

**Primary metric.** Successful household task with minimum information exposure.

**Guardrail.** Unauthorized data access and accidental sharing.

**Cross-team or technical dependency.** Identity, consent, joint-account permissions, legal, support.

**Worked spoken answer.**

"My first question would be: Do family members need to view information or transact on each other’s behalf? My working hypothesis is that household coordination is difficult but permissions and privacy vary by relationship.. I see two credible paths: scoped, redacted transaction sharing or joint-account views, or full delegated multi-user household banking. Start with the least privileged verified use case; expand permissions only with proper authorization. This depends on Identity, consent, joint-account permissions, legal, support; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful household task with minimum information exposure, with unauthorized data access and accidental sharing as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [T12] A regulatory change alters how quickly money can be transferred. What do you do?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `T12`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What exactly is required, effective when, and which customer flows are affected?

**Customer problem / diagnostic hypothesis.** Compliance changes can invalidate a launch promise and require backend state/control updates.

**Option A.** Narrow scope and implement enforced compliant state with transparent UX.

**Option B.** Keep schedule and only update customer-facing copy.

**Choose and justify.** Align Legal, Risk, engineering and leadership; delay/limit launch if compliance cannot be proven.

**Additional senior-level reasoning.** Confirm legal scope and effective date, then separate compliance-critical changes from optional experience features. Implement holds and release rules in backend/payment orchestration, create a truthful held state, test edge cases and preserve audit trails. Re-scope or delay release if correctness cannot be proven. Do not preserve “instant” marketing for impacted flows.

**Primary metric.** Successful compliant processing of in-scope flows.

**Guardrail.** Early release, audit gaps, illegal transactions.

**Cross-team or technical dependency.** Compliance, Risk, Money Movement, core, QA.

**Worked spoken answer.**

"I would clarify the strategic constraint first: What exactly is required, effective when, and which customer flows are affected? The important tension is that compliance changes can invalidate a launch promise and require backend state/control updates.. One route would be to narrow scope and implement enforced compliant state with transparent UX; another would be to keep schedule and only update customer-facing copy. Align Legal, Risk, engineering and leadership; delay/limit launch if compliance cannot be proven. I would make dependencies across Compliance, Risk, Money Movement, core, QA explicit rather than optimizing one team's roadmap in isolation. I would judge success through successful compliant processing of in-scope flows, while protecting against early release, audit gaps, illegal transactions. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.



## 10.1-10.7 Full categorized practice bank

## 10.1 Accounts & State product sense


### [Q10.1-01] Design a better transaction history
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What job fails today: finding a charge, understanding status, or spotting fraud?

**Customer problem / diagnostic hypothesis.** A chronological ledger is accurate but can be hard to interpret or act on.

**Option A.** Improve search, filters and enriched transaction detail.

**Option B.** Build a comprehensive insights and recurring-bills hub.

**Choose and justify.** Start with successful find-and-understand tasks for the largest validated pain point; richer insights are a second phase.

**Primary metric.** Successful transaction-identification rate and reduction in unresolved lookup contacts.

**Guardrail.** Never mislabel merchant or posting state; protect private transaction data.

**Cross-team or technical dependency.** Accounts experience with Cards, Money Movement, ledger, data-enrichment services.

**Worked spoken answer.**

"My first question would be: What job fails today: finding a charge, understanding status, or spotting fraud? My working hypothesis is that a chronological ledger is accurate but can be hard to interpret or act on.. I see two credible paths: improve search, filters and enriched transaction detail, or build a comprehensive insights and recurring-bills hub. Start with successful find-and-understand tasks for the largest validated pain point; richer insights are a second phase. This depends on Accounts experience with Cards, Money Movement, ledger, data-enrichment services; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful transaction-identification rate and reduction in unresolved lookup contacts, with never mislabel merchant or posting state; protect private transaction data as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-02] A customer cannot find a $200 charge
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do they remember merchant, date, card, or approximate amount?

**Customer problem / diagnostic hypothesis.** Search can fail due to merchant descriptors, date variance, pending status, or pagination.

**Option A.** Search across raw and normalized merchant names with amount/date filters.

**Option B.** Build an AI natural-language transaction assistant.

**Choose and justify.** Start with robust filters and transaction detail that tolerate descriptor/date ambiguity; advanced assistant is unproven complexity.

**Primary metric.** Share of users locating the intended $200 charge in task testing.

**Guardrail.** No false matching, cross-account data leakage, or suppressed actual fraud.

**Cross-team or technical dependency.** Card authorization/clearing data, search index, entitlement checks.

**Worked spoken answer.**

"My first question would be: Do they remember merchant, date, card, or approximate amount? My working hypothesis is that search can fail due to merchant descriptors, date variance, pending status, or pagination.. I see two credible paths: search across raw and normalized merchant names with amount/date filters, or build an AI natural-language transaction assistant. Start with robust filters and transaction detail that tolerate descriptor/date ambiguity; advanced assistant is unproven complexity. This depends on Card authorization/clearing data, search index, entitlement checks; I would validate the relevant data contract and ownership before committing to the experience. I would measure share of users locating the intended $200 charge in task testing, with no false matching, cross-account data leakage, or suppressed actual fraud as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-03] A customer thinks they have been charged twice
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are there two posted debits, or one authorization and one clearing item?

**Customer problem / diagnostic hypothesis.** A true duplicate payment and a misleading pending/posted projection require different actions.

**Option A.** Link authorization to final posting and explain pending activity.

**Option B.** Launch automatic duplicate-charge dispute creation.

**Choose and justify.** First verify authoritative records; fix representation when it is one lifecycle, but route genuine duplicates for investigation.

**Primary metric.** Correct duplicate identification and fewer unnecessary duplicate-charge contacts.

**Guardrail.** Never hide a real duplicate or incorrectly dismiss fraud.

**Cross-team or technical dependency.** Cards, ledger posting, dispute operations, event correlation.

**Worked spoken answer.**

"My first question would be: Are there two posted debits, or one authorization and one clearing item? My working hypothesis is that a true duplicate payment and a misleading pending/posted projection require different actions.. I see two credible paths: link authorization to final posting and explain pending activity, or launch automatic duplicate-charge dispute creation. First verify authoritative records; fix representation when it is one lifecycle, but route genuine duplicates for investigation. This depends on Cards, ledger posting, dispute operations, event correlation; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct duplicate identification and fewer unnecessary duplicate-charge contacts, with never hide a real duplicate or incorrectly dismiss fraud as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-04] A customer does not recognize a transaction
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is this a harmless merchant descriptor or an unauthorized transaction?

**Customer problem / diagnostic hypothesis.** Raw merchant descriptors are not customer-friendly; fraud remains a separate possibility.

**Option A.** Merchant enrichment with location, amount and card context.

**Option B.** One-click dispute/report flow for all unidentified activity.

**Choose and justify.** Show reliable enrichment and preserve a prominent fraud-report route rather than assuming confusion always explains it.

**Primary metric.** Correct merchant recognition and resolved unidentified-transaction cases.

**Guardrail.** False identity enrichment and delayed unauthorized-charge reports.

**Cross-team or technical dependency.** Card network fields, enrichment data quality, fraud and disputes.

**Worked spoken answer.**

"My first question would be: Is this a harmless merchant descriptor or an unauthorized transaction? My working hypothesis is that raw merchant descriptors are not customer-friendly; fraud remains a separate possibility.. I see two credible paths: merchant enrichment with location, amount and card context, or one-click dispute/report flow for all unidentified activity. Show reliable enrichment and preserve a prominent fraud-report route rather than assuming confusion always explains it. This depends on Card network fields, enrichment data quality, fraud and disputes; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct merchant recognition and resolved unidentified-transaction cases, with false identity enrichment and delayed unauthorized-charge reports as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-05] How would you improve balance visibility?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the balance wrong or is its definition unclear?

**Customer problem / diagnostic hypothesis.** The customer may conflate posted, available, pending and held amounts.

**Option A.** Balance breakdown with labels and contextual explanations.

**Option B.** Predictive full-month cash-flow calendar.

**Choose and justify.** First clarify authoritative values and explain actual differences; projections can follow after core trust.

**Primary metric.** Balance comprehension and fewer unresolved balance inquiries.

**Guardrail.** Wrong spendable amount or release promise.

**Cross-team or technical dependency.** Core banking balance/hold APIs, Accounts design, Risk.

**Worked spoken answer.**

"My first question would be: Is the balance wrong or is its definition unclear? My working hypothesis is that the customer may conflate posted, available, pending and held amounts.. I see two credible paths: balance breakdown with labels and contextual explanations, or predictive full-month cash-flow calendar. First clarify authoritative values and explain actual differences; projections can follow after core trust. This depends on Core banking balance/hold APIs, Accounts design, Risk; I would validate the relevant data contract and ownership before committing to the experience. I would measure balance comprehension and fewer unresolved balance inquiries, with wrong spendable amount or release promise as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-06] A customer sees a $500 difference in their balances
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the difference explained by card holds, deposit holds or a genuine ledger break?

**Customer problem / diagnostic hypothesis.** An unexplained gap can be correct availability logic or a material accounting error.

**Option A.** Show reconciled breakdown of reservations and held funds.

**Option B.** Refresh client-side values or recompute available balance.

**Choose and justify.** Check authoritative data first; then expose the supported reason, never manufacture a client calculation.

**Primary metric.** Correct customer explanation of the $500 gap.

**Guardrail.** Any incorrect balance or prohibited hold disclosure.

**Cross-team or technical dependency.** Core banking, Cards reservations, deposit operations, support.

**Worked spoken answer.**

"My first question would be: Is the difference explained by card holds, deposit holds or a genuine ledger break? My working hypothesis is that an unexplained gap can be correct availability logic or a material accounting error.. I see two credible paths: show reconciled breakdown of reservations and held funds, or refresh client-side values or recompute available balance. Check authoritative data first; then expose the supported reason, never manufacture a client calculation. This depends on Core banking, Cards reservations, deposit operations, support; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct customer explanation of the $500 gap, with any incorrect balance or prohibited hold disclosure as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-07] Design a better way to track recurring payments
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do customers need a calendar of obligations or a record of what has already been paid?

**Customer problem / diagnostic hypothesis.** Historic recurring patterns do not guarantee next due date or bill amount.

**Option A.** Surface known scheduled payments and customer-confirmed recurring merchants.

**Option B.** Automate all predicted upcoming bill payments.

**Choose and justify.** Start with transparent visibility and confirmation before autonomous execution.

**Primary metric.** Correct identification of recurring obligations and useful reminder actions.

**Guardrail.** False prediction, missed bill, unauthorized auto-payment.

**Cross-team or technical dependency.** Transaction categorization, Money Movement schedule, external-biller limitations.

**Worked spoken answer.**

"My first question would be: Do customers need a calendar of obligations or a record of what has already been paid? My working hypothesis is that historic recurring patterns do not guarantee next due date or bill amount.. I see two credible paths: surface known scheduled payments and customer-confirmed recurring merchants, or automate all predicted upcoming bill payments. Start with transparent visibility and confirmation before autonomous execution. This depends on Transaction categorization, Money Movement schedule, external-biller limitations; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct identification of recurring obligations and useful reminder actions, with false prediction, missed bill, unauthorized auto-payment as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-08] Customers do not know whether bills were paid
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do they mean bank submission, payment-network completion, or biller credit?

**Customer problem / diagnostic hypothesis.** Payment state terminology overstates the bank’s evidence.

**Option A.** Clarify bank-side status, reference and timestamp on payment detail.

**Option B.** Full utility-company confirmation integration.

**Choose and justify.** Start with a truthful receipt and status; expand external confirmation only if feasible and valuable.

**Primary metric.** Successful payment-status identification and lower unresolved inquiries.

**Guardrail.** Misleading bill-paid claim and duplicate re-payment.

**Cross-team or technical dependency.** Money Movement status contract and biller data availability.

**Worked spoken answer.**

"My first question would be: Do they mean bank submission, payment-network completion, or biller credit? My working hypothesis is that payment state terminology overstates the bank’s evidence.. I see two credible paths: clarify bank-side status, reference and timestamp on payment detail, or full utility-company confirmation integration. Start with a truthful receipt and status; expand external confirmation only if feasible and valuable. This depends on Money Movement status contract and biller data availability; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful payment-status identification and lower unresolved inquiries, with misleading bill-paid claim and duplicate re-payment as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-09] What spending insights would you launch first?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which financial decision is the customer currently struggling to make?

**Customer problem / diagnostic hypothesis.** Pretty charts do not create value unless they improve a decision.

**Option A.** Recurring-charge discovery and upcoming-obligation context.

**Option B.** Sophisticated AI financial coaching across all accounts.

**Choose and justify.** Start with explainable, high-confidence insights customers can verify and act upon.

**Primary metric.** Confirmed useful actions or improved obligation identification.

**Guardrail.** Wrong categorization, invasive personalization, dangerous advice.

**Cross-team or technical dependency.** Transaction enrichment, consent, analytics and notification preferences.

**Worked spoken answer.**

"My first question would be: Which financial decision is the customer currently struggling to make? My working hypothesis is that pretty charts do not create value unless they improve a decision.. I see two credible paths: recurring-charge discovery and upcoming-obligation context, or sophisticated AI financial coaching across all accounts. Start with explainable, high-confidence insights customers can verify and act upon. This depends on Transaction enrichment, consent, analytics and notification preferences; I would validate the relevant data contract and ownership before committing to the experience. I would measure confirmed useful actions or improved obligation identification, with wrong categorization, invasive personalization, dangerous advice as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-10] Design a payday experience
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the need to verify payroll, plan obligations, or automate allocation?

**Customer problem / diagnostic hypothesis.** A paycheque triggers multiple immediate decisions across spending and saving.

**Option A.** Show deposit received, available funds and known upcoming payments.

**Option B.** Automatically split each paycheque into bills, saving and investing.

**Choose and justify.** Start with a truthful payday overview and optional actions before automations.

**Primary metric.** Customers successfully plan or execute intended payday actions.

**Guardrail.** Incorrect cash projection, unwanted transfer, missed bill.

**Cross-team or technical dependency.** Core ledger, payroll deposit event, Money Movement, savings/investing.

**Worked spoken answer.**

"My first question would be: Is the need to verify payroll, plan obligations, or automate allocation? My working hypothesis is that a paycheque triggers multiple immediate decisions across spending and saving.. I see two credible paths: show deposit received, available funds and known upcoming payments, or automatically split each paycheque into bills, saving and investing. Start with a truthful payday overview and optional actions before automations. This depends on Core ledger, payroll deposit event, Money Movement, savings/investing; I would validate the relevant data contract and ownership before committing to the experience. I would measure customers successfully plan or execute intended payday actions, with incorrect cash projection, unwanted transfer, missed bill as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-11] How would you improve the account dashboard?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-11`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What are the highest-frequency tasks and moments of confusion?

**Customer problem / diagnostic hypothesis.** Overloaded dashboards often bury balance, recent activity and next action.

**Option A.** Task-first layout emphasizing usable funds, activity and urgent actions.

**Option B.** Universal personalized dashboard builder.

**Choose and justify.** Start with the dominant jobs and use evidence to add customization later.

**Primary metric.** Task success and time to critical information.

**Guardrail.** Stale balance, inaccessible notices, hidden fraud warning.

**Cross-team or technical dependency.** Accounts design, balance service, notifications, analytics.

**Worked spoken answer.**

"My first question would be: What are the highest-frequency tasks and moments of confusion? My working hypothesis is that overloaded dashboards often bury balance, recent activity and next action.. I see two credible paths: task-first layout emphasizing usable funds, activity and urgent actions, or universal personalized dashboard builder. Start with the dominant jobs and use evidence to add customization later. This depends on Accounts design, balance service, notifications, analytics; I would validate the relevant data contract and ownership before committing to the experience. I would measure task success and time to critical information, with stale balance, inaccessible notices, hidden fraud warning as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-12] Design smart account alerts
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-12`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which events require immediate action versus helpful awareness?

**Customer problem / diagnostic hypothesis.** Too many undifferentiated notifications cause fatigue and missed critical signals.

**Option A.** Event-severity hierarchy and preference controls.

**Option B.** Predictive AI alerts for all spending patterns.

**Choose and justify.** Prioritize actionable, high-confidence events with explicit controls.

**Primary metric.** Helpful-alert action rate and critical-alert delivery.

**Guardrail.** Alert duplication, omission of mandatory notices, privacy leakage.

**Cross-team or technical dependency.** Event bus, Risk, notification preferences, delivery monitoring.

**Worked spoken answer.**

"My first question would be: Which events require immediate action versus helpful awareness? My working hypothesis is that too many undifferentiated notifications cause fatigue and missed critical signals.. I see two credible paths: event-severity hierarchy and preference controls, or predictive AI alerts for all spending patterns. Prioritize actionable, high-confidence events with explicit controls. This depends on Event bus, Risk, notification preferences, delivery monitoring; I would validate the relevant data contract and ownership before committing to the experience. I would measure helpful-alert action rate and critical-alert delivery, with alert duplication, omission of mandatory notices, privacy leakage as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-13] Improve financial visibility for families
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-13`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do family members need to view information or transact on each other’s behalf?

**Customer problem / diagnostic hypothesis.** Household coordination is difficult but permissions and privacy vary by relationship.

**Option A.** Scoped, redacted transaction sharing or joint-account views.

**Option B.** Full delegated multi-user household banking.

**Choose and justify.** Start with the least privileged verified use case; expand permissions only with proper authorization.

**Primary metric.** Successful household task with minimum information exposure.

**Guardrail.** Unauthorized data access and accidental sharing.

**Cross-team or technical dependency.** Identity, consent, joint-account permissions, legal, support.

**Worked spoken answer.**

"My first question would be: Do family members need to view information or transact on each other’s behalf? My working hypothesis is that household coordination is difficult but permissions and privacy vary by relationship.. I see two credible paths: scoped, redacted transaction sharing or joint-account views, or full delegated multi-user household banking. Start with the least privileged verified use case; expand permissions only with proper authorization. This depends on Identity, consent, joint-account permissions, legal, support; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful household task with minimum information exposure, with unauthorized data access and accidental sharing as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-14] How would you help customers avoid missed payments?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-14`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are missed payments caused by forgetting, insufficient funds or payment processing failure?

**Customer problem / diagnostic hypothesis.** A reminder cannot solve an underlying payment-rail failure or insufficient liquidity.

**Option A.** Known upcoming-payment reminders and available-funds context.

**Option B.** Automatic payment and cash sweeping on behalf of customer.

**Choose and justify.** Start with the intervention aligned to the dominant root cause; require authorization for automation.

**Primary metric.** Reduction in avoidable missed payments among eligible customers.

**Guardrail.** False due dates, failed debits, excess alert volume.

**Cross-team or technical dependency.** Money Movement scheduled payments, recurrence, balance, consent.

**Worked spoken answer.**

"My first question would be: Are missed payments caused by forgetting, insufficient funds or payment processing failure? My working hypothesis is that a reminder cannot solve an underlying payment-rail failure or insufficient liquidity.. I see two credible paths: known upcoming-payment reminders and available-funds context, or automatic payment and cash sweeping on behalf of customer. Start with the intervention aligned to the dominant root cause; require authorization for automation. This depends on Money Movement scheduled payments, recurrence, balance, consent; I would validate the relevant data contract and ownership before committing to the experience. I would measure reduction in avoidable missed payments among eligible customers, with false due dates, failed debits, excess alert volume as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-15] How would you make banking feel less stressful?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-15`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** In which moment do customers feel uncertainty or loss of control?

**Customer problem / diagnostic hypothesis.** Stress can arise from unknown payment status, balance ambiguity or hard recovery.

**Option A.** Improve highest-severity uncertainty moment such as payment confirmation.

**Option B.** Broad rebrand and gamified wellness layer.

**Choose and justify.** Prioritize a verified trust gap over aesthetic or engagement features.

**Primary metric.** Confidence/task comprehension and unresolved issue rate.

**Guardrail.** Customer harm, anxiety-inducing alerts, financial errors.

**Cross-team or technical dependency.** Qual research, support contact taxonomy, transaction states.

**Worked spoken answer.**

"My first question would be: In which moment do customers feel uncertainty or loss of control? My working hypothesis is that stress can arise from unknown payment status, balance ambiguity or hard recovery.. I see two credible paths: improve highest-severity uncertainty moment such as payment confirmation, or broad rebrand and gamified wellness layer. Prioritize a verified trust gap over aesthetic or engagement features. This depends on Qual research, support contact taxonomy, transaction states; I would validate the relevant data contract and ownership before committing to the experience. I would measure confidence/task comprehension and unresolved issue rate, with customer harm, anxiety-inducing alerts, financial errors as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.1-16] Would you launch budgeting, bill tracking, or search first?
**Category:** 10.1 Accounts & State product sense.  **Answer ID:** `Q10.1-16`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which customer job has proven high unmet demand and is not already served?

**Customer problem / diagnostic hypothesis.** The features solve different needs and require different data quality.

**Option A.** Transaction search as core find-and-confirm utility.

**Option B.** Bill tracking or budgeting as broader proactive planning.

**Choose and justify.** Choose search if the dominant verified pain is locating past activity; otherwise prioritize the tested job, not the label.

**Primary metric.** Successful completion of the selected customer job.

**Guardrail.** Wrong merchant/category data and missed obligations.

**Cross-team or technical dependency.** Search infrastructure, transaction taxonomy, recurring recognition.

**Worked spoken answer.**

"My first question would be: Which customer job has proven high unmet demand and is not already served? My working hypothesis is that the features solve different needs and require different data quality.. I see two credible paths: transaction search as core find-and-confirm utility, or bill tracking or budgeting as broader proactive planning. Choose search if the dominant verified pain is locating past activity; otherwise prioritize the tested job, not the label. This depends on Search infrastructure, transaction taxonomy, recurring recognition; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful completion of the selected customer job, with wrong merchant/category data and missed obligations as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.

## 10.2 Activation and growth


### [Q10.2-01] How would you encourage existing Questrade investors to try banking?
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are investors failing to open banking accounts or failing to use them after opening?

**Customer problem / diagnostic hypothesis.** Existing investment trust does not automatically overcome everyday banking switching cost.

**Option A.** Use consented existing information to streamline banking onboarding and initial funding.

**Option B.** Offer broad acquisition incentives.

**Choose and justify.** First remove high-friction first-use steps; test a clear, differentiated value proposition before relying on subsidies.

**Primary metric.** Eligible investor-to-funded-banking conversion and sustained usage.

**Guardrail.** KYC shortcuts, cross-product privacy issues, inactive promotional accounts.

**Cross-team or technical dependency.** Investments, identity/KYC, banking onboarding, CRM.

**Worked spoken answer.**

"My first question would be: Are investors failing to open banking accounts or failing to use them after opening? My working hypothesis is that existing investment trust does not automatically overcome everyday banking switching cost.. I see two credible paths: use consented existing information to streamline banking onboarding and initial funding, or offer broad acquisition incentives. First remove high-friction first-use steps; test a clear, differentiated value proposition before relying on subsidies. This depends on Investments, identity/KYC, banking onboarding, CRM; I would validate the relevant data contract and ownership before committing to the experience. I would measure eligible investor-to-funded-banking conversion and sustained usage, with kYC shortcuts, cross-product privacy issues, inactive promotional accounts as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-02] Customers sign up but do not deposit money
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which funding step fails: link, instruction, settlement, or motivation?

**Customer problem / diagnostic hypothesis.** An account opened is not an account delivering value.

**Option A.** Improve first funding guidance and error recovery.

**Option B.** Offer cash bonuses for initial deposits.

**Choose and justify.** Fix proven operational and comprehension issues before paying users to work around them.

**Primary metric.** First successful funding rate within 30 days.

**Guardrail.** Failed/returned deposits, fraud, misleading availability.

**Cross-team or technical dependency.** Money Movement, account-linking, ledger, onboarding.

**Worked spoken answer.**

"My first question would be: Which funding step fails: link, instruction, settlement, or motivation? My working hypothesis is that an account opened is not an account delivering value.. I see two credible paths: improve first funding guidance and error recovery, or offer cash bonuses for initial deposits. Fix proven operational and comprehension issues before paying users to work around them. This depends on Money Movement, account-linking, ledger, onboarding; I would validate the relevant data contract and ownership before committing to the experience. I would measure first successful funding rate within 30 days, with failed/returned deposits, fraud, misleading availability as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-03] How would you increase direct-deposit adoption?
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do customers intend to switch payroll and struggle, or see little reason to?

**Customer problem / diagnostic hypothesis.** Employers and payroll processes sit outside the bank’s direct control.

**Option A.** Give clear account details, payroll instructions and verification checklist.

**Option B.** Build automated payroll switching integrations.

**Choose and justify.** Start with a guided, transparent setup unless external integrations are justified by volume and coverage.

**Primary metric.** Customers receiving sustained recurring payroll deposits.

**Guardrail.** Misdirected pay, delayed payroll, false setup confirmation.

**Cross-team or technical dependency.** Payroll interfaces, account details, external employer processes.

**Worked spoken answer.**

"My first question would be: Do customers intend to switch payroll and struggle, or see little reason to? My working hypothesis is that employers and payroll processes sit outside the bank’s direct control.. I see two credible paths: give clear account details, payroll instructions and verification checklist, or build automated payroll switching integrations. Start with a guided, transparent setup unless external integrations are justified by volume and coverage. This depends on Payroll interfaces, account details, external employer processes; I would validate the relevant data contract and ownership before committing to the experience. I would measure customers receiving sustained recurring payroll deposits, with misdirected pay, delayed payroll, false setup confirmation as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-04] How would you make Questrade a primary account?
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What observable behaviours define primary use for this customer segment?

**Customer problem / diagnostic hypothesis.** Customers may test banking without moving their income and bills.

**Option A.** Progressive switching journey: first deposit, card use, payroll, billers.

**Option B.** Promotional rewards for balances and transactions.

**Choose and justify.** Prioritize durable routine adoption and trust; incentives can complement but cannot replace reliable utility.

**Primary metric.** Monthly users with recurring inbound income and meaningful outgoing use.

**Guardrail.** Missed bill/payroll, financial complaints, unsustainable reward economics.

**Cross-team or technical dependency.** Accounts, Cards, Money Movement, CRM, support.

**Worked spoken answer.**

"My first question would be: What observable behaviours define primary use for this customer segment? My working hypothesis is that customers may test banking without moving their income and bills.. I see two credible paths: progressive switching journey: first deposit, card use, payroll, billers, or promotional rewards for balances and transactions. Prioritize durable routine adoption and trust; incentives can complement but cannot replace reliable utility. This depends on Accounts, Cards, Money Movement, CRM, support; I would validate the relevant data contract and ownership before committing to the experience. I would measure monthly users with recurring inbound income and meaningful outgoing use, with missed bill/payroll, financial complaints, unsustainable reward economics as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-05] Design a first-30-days banking experience
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Who is the customer and which activation milestone matters most?

**Customer problem / diagnostic hypothesis.** An undifferentiated checklist can overwhelm and ignores user progress.

**Option A.** Contextual next-best task based on actual account state.

**Option B.** All-product feature tour and forced tutorials.

**Choose and justify.** Start with a short sequence to first funding and first successful payment; personalize later by evidence.

**Primary metric.** 30-day funded and meaningful activation.

**Guardrail.** Irrelevant nudges, inaccurate state, notification fatigue.

**Cross-team or technical dependency.** Onboarding state, banking event stream, CRM.

**Worked spoken answer.**

"My first question would be: Who is the customer and which activation milestone matters most? My working hypothesis is that an undifferentiated checklist can overwhelm and ignores user progress.. I see two credible paths: contextual next-best task based on actual account state, or all-product feature tour and forced tutorials. Start with a short sequence to first funding and first successful payment; personalize later by evidence. This depends on Onboarding state, banking event stream, CRM; I would validate the relevant data contract and ownership before committing to the experience. I would measure 30-day funded and meaningful activation, with irrelevant nudges, inaccurate state, notification fatigue as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-06] How would you help someone switch from TD?
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which arrangements are hardest to move: payroll, billers, subscriptions or deposits?

**Customer problem / diagnostic hypothesis.** Switching has external dependencies and high perceived risk of missed payment.

**Option A.** Guided switch plan with account info, confirmation steps, overlap reminder.

**Option B.** Fully automated account switch service.

**Choose and justify.** Start with a transparent guided transition, including keeping old account active until changes work.

**Primary metric.** Verified payroll and recurring-bill migration completion.

**Guardrail.** Missed salary, returned PAD, false verification.

**Cross-team or technical dependency.** Money Movement, biller guidance, direct-deposit data.

**Worked spoken answer.**

"My first question would be: Which arrangements are hardest to move: payroll, billers, subscriptions or deposits? My working hypothesis is that switching has external dependencies and high perceived risk of missed payment.. I see two credible paths: guided switch plan with account info, confirmation steps, overlap reminder, or fully automated account switch service. Start with a transparent guided transition, including keeping old account active until changes work. This depends on Money Movement, biller guidance, direct-deposit data; I would validate the relevant data contract and ownership before committing to the experience. I would measure verified payroll and recurring-bill migration completion, with missed salary, returned PAD, false verification as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-07] Customers use the account only to receive investment withdrawals
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do they want a cash-out destination, or do they have unmet everyday-banking needs?

**Customer problem / diagnostic hypothesis.** Single-purpose usage is not necessarily failure if target segment differs.

**Option A.** Expose relevant daily use cases at withdrawal completion.

**Option B.** Force card activation or promote aggressive cross-sell.

**Choose and justify.** Test adjacent jobs with the segment and avoid interrupting successful cash-out journeys.

**Primary metric.** Opt-in repeat everyday payment activity.

**Guardrail.** Withdrawal friction, inappropriate prompts, conversion without retention.

**Cross-team or technical dependency.** Investments, account funding, CRM/experimentation.

**Worked spoken answer.**

"My first question would be: Do they want a cash-out destination, or do they have unmet everyday-banking needs? My working hypothesis is that single-purpose usage is not necessarily failure if target segment differs.. I see two credible paths: expose relevant daily use cases at withdrawal completion, or force card activation or promote aggressive cross-sell. Test adjacent jobs with the segment and avoid interrupting successful cash-out journeys. This depends on Investments, account funding, CRM/experimentation; I would validate the relevant data contract and ownership before committing to the experience. I would measure opt-in repeat everyday payment activity, with withdrawal friction, inappropriate prompts, conversion without retention as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-08] Would you prioritize new customers or deepen existing relationships?
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What are the relative economics, unmet need, and current bottleneck?

**Customer problem / diagnostic hypothesis.** Acquisition may be costly while existing investors offer lower switching trust, but assumptions need evidence.

**Option A.** Deepen existing investor adoption through integrated flows.

**Option B.** Acquire new-to-Questrade banking customers at scale.

**Choose and justify.** Choose the better risk-adjusted incremental value by cohort, with capacity and platform constraints explicit.

**Primary metric.** Incremental sustained primary-account customers per dollar invested.

**Guardrail.** CAC, churn, compliance, cannibalization.

**Cross-team or technical dependency.** Finance, growth analytics, investments and banking.

**Worked spoken answer.**

"My first question would be: What are the relative economics, unmet need, and current bottleneck? My working hypothesis is that acquisition may be costly while existing investors offer lower switching trust, but assumptions need evidence.. I see two credible paths: deepen existing investor adoption through integrated flows, or acquire new-to-Questrade banking customers at scale. Choose the better risk-adjusted incremental value by cohort, with capacity and platform constraints explicit. This depends on Finance, growth analytics, investments and banking; I would validate the relevant data contract and ownership before committing to the experience. I would measure incremental sustained primary-account customers per dollar invested, with cAC, churn, compliance, cannibalization as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-09] How would you improve retention without rewards?
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What causes customers to stop using the bank?

**Customer problem / diagnostic hypothesis.** Retention may be a utility or trust problem, not an incentive deficit.

**Option A.** Fix failed payments, status confusion and switching friction.

**Option B.** Add engagement badges and content experiences.

**Choose and justify.** Target the highest churn-correlated, causally supported core job failure.

**Primary metric.** Cohort retention with sustained banking activity.

**Guardrail.** Complaints, transfer failures, vanity engagement.

**Cross-team or technical dependency.** Customer research, operational incidents, analytics.

**Worked spoken answer.**

"My first question would be: What causes customers to stop using the bank? My working hypothesis is that retention may be a utility or trust problem, not an incentive deficit.. I see two credible paths: fix failed payments, status confusion and switching friction, or add engagement badges and content experiences. Target the highest churn-correlated, causally supported core job failure. This depends on Customer research, operational incidents, analytics; I would validate the relevant data contract and ownership before committing to the experience. I would measure cohort retention with sustained banking activity, with complaints, transfer failures, vanity engagement as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.2-10] How would you measure the value of a new bank account?
**Category:** 10.2 Activation and growth.  **Answer ID:** `Q10.2-10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Value to whom: customer, business, or both?

**Customer problem / diagnostic hypothesis.** Simple account counts obscure inactive relationships and servicing cost.

**Option A.** Define activation, sustained use, cash flows and unit economics.

**Option B.** Use account openings as a single north star.

**Choose and justify.** Use a balanced scorecard of meaningful usage, customer outcomes and financial contribution.

**Primary metric.** Sustained active funded accounts and contribution after costs.

**Guardrail.** Fraud loss, service cost, complaints and customer harm.

**Cross-team or technical dependency.** Finance, analytics, ledger, Cards and Money Movement.

**Worked spoken answer.**

"My first question would be: Value to whom: customer, business, or both? My working hypothesis is that simple account counts obscure inactive relationships and servicing cost.. I see two credible paths: define activation, sustained use, cash flows and unit economics, or use account openings as a single north star. Use a balanced scorecard of meaningful usage, customer outcomes and financial contribution. This depends on Finance, analytics, ledger, Cards and Money Movement; I would validate the relevant data contract and ownership before committing to the experience. I would measure sustained active funded accounts and contribution after costs, with fraud loss, service cost, complaints and customer harm as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.

## 10.3 Cards and payments product sense


### [Q10.3-01] A customer does not recognize a card purchase
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is it merchant descriptor confusion or potentially unauthorized spend?

**Customer problem / diagnostic hypothesis.** A friendly display alone must not suppress genuine fraud reporting.

**Option A.** Add reliable merchant enrichment and card/location context.

**Option B.** Create automatic dispute for every unrecognized descriptor.

**Choose and justify.** Provide context plus accessible report flow; choose guided triage instead of assuming either cause.

**Primary metric.** Correct identification and successful fraud escalation when needed.

**Guardrail.** Delayed fraud reports, false merchant mapping.

**Cross-team or technical dependency.** Cards processor, enrichment, fraud/disputes.

**Worked spoken answer.**

"My first question would be: Is it merchant descriptor confusion or potentially unauthorized spend? My working hypothesis is that a friendly display alone must not suppress genuine fraud reporting.. I see two credible paths: add reliable merchant enrichment and card/location context, or create automatic dispute for every unrecognized descriptor. Provide context plus accessible report flow; choose guided triage instead of assuming either cause. This depends on Cards processor, enrichment, fraud/disputes; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct identification and successful fraud escalation when needed, with delayed fraud reports, false merchant mapping as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-02] Design better payment confirmation
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** For which payment type, and what milestone can the bank prove?

**Customer problem / diagnostic hypothesis.** A green success screen can overstate what actually completed.

**Option A.** Show authoritative stage, reference, timing and next action.

**Option B.** Deep integrations for recipient-side confirmation.

**Choose and justify.** First define state semantics; ship truthful status and receipt before broader integrations.

**Primary metric.** Correct outcome comprehension and fewer unresolved contacts.

**Guardrail.** False completed labels and duplicate payment attempts.

**Cross-team or technical dependency.** Money Movement state and rail acknowledgments.

**Worked spoken answer.**

"My first question would be: For which payment type, and what milestone can the bank prove? My working hypothesis is that a green success screen can overstate what actually completed.. I see two credible paths: show authoritative stage, reference, timing and next action, or deep integrations for recipient-side confirmation. First define state semantics; ship truthful status and receipt before broader integrations. This depends on Money Movement state and rail acknowledgments; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct outcome comprehension and fewer unresolved contacts, with false completed labels and duplicate payment attempts as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-03] Customers send transfers twice
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is double sending due to user intent or uncertain results after timeout?

**Customer problem / diagnostic hypothesis.** Ambiguous feedback combined with unsafe retry creates financial harm.

**Option A.** Persistent transfer details and idempotent payment initiation.

**Option B.** Confirmation modal before every repeat transfer.

**Choose and justify.** Prioritize backend idempotency and clear outcome retrieval; a modal alone does not solve retries.

**Primary metric.** Unintended duplicate transfers per 10,000 requests.

**Guardrail.** Incorrect suppression of distinct intended payments.

**Cross-team or technical dependency.** Payment API idempotency store, ledger, retry flow.

**Worked spoken answer.**

"My first question would be: Is double sending due to user intent or uncertain results after timeout? My working hypothesis is that ambiguous feedback combined with unsafe retry creates financial harm.. I see two credible paths: persistent transfer details and idempotent payment initiation, or confirmation modal before every repeat transfer. Prioritize backend idempotency and clear outcome retrieval; a modal alone does not solve retries. This depends on Payment API idempotency store, ledger, retry flow; I would validate the relevant data contract and ownership before committing to the experience. I would measure unintended duplicate transfers per 10,000 requests, with incorrect suppression of distinct intended payments as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-04] A scheduled bill payment fails
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Did it fail before execution, at the rail, or as a later return?

**Customer problem / diagnostic hypothesis.** The safest next action depends on failure cause and timing.

**Option A.** Reason-specific status with safe retry or edit instructions.

**Option B.** Automatically retry every failed bill payment.

**Choose and justify.** Begin with accurate failure classification and explicit recoverable actions; automate only where safe and authorized.

**Primary metric.** Recovered eligible failed bills before due date.

**Guardrail.** Double payment, late fees, unauthorized retry.

**Cross-team or technical dependency.** Scheduler, bill-payment rail, exception operations.

**Worked spoken answer.**

"My first question would be: Did it fail before execution, at the rail, or as a later return? My working hypothesis is that the safest next action depends on failure cause and timing.. I see two credible paths: reason-specific status with safe retry or edit instructions, or automatically retry every failed bill payment. Begin with accurate failure classification and explicit recoverable actions; automate only where safe and authorized. This depends on Scheduler, bill-payment rail, exception operations; I would validate the relevant data contract and ownership before committing to the experience. I would measure recovered eligible failed bills before due date, with double payment, late fees, unauthorized retry as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-05] How would you improve payment status notifications?
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which milestones are reliable and worth interrupting the customer for?

**Customer problem / diagnostic hypothesis.** Noisy or contradictory alerts erode confidence.

**Option A.** Notify for completed, failed and action-required state changes.

**Option B.** Push notification for every intermediate event.

**Choose and justify.** Use an event and preference hierarchy; status lives in app even when a notification fails.

**Primary metric.** Timely useful notification action rate.

**Guardrail.** False alerts, duplicates, leaked transaction details.

**Cross-team or technical dependency.** Event bus, Money Movement, preference/notification service.

**Worked spoken answer.**

"My first question would be: Which milestones are reliable and worth interrupting the customer for? My working hypothesis is that noisy or contradictory alerts erode confidence.. I see two credible paths: notify for completed, failed and action-required state changes, or push notification for every intermediate event. Use an event and preference hierarchy; status lives in app even when a notification fails. This depends on Event bus, Money Movement, preference/notification service; I would validate the relevant data contract and ownership before committing to the experience. I would measure timely useful notification action rate, with false alerts, duplicates, leaked transaction details as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-06] How would you handle instant-payment expectations?
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which rail and participants truly support real-time completion?

**Customer problem / diagnostic hypothesis.** Instant acknowledgment is not proof of instant receipt.

**Option A.** Truthful real-time progress/status and arrival messaging.

**Option B.** Promise instant completion for all supported routes by default.

**Choose and justify.** Scope a specific supported use case, prove bank-side and recipient outcomes and expose fallbacks.

**Primary metric.** Completed intended instant payments within committed SLA.

**Guardrail.** Fraud, misrouted funds, false immediacy.

**Cross-team or technical dependency.** Payment rail coverage, Risk, core balance/ledger.

**Worked spoken answer.**

"My first question would be: Which rail and participants truly support real-time completion? My working hypothesis is that instant acknowledgment is not proof of instant receipt.. I see two credible paths: truthful real-time progress/status and arrival messaging, or promise instant completion for all supported routes by default. Scope a specific supported use case, prove bank-side and recipient outcomes and expose fallbacks. This depends on Payment rail coverage, Risk, core balance/ledger; I would validate the relevant data contract and ownership before committing to the experience. I would measure completed intended instant payments within committed SLA, with fraud, misrouted funds, false immediacy as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-07] What would you change if customers struggle with card controls?
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the problem locating controls or misunderstanding their effects?

**Customer problem / diagnostic hypothesis.** Freeze card and freeze account have different consequences.

**Option A.** Make card status, action scope and reversibility explicit.

**Option B.** Launch a broad configurable spend-rule engine.

**Choose and justify.** Start with discoverable freeze/unfreeze and explanatory feedback before complex controls.

**Primary metric.** Successful intended card-control task completion.

**Guardrail.** Unauthorized usage, mistakenly blocked essential payments.

**Cross-team or technical dependency.** Cards authorization system, identity, security.

**Worked spoken answer.**

"My first question would be: Is the problem locating controls or misunderstanding their effects? My working hypothesis is that freeze card and freeze account have different consequences.. I see two credible paths: make card status, action scope and reversibility explicit, or launch a broad configurable spend-rule engine. Start with discoverable freeze/unfreeze and explanatory feedback before complex controls. This depends on Cards authorization system, identity, security; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful intended card-control task completion, with unauthorized usage, mistakenly blocked essential payments as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-08] Customers are not using their newly activated card
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the barrier provisioning, acceptance, habit or value?

**Customer problem / diagnostic hypothesis.** Activation is not proof of first successful spend.

**Option A.** Troubleshoot wallet provisioning and first payment.

**Option B.** Introduce promotional cashback immediately.

**Choose and justify.** Diagnose first decline or first-use friction before incentives.

**Primary metric.** First successful purchase within 30 days.

**Guardrail.** Authorization declines, fraud and support contacts.

**Cross-team or technical dependency.** Cards provisioning, authorization logs, wallet integrations.

**Worked spoken answer.**

"My first question would be: Is the barrier provisioning, acceptance, habit or value? My working hypothesis is that activation is not proof of first successful spend.. I see two credible paths: troubleshoot wallet provisioning and first payment, or introduce promotional cashback immediately. Diagnose first decline or first-use friction before incentives. This depends on Cards provisioning, authorization logs, wallet integrations; I would validate the relevant data contract and ownership before committing to the experience. I would measure first successful purchase within 30 days, with authorization declines, fraud and support contacts as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-09] How would you reduce disputes?
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are disputes genuine fraud, processing mistakes, or recognition issues?

**Customer problem / diagnostic hypothesis.** Dispute volume contains problems with very different severity.

**Option A.** Merchant enrichment and clearer pending/posted detail for avoidable confusion.

**Option B.** Add friction to the dispute submission workflow.

**Choose and justify.** Remove preventable confusion while retaining easy access for genuine disputes.

**Primary metric.** Avoidable dispute reduction without worse legitimate fraud resolution.

**Guardrail.** Missed fraud, chargeback rights, customer harm.

**Cross-team or technical dependency.** Cards operations, fraud, merchant data, customer research.

**Worked spoken answer.**

"My first question would be: Are disputes genuine fraud, processing mistakes, or recognition issues? My working hypothesis is that dispute volume contains problems with very different severity.. I see two credible paths: merchant enrichment and clearer pending/posted detail for avoidable confusion, or add friction to the dispute submission workflow. Remove preventable confusion while retaining easy access for genuine disputes. This depends on Cards operations, fraud, merchant data, customer research; I would validate the relevant data contract and ownership before committing to the experience. I would measure avoidable dispute reduction without worse legitimate fraud resolution, with missed fraud, chargeback rights, customer harm as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.3-10] How would you improve transfers to family members?
**Category:** 10.3 Cards and payments product sense.  **Answer ID:** `Q10.3-10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are transfers frequent, urgent, large, or to new recipients?

**Customer problem / diagnostic hypothesis.** Ease of sending can increase mistaken-recipient or impersonation risk.

**Option A.** Trusted recipient management, clear review and status.

**Option B.** One-tap transfer with minimal confirmation for everyone.

**Choose and justify.** Improve repeat journeys while applying proportionate confirmation and anti-fraud controls.

**Primary metric.** Successful intended family transfers and repeat-use ease.

**Guardrail.** Recipient error, scams, unauthorized transfers.

**Cross-team or technical dependency.** Money Movement, payee verification, Risk.

**Worked spoken answer.**

"My first question would be: Are transfers frequent, urgent, large, or to new recipients? My working hypothesis is that ease of sending can increase mistaken-recipient or impersonation risk.. I see two credible paths: trusted recipient management, clear review and status, or one-tap transfer with minimal confirmation for everyone. Improve repeat journeys while applying proportionate confirmation and anti-fraud controls. This depends on Money Movement, payee verification, Risk; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful intended family transfers and repeat-use ease, with recipient error, scams, unauthorized transfers as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.

## 10.4 Investments and savings product sense


### [Q10.4-01] How would you move customers from saving to investing?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are they seeking education, funding ease, or a suitable investment path?

**Customer problem / diagnostic hypothesis.** Not all available cash is suitable for investment and account eligibility differs.

**Option A.** Educational journey and straightforward eligible account funding.

**Option B.** Automatic investment of idle cash.

**Choose and justify.** Start with customer-controlled discovery and clear liquidity context, not forced conversion.

**Primary metric.** Appropriate eligible investment funding and sustained use.

**Guardrail.** Missed bills, unsuitable prompts, registered-account errors.

**Cross-team or technical dependency.** Investments, banking ledger, risk/compliance, consent.

**Worked spoken answer.**

"My first question would be: Are they seeking education, funding ease, or a suitable investment path? My working hypothesis is that not all available cash is suitable for investment and account eligibility differs.. I see two credible paths: educational journey and straightforward eligible account funding, or automatic investment of idle cash. Start with customer-controlled discovery and clear liquidity context, not forced conversion. This depends on Investments, banking ledger, risk/compliance, consent; I would validate the relevant data contract and ownership before committing to the experience. I would measure appropriate eligible investment funding and sustained use, with missed bills, unsuitable prompts, registered-account errors as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-02] Would you build savings round-ups?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What problem is round-ups solving: forgetting, insufficient motivation, or inconsistent income?

**Customer problem / diagnostic hypothesis.** Tiny automated contributions may offer convenience but can add processing complexity.

**Option A.** Opt-in round-up rules with threshold and clear settlement.

**Option B.** Scheduled fixed-amount savings transfer.

**Choose and justify.** Compare evidence and economics; start with simpler recurring transfer unless round-ups show distinct demand.

**Primary metric.** Sustained net savings among eligible users.

**Guardrail.** Unintended transfers, overdrafts/NSF and transaction cost.

**Cross-team or technical dependency.** Cards transaction lifecycle, Money Movement, savings account.

**Worked spoken answer.**

"My first question would be: What problem is round-ups solving: forgetting, insufficient motivation, or inconsistent income? My working hypothesis is that tiny automated contributions may offer convenience but can add processing complexity.. I see two credible paths: opt-in round-up rules with threshold and clear settlement, or scheduled fixed-amount savings transfer. Compare evidence and economics; start with simpler recurring transfer unless round-ups show distinct demand. This depends on Cards transaction lifecycle, Money Movement, savings account; I would validate the relevant data contract and ownership before committing to the experience. I would measure sustained net savings among eligible users, with unintended transfers, overdrafts/NSF and transaction cost as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-03] How would you design automated savings?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What limits and liquidity needs should the customer be able to set?

**Customer problem / diagnostic hypothesis.** Automation can create shortfalls when income and obligations change.

**Option A.** Customer-set recurring amount, threshold, pause and skip controls.

**Option B.** Adaptive AI sweep from predicted surplus cash.

**Choose and justify.** Start with explainable opt-in rules; introduce prediction after accuracy is proven.

**Primary metric.** Sustained successful net transfers to savings.

**Guardrail.** Insufficient funds, missed bills, unauthorized execution.

**Cross-team or technical dependency.** Scheduler, available balance checks, Money Movement.

**Worked spoken answer.**

"My first question would be: What limits and liquidity needs should the customer be able to set? My working hypothesis is that automation can create shortfalls when income and obligations change.. I see two credible paths: customer-set recurring amount, threshold, pause and skip controls, or adaptive AI sweep from predicted surplus cash. Start with explainable opt-in rules; introduce prediction after accuracy is proven. This depends on Scheduler, available balance checks, Money Movement; I would validate the relevant data contract and ownership before committing to the experience. I would measure sustained successful net transfers to savings, with insufficient funds, missed bills, unauthorized execution as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-04] Customers want to invest their leftover paycheque
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do we know their upcoming obligations and what is truly surplus?

**Customer problem / diagnostic hypothesis.** A deposit event does not establish disposable income.

**Option A.** Show payday allocation context and optional transfer.

**Option B.** Automatically transfer an estimated surplus to TFSA.

**Choose and justify.** Start with informed customer choice and known obligations; automation is later-stage.

**Primary metric.** Completed customer-intended investments after obligations.

**Guardrail.** Rent shortfalls, unsuitable product prompts, contribution limits.

**Cross-team or technical dependency.** Core account state, recurring obligations, Investments.

**Worked spoken answer.**

"My first question would be: Do we know their upcoming obligations and what is truly surplus? My working hypothesis is that a deposit event does not establish disposable income.. I see two credible paths: show payday allocation context and optional transfer, or automatically transfer an estimated surplus to TFSA. Start with informed customer choice and known obligations; automation is later-stage. This depends on Core account state, recurring obligations, Investments; I would validate the relevant data contract and ownership before committing to the experience. I would measure completed customer-intended investments after obligations, with rent shortfalls, unsuitable product prompts, contribution limits as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-05] How would you show a customer’s total financial position?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do they need net worth, immediately available cash, or investment holdings?

**Customer problem / diagnostic hypothesis.** Aggregating numbers with different liquidity and valuation semantics can mislead.

**Option A.** Segmented unified view: spendable cash, savings, investment market value.

**Option B.** One composite headline number with no explanation.

**Choose and justify.** Build trustworthy labeled components and freshness before one broad total.

**Primary metric.** Correct task-based comprehension of cross-product position.

**Guardrail.** Stale valuations, double counting, entitlement errors.

**Cross-team or technical dependency.** Investments holdings, banking ledger, account permissions.

**Worked spoken answer.**

"My first question would be: Do they need net worth, immediately available cash, or investment holdings? My working hypothesis is that aggregating numbers with different liquidity and valuation semantics can mislead.. I see two credible paths: segmented unified view: spendable cash, savings, investment market value, or one composite headline number with no explanation. Build trustworthy labeled components and freshness before one broad total. This depends on Investments holdings, banking ledger, account permissions; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct task-based comprehension of cross-product position, with stale valuations, double counting, entitlement errors as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-06] Customers are confused by funding delays
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which step is delayed: debit, settlement, brokerage posting, or purchasing power?

**Customer problem / diagnostic hypothesis.** Bank-side transferred status differs from availability to trade.

**Option A.** Cross-product timeline with separate bank and investment milestones.

**Option B.** Make all transfers immediately tradeable.

**Choose and justify.** Provide truthful visibility and investigate actual delay separately.

**Primary metric.** Correct status comprehension and fewer ambiguous funding inquiries.

**Guardrail.** False available-to-trade claims, mismatched balances.

**Cross-team or technical dependency.** Money Movement, brokerage back office, core ledger.

**Worked spoken answer.**

"My first question would be: Which step is delayed: debit, settlement, brokerage posting, or purchasing power? My working hypothesis is that bank-side transferred status differs from availability to trade.. I see two credible paths: cross-product timeline with separate bank and investment milestones, or make all transfers immediately tradeable. Provide truthful visibility and investigate actual delay separately. This depends on Money Movement, brokerage back office, core ledger; I would validate the relevant data contract and ownership before committing to the experience. I would measure correct status comprehension and fewer ambiguous funding inquiries, with false available-to-trade claims, mismatched balances as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-07] How would you design savings goals?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the primary need motivation, a target, or safe automation?

**Customer problem / diagnostic hypothesis.** Goals only help if progress is interpretable and funds remain accessible.

**Option A.** User-created goal with amount, time horizon and optional transfer.

**Option B.** Complex AI-generated financial plan and investment recommendations.

**Choose and justify.** Start with clear target/progress and optional funding action.

**Primary metric.** Active funded goals and sustained goal progress.

**Guardrail.** Misleading projections and money availability confusion.

**Cross-team or technical dependency.** Accounts, savings product, notifications.

**Worked spoken answer.**

"My first question would be: Is the primary need motivation, a target, or safe automation? My working hypothesis is that goals only help if progress is interpretable and funds remain accessible.. I see two credible paths: user-created goal with amount, time horizon and optional transfer, or complex AI-generated financial plan and investment recommendations. Start with clear target/progress and optional funding action. This depends on Accounts, savings product, notifications; I would validate the relevant data contract and ownership before committing to the experience. I would measure active funded goals and sustained goal progress, with misleading projections and money availability confusion as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-08] How would you support customers with irregular income?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** How variable are deposits and which obligations are non-negotiable?

**Customer problem / diagnostic hypothesis.** Fixed-payday automations can fail when deposits are unpredictable.

**Option A.** Flexible threshold rules, pause/skip and explicit transfer confirmation.

**Option B.** Aggressive predictive surplus auto-sweeps.

**Choose and justify.** Prioritize customer control and transparent cash buffer before predictive models.

**Primary metric.** Successful sustained saving without shortfalls.

**Guardrail.** NSF, overdraft, harmful automatic debits.

**Cross-team or technical dependency.** Income events, ledger, scheduler, Risk.

**Worked spoken answer.**

"My first question would be: How variable are deposits and which obligations are non-negotiable? My working hypothesis is that fixed-payday automations can fail when deposits are unpredictable.. I see two credible paths: flexible threshold rules, pause/skip and explicit transfer confirmation, or aggressive predictive surplus auto-sweeps. Prioritize customer control and transparent cash buffer before predictive models. This depends on Income events, ledger, scheduler, Risk; I would validate the relevant data contract and ownership before committing to the experience. I would measure successful sustained saving without shortfalls, with nSF, overdraft, harmful automatic debits as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-09] How would you encourage responsible financial habits?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which specific customer habit and outcome are we targeting?

**Customer problem / diagnostic hypothesis.** Engagement nudges can be manipulative or financially harmful.

**Option A.** Known-obligation awareness and voluntary goal progress.

**Option B.** Gamified financial scores and aggressive prompts.

**Choose and justify.** Use explainable, opt-in assistance tied to customer-defined goals.

**Primary metric.** Customer-completed positive financial tasks over time.

**Guardrail.** Alert fatigue, unsuitable recommendations, privacy.

**Cross-team or technical dependency.** Transaction data, consent, financial education.

**Worked spoken answer.**

"My first question would be: Which specific customer habit and outcome are we targeting? My working hypothesis is that engagement nudges can be manipulative or financially harmful.. I see two credible paths: known-obligation awareness and voluntary goal progress, or gamified financial scores and aggressive prompts. Use explainable, opt-in assistance tied to customer-defined goals. This depends on Transaction data, consent, financial education; I would validate the relevant data contract and ownership before committing to the experience. I would measure customer-completed positive financial tasks over time, with alert fatigue, unsuitable recommendations, privacy as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.4-10] What if savings automation increases failed payments?
**Category:** 10.4 Investments and savings product sense.  **Answer ID:** `Q10.4-10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are failures caused by transfer timing, stale balances, or insufficient buffer?

**Customer problem / diagnostic hypothesis.** The automation may be harming a more important customer obligation.

**Option A.** Pause problematic rules, analyze cohorts, add buffer and pre-transfer checks.

**Option B.** Increase reminders without changing transfer logic.

**Choose and justify.** Mitigate customer harm first and adjust eligibility and schedule rules before re-expansion.

**Primary metric.** Failed-payment reduction and successful safe savings.

**Guardrail.** Any repeat missed obligation, unauthorized sweep.

**Cross-team or technical dependency.** Money Movement scheduler, balances, incident response.

**Worked spoken answer.**

"My first question would be: Are failures caused by transfer timing, stale balances, or insufficient buffer? My working hypothesis is that the automation may be harming a more important customer obligation.. I see two credible paths: pause problematic rules, analyze cohorts, add buffer and pre-transfer checks, or increase reminders without changing transfer logic. Mitigate customer harm first and adjust eligibility and schedule rules before re-expansion. This depends on Money Movement scheduler, balances, incident response; I would validate the relevant data contract and ownership before committing to the experience. I would measure failed-payment reduction and successful safe savings, with any repeat missed obligation, unauthorized sweep as the main guardrails. Then I would test with the relevant customer cohort or a safe staged rollout to verify that the change solves the underlying job, not just increases interaction."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.

## 10.5 Diagnostic scenarios


### [Q10.5-01] Payment support contacts increased 30%
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the increase absolute or per eligible payment, and when did it begin?

**Customer problem / diagnostic hypothesis.** Check instrumentation first, then decompose contacts by rail, state, cohort, reason and recent changes.

**Option A.** Status communication regression or missing callbacks.

**Option B.** Underlying payment delays and failures.

**Choose and justify.** Identify which part of the journey changed before choosing copy, infrastructure repair or incident mitigation.

**Primary metric.** Payment-status contacts per 1,000 eligible payments and completed payment rate.

**Guardrail.** Duplicate debits, missed payments, unhandled escalations.

**Cross-team or technical dependency.** Support taxonomy, Money Movement operational logs, release calendar.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Is the increase absolute or per eligible payment, and when did it begin? Then I would break down the problem rather than jump to a feature fix. Check instrumentation first, then decompose contacts by rail, state, cohort, reason and recent changes. Two explanations I would pressure-test are status communication regression or missing callbacks versus underlying payment delays and failures. Identify which part of the journey changed before choosing copy, infrastructure repair or incident mitigation. I would use evidence from Support taxonomy, Money Movement operational logs, release calendar to align customer-facing and operational findings. I would track payment-status contacts per 1,000 eligible payments and completed payment rate, and treat duplicate debits, missed payments, unhandled escalations as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-02] Available-balance complaints doubled
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are more customers affected or are a few heavy users contacting repeatedly?

**Customer problem / diagnostic hypothesis.** Verify balance correctness and analyze account types, hold sources, payment events and deployment time.

**Option A.** Correct holds are now more frequent but unexplained.

**Option B.** Availability calculation or data synchronization broke.

**Choose and justify.** Treat an actual financial correctness issue as an incident; use UX explanation only after values are verified.

**Primary metric.** Confirmed balance accuracy and complaint rate per active account.

**Guardrail.** Incorrect spendable amount, unauthorized declines or overspending.

**Cross-team or technical dependency.** Core banking, Cards holds, account services, incident team.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Are more customers affected or are a few heavy users contacting repeatedly? Then I would break down the problem rather than jump to a feature fix. Verify balance correctness and analyze account types, hold sources, payment events and deployment time. Two explanations I would pressure-test are correct holds are now more frequent but unexplained versus availability calculation or data synchronization broke. Treat an actual financial correctness issue as an incident; use UX explanation only after values are verified. I would use evidence from Core banking, Cards holds, account services, incident team to align customer-facing and operational findings. I would track confirmed balance accuracy and complaint rate per active account, and treat incorrect spendable amount, unauthorized declines or overspending as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-03] Successful transfers dropped after a release
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Did completion genuinely fall or did completion events stop being recorded?

**Customer problem / diagnostic hypothesis.** Trace the funnel from initiation to validation, risk, rail submission, confirmation and reconciliation by cohort.

**Option A.** Frontend/API regression in new release.

**Option B.** External rail or risk-rule failure.

**Choose and justify.** Protect in-flight payment integrity, pause or roll back implicated paths safely and reconcile unknown outcomes.

**Primary metric.** Distinct intended transfer completion rate by stage.

**Guardrail.** Duplicate payments, unposted transfers, reconciliation breaks.

**Cross-team or technical dependency.** Money Movement, SRE, Risk, rail provider, reconciliation.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Did completion genuinely fall or did completion events stop being recorded? Then I would break down the problem rather than jump to a feature fix. Trace the funnel from initiation to validation, risk, rail submission, confirmation and reconciliation by cohort. Two explanations I would pressure-test are frontend/API regression in new release versus external rail or risk-rule failure. Protect in-flight payment integrity, pause or roll back implicated paths safely and reconcile unknown outcomes. I would use evidence from Money Movement, SRE, Risk, rail provider, reconciliation to align customer-facing and operational findings. I would track distinct intended transfer completion rate by stage, and treat duplicate payments, unposted transfers, reconciliation breaks as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-04] Customers stopped using transaction search
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is traffic down, task success down, or search no longer discoverable?

**Customer problem / diagnostic hypothesis.** Compare before/after usage and task completion by platform, screen, cohort and query.

**Option A.** Discoverability regression from UI change.

**Option B.** Results/index relevance or latency degradation.

**Choose and justify.** Inspect search task performance and customer intent before moving button positions or rebuilding search.

**Primary metric.** Successful transaction-finding task rate.

**Guardrail.** Wrong or missing results, fraud-report discoverability.

**Cross-team or technical dependency.** Accounts UX, search service, analytics instrumentation.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Is traffic down, task success down, or search no longer discoverable? Then I would break down the problem rather than jump to a feature fix. Compare before/after usage and task completion by platform, screen, cohort and query. Two explanations I would pressure-test are discoverability regression from UI change versus results/index relevance or latency degradation. Inspect search task performance and customer intent before moving button positions or rebuilding search. I would use evidence from Accounts UX, search service, analytics instrumentation to align customer-facing and operational findings. I would track successful transaction-finding task rate, and treat wrong or missing results, fraud-report discoverability as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-05] Card spending dropped despite stable active customers
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the decline in transaction attempts, authorization success or average amount?

**Customer problem / diagnostic hypothesis.** Segment by card status, merchant, channel, device, funding balance and declines.

**Option A.** Payment acceptance/auth decline incident.

**Option B.** Change in customer behavior or merchant mix.

**Choose and justify.** First exclude processing/reliability failure; then diagnose value and usage changes.

**Primary metric.** Approved customer-intended spend and active card use.

**Guardrail.** Fraud, false declines, financial harm.

**Cross-team or technical dependency.** Cards authorization, Risk, ledger, analytics.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Is the decline in transaction attempts, authorization success or average amount? Then I would break down the problem rather than jump to a feature fix. Segment by card status, merchant, channel, device, funding balance and declines. Two explanations I would pressure-test are payment acceptance/auth decline incident versus change in customer behavior or merchant mix. First exclude processing/reliability failure; then diagnose value and usage changes. I would use evidence from Cards authorization, Risk, ledger, analytics to align customer-facing and operational findings. I would track approved customer-intended spend and active card use, and treat fraud, false declines, financial harm as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-06] Recurring deposits declined
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Did eligible customer count fall, or did payroll credits fail?

**Customer problem / diagnostic hypothesis.** Check seasonality, source descriptors, returns, account restrictions, cohort churn and processing timing.

**Option A.** Operational inbound-payment disruption.

**Option B.** Customers intentionally moving payroll elsewhere.

**Choose and justify.** Contain actual funding failures first; investigate primary-bank value if processing remains healthy.

**Primary metric.** Sustained recurring inbound deposits by cohort.

**Guardrail.** Misdirected wages, failed deposits, account restrictions.

**Cross-team or technical dependency.** Money Movement inbound flows, core banking, support.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Did eligible customer count fall, or did payroll credits fail? Then I would break down the problem rather than jump to a feature fix. Check seasonality, source descriptors, returns, account restrictions, cohort churn and processing timing. Two explanations I would pressure-test are operational inbound-payment disruption versus customers intentionally moving payroll elsewhere. Contain actual funding failures first; investigate primary-bank value if processing remains healthy. I would use evidence from Money Movement inbound flows, core banking, support to align customer-facing and operational findings. I would track sustained recurring inbound deposits by cohort, and treat misdirected wages, failed deposits, account restrictions as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-07] Investment transfers increased but banking retention fell
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Did the same customers transfer out and stop using banking, or are cohorts different?

**Customer problem / diagnostic hypothesis.** Segment users by net flow, banking tasks, withdrawals, balances and reasons for leaving.

**Option A.** Banking acting only as brokerage cash conduit.

**Option B.** Banking reliability/utility worsened after integration.

**Choose and justify.** Use cohort evidence to decide whether to deepen banking utility or fix a harmful funding journey.

**Primary metric.** Sustained multi-product activity and customer retention.

**Guardrail.** Withdrawal blockage, investment liquidity confusion.

**Cross-team or technical dependency.** Investments, Accounts, Money Movement, finance analytics.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Did the same customers transfer out and stop using banking, or are cohorts different? Then I would break down the problem rather than jump to a feature fix. Segment users by net flow, banking tasks, withdrawals, balances and reasons for leaving. Two explanations I would pressure-test are banking acting only as brokerage cash conduit versus banking reliability/utility worsened after integration. Use cohort evidence to decide whether to deepen banking utility or fix a harmful funding journey. I would use evidence from Investments, Accounts, Money Movement, finance analytics to align customer-facing and operational findings. I would track sustained multi-product activity and customer retention, and treat withdrawal blockage, investment liquidity confusion as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-08] Customers open the app more often but satisfaction falls
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are sessions repetitive because customers cannot complete tasks?

**Customer problem / diagnostic hypothesis.** Inspect task completion, repeated searches, payment-status visits, errors and support context.

**Option A.** More active healthy monitoring.

**Option B.** Confusion and repeated unresolved checking.

**Choose and justify.** Prioritize the specific unresolved job, not increasing or decreasing sessions indiscriminately.

**Primary metric.** Successful task completion and confidence alongside satisfaction.

**Guardrail.** Hidden incidents, missed payments, privacy.

**Cross-team or technical dependency.** Event analytics, customer research, support taxonomy.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Are sessions repetitive because customers cannot complete tasks? Then I would break down the problem rather than jump to a feature fix. Inspect task completion, repeated searches, payment-status visits, errors and support context. Two explanations I would pressure-test are more active healthy monitoring versus confusion and repeated unresolved checking. Prioritize the specific unresolved job, not increasing or decreasing sessions indiscriminately. I would use evidence from Event analytics, customer research, support taxonomy to align customer-facing and operational findings. I would track successful task completion and confidence alongside satisfaction, and treat hidden incidents, missed payments, privacy as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-09] Account activation is weak despite high acquisition
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which activation milestone fails after opening?

**Customer problem / diagnostic hypothesis.** Break down by source cohort, KYC, first funding, first spend, payroll and returning usage.

**Option A.** Funding/first-use friction.

**Option B.** Low product value or mis-targeted acquisition.

**Choose and justify.** Target the greatest verified drop-off with the smallest credible intervention; do not equate opening to value.

**Primary metric.** 30-day funded meaningful activation by cohort.

**Guardrail.** Promotional gaming, fraud, returned funding.

**Cross-team or technical dependency.** Growth, onboarding, Money Movement, Cards.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Which activation milestone fails after opening? Then I would break down the problem rather than jump to a feature fix. Break down by source cohort, KYC, first funding, first spend, payroll and returning usage. Two explanations I would pressure-test are funding/first-use friction versus low product value or mis-targeted acquisition. Target the greatest verified drop-off with the smallest credible intervention; do not equate opening to value. I would use evidence from Growth, onboarding, Money Movement, Cards to align customer-facing and operational findings. I would track 30-day funded meaningful activation by cohort, and treat promotional gaming, fraud, returned funding as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.5-10] An insight feature has many impressions but little action
**Category:** 10.5 Diagnostic scenarios.  **Answer ID:** `Q10.5-10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the insight relevant, understood, trusted or actionable?

**Customer problem / diagnostic hypothesis.** Segment impression-to-comprehension-to-action; examine false positives and timing.

**Option A.** Irrelevant/untrusted insight content.

**Option B.** High-friction destination action.

**Choose and justify.** Test a narrower high-confidence actionable insight and simplify the action path.

**Primary metric.** Verified useful downstream action rate.

**Guardrail.** Misleading insights, notification fatigue, inappropriate advice.

**Cross-team or technical dependency.** Analytics, enrichment, experimentation, compliance.

**Worked spoken answer.**

"I would begin by checking the measurement and scope: Is the insight relevant, understood, trusted or actionable? Then I would break down the problem rather than jump to a feature fix. Segment impression-to-comprehension-to-action; examine false positives and timing. Two explanations I would pressure-test are irrelevant/untrusted insight content versus high-friction destination action. Test a narrower high-confidence actionable insight and simplify the action path. I would use evidence from Analytics, enrichment, experimentation, compliance to align customer-facing and operational findings. I would track verified useful downstream action rate, and treat misleading insights, notification fatigue, inappropriate advice as a non-negotiable safety check. Finally, I would verify recovery by segment and look for any new harm, not just a rebound in the headline number."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.

## 10.6 System-design and technical scenarios


### [Q10.6-01] Design transaction history for high traffic
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** How many users, transaction events, years of history and freshness SLA?

**Customer problem / diagnostic hypothesis.** Keep authoritative postings separate from a scalable query projection; define status and access semantics.

**Option A.** Read-optimized paginated transaction service with indexed search.

**Option B.** Query ledger directly for every history screen.

**Choose and justify.** Choose an asynchronously updated read model with defined freshness and direct authoritative checks for consequential actions.

**Primary metric.** P95 history load time, search success, projection lag.

**Guardrail.** Missing/duplicated entries, cross-account exposure, inconsistent final states.

**Cross-team or technical dependency.** Core ledger, Cards, Money Movement, index, event pipeline.

**Worked spoken answer.**

"First I would scope the requirements: How many users, transaction events, years of history and freshness SLA? Keep authoritative postings separate from a scalable query projection; define status and access semantics. I see two technical approaches: read-optimized paginated transaction service with indexed search, or query ledger directly for every history screen. Choose an asynchronously updated read model with defined freshness and direct authoritative checks for consequential actions. I would establish the ownership and failure semantics across Core ledger, Cards, Money Movement, index, event pipeline. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are p95 history load time, search success, projection lag, with missing/duplicated entries, cross-account exposure, inconsistent final states as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-02] Design an account balance service
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What decisions require the balance, and what is allowable latency?

**Customer problem / diagnostic hypothesis.** Available balance must reflect authoritative ledger and reservation rules, not an app-side subtraction.

**Option A.** Authoritative balance/availability API with controlled caching for display.

**Option B.** Compute balance from visible transactions in the frontend.

**Choose and justify.** Use system-owned balance semantics; degrade read-only views explicitly and protect payment authorization from stale values.

**Primary metric.** Correct balance responses and authorized request latency.

**Guardrail.** Overspending, wrong available balances, entitlement violation.

**Cross-team or technical dependency.** Core banking, reservations, fraud controls, operations.

**Worked spoken answer.**

"First I would scope the requirements: What decisions require the balance, and what is allowable latency? Available balance must reflect authoritative ledger and reservation rules, not an app-side subtraction. I see two technical approaches: authoritative balance/availability API with controlled caching for display, or compute balance from visible transactions in the frontend. Use system-owned balance semantics; degrade read-only views explicitly and protect payment authorization from stale values. I would establish the ownership and failure semantics across Core banking, reservations, fraud controls, operations. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are correct balance responses and authorized request latency, with overspending, wrong available balances, entitlement violation as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-03] Design payment status tracking
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which rails, lifecycle milestones and customer-visible claims are in scope?

**Customer problem / diagnostic hypothesis.** An event projection needs stable IDs, state semantics and robust handling for duplicate and delayed messages.

**Option A.** Payment service publishes versioned events to normalized status projection.

**Option B.** Poll every upstream system on every screen view.

**Choose and justify.** Use reliable event-driven projection plus authoritative status lookup when needed; avoid fabricated completion.

**Primary metric.** Timely correct status projection and customer comprehension.

**Guardrail.** State regression, false completion, missing reversal.

**Cross-team or technical dependency.** Money Movement, event bus, state store, reconciliation.

**Worked spoken answer.**

"First I would scope the requirements: Which rails, lifecycle milestones and customer-visible claims are in scope? An event projection needs stable IDs, state semantics and robust handling for duplicate and delayed messages. I see two technical approaches: payment service publishes versioned events to normalized status projection, or poll every upstream system on every screen view. Use reliable event-driven projection plus authoritative status lookup when needed; avoid fabricated completion. I would establish the ownership and failure semantics across Money Movement, event bus, state store, reconciliation. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are timely correct status projection and customer comprehension, with state regression, false completion, missing reversal as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-04] Design recurring bill detection
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are billers and due dates explicitly known or inferred from historical charges?

**Customer problem / diagnostic hypothesis.** Merchant normalization and periodicity detection produce imperfect predictions.

**Option A.** Rule/heuristic-based detection with confidence and customer confirmation.

**Option B.** Autonomous payment calendar inferred entirely by ML.

**Choose and justify.** Start with explainable detection and correction, separating known schedules from predictions.

**Primary metric.** Precision of confirmed recurring bills and useful actions.

**Guardrail.** False due dates, omitted actual bills, privacy.

**Cross-team or technical dependency.** Transaction enrichment, recurrence analytics, bill-payment service.

**Worked spoken answer.**

"First I would scope the requirements: Are billers and due dates explicitly known or inferred from historical charges? Merchant normalization and periodicity detection produce imperfect predictions. I see two technical approaches: rule/heuristic-based detection with confidence and customer confirmation, or autonomous payment calendar inferred entirely by ML. Start with explainable detection and correction, separating known schedules from predictions. I would establish the ownership and failure semantics across Transaction enrichment, recurrence analytics, bill-payment service. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are precision of confirmed recurring bills and useful actions, with false due dates, omitted actual bills, privacy as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-05] Design a notification service
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which events are mandatory, actionable or optional?

**Customer problem / diagnostic hypothesis.** Delivery is best-effort and should not determine financial truth.

**Option A.** Durable event-driven alerts with dedupe, preference checks and retry.

**Option B.** Fire synchronous push messages from payment transaction path.

**Choose and justify.** Decouple delivery from payment commit; prioritize critical alerts with audit and fallback.

**Primary metric.** Timely verified delivery of applicable critical alerts.

**Guardrail.** Duplicate/leaked notifications, missed mandatory messages.

**Cross-team or technical dependency.** Event bus, consent, device tokens, delivery providers.

**Worked spoken answer.**

"First I would scope the requirements: Which events are mandatory, actionable or optional? Delivery is best-effort and should not determine financial truth. I see two technical approaches: durable event-driven alerts with dedupe, preference checks and retry, or fire synchronous push messages from payment transaction path. Decouple delivery from payment commit; prioritize critical alerts with audit and fallback. I would establish the ownership and failure semantics across Event bus, consent, device tokens, delivery providers. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are timely verified delivery of applicable critical alerts, with duplicate/leaked notifications, missed mandatory messages as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-06] Design an internal account transfer
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Do both accounts share one ledger and currency, and who owns them?

**Customer problem / diagnostic hypothesis.** Ledger integrity requires permitted debits and credits together.

**Option A.** Atomic double-entry ledger posting with idempotent request.

**Option B.** Independent debit API then credit API without coordination.

**Choose and justify.** Use atomic authorized ledger operation if within one core; distinguish external transfer semantics otherwise.

**Primary metric.** Correct completed transfers with balanced ledger entries.

**Guardrail.** Partial posting, replay, insufficient-funds bypass.

**Cross-team or technical dependency.** Core ledger, Accounts entitlements, Risk, audit.

**Worked spoken answer.**

"First I would scope the requirements: Do both accounts share one ledger and currency, and who owns them? Ledger integrity requires permitted debits and credits together. I see two technical approaches: atomic double-entry ledger posting with idempotent request, or independent debit API then credit API without coordination. Use atomic authorized ledger operation if within one core; distinguish external transfer semantics otherwise. I would establish the ownership and failure semantics across Core ledger, Accounts entitlements, Risk, audit. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are correct completed transfers with balanced ledger entries, with partial posting, replay, insufficient-funds bypass as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-07] Design safe payment retries
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Can the original request have succeeded despite timeout?

**Customer problem / diagnostic hypothesis.** Unknown outcomes create duplicate risk.

**Option A.** Stable idempotency key, durable outcome lookup, bounded backoff.

**Option B.** Retry with a new payment identifier after every timeout.

**Choose and justify.** Never infer failure from timeout; query status and retry only under an idempotent contract.

**Primary metric.** Distinct intended operations completed without duplication.

**Guardrail.** Duplicate debit, stuck requests, key collisions.

**Cross-team or technical dependency.** Payments orchestration, idempotency store, observability.

**Worked spoken answer.**

"First I would scope the requirements: Can the original request have succeeded despite timeout? Unknown outcomes create duplicate risk. I see two technical approaches: stable idempotency key, durable outcome lookup, bounded backoff, or retry with a new payment identifier after every timeout. Never infer failure from timeout; query status and retry only under an idempotent contract. I would establish the ownership and failure semantics across Payments orchestration, idempotency store, observability. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are distinct intended operations completed without duplication, with duplicate debit, stuck requests, key collisions as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-08] Design cross-product money movement
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which products and account types can send or receive funds?

**Customer problem / diagnostic hypothesis.** Banking, brokerage and external rails have different settlement and purchasing-power semantics.

**Option A.** Explicit source/destination validation with linked transaction IDs and stage tracking.

**Option B.** One universal immediate-transfer state across all products.

**Choose and justify.** Use a capability matrix by route and show each product’s actual availability state.

**Primary metric.** Completed eligible cross-product transfers and comprehension.

**Guardrail.** Wrong available-to-trade, reversals, registered-limit issues.

**Cross-team or technical dependency.** Money Movement, brokerage, core banking, compliance.

**Worked spoken answer.**

"First I would scope the requirements: Which products and account types can send or receive funds? Banking, brokerage and external rails have different settlement and purchasing-power semantics. I see two technical approaches: explicit source/destination validation with linked transaction IDs and stage tracking, or one universal immediate-transfer state across all products. Use a capability matrix by route and show each product’s actual availability state. I would establish the ownership and failure semantics across Money Movement, brokerage, core banking, compliance. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are completed eligible cross-product transfers and comprehension, with wrong available-to-trade, reversals, registered-limit issues as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-09] Design a shared financial dashboard
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the job spendable cash, net worth or action prioritization?

**Customer problem / diagnostic hypothesis.** Data comes from multiple authoritative systems at different update rates.

**Option A.** Entitled aggregate read model with categories and freshness labels.

**Option B.** One unqualified real-time grand total.

**Choose and justify.** Start with distinct labeled components; degrade independently if one source is unavailable.

**Primary metric.** Correct total-position comprehension and task completion.

**Guardrail.** Stale values, double count, unauthorized accounts.

**Cross-team or technical dependency.** Banking ledger, investments portfolio, identity, aggregator.

**Worked spoken answer.**

"First I would scope the requirements: Is the job spendable cash, net worth or action prioritization? Data comes from multiple authoritative systems at different update rates. I see two technical approaches: entitled aggregate read model with categories and freshness labels, or one unqualified real-time grand total. Start with distinct labeled components; degrade independently if one source is unavailable. I would establish the ownership and failure semantics across Banking ledger, investments portfolio, identity, aggregator. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are correct total-position comprehension and task completion, with stale values, double count, unauthorized accounts as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-10] Design account restrictions
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which restriction types and permitted customer actions are in scope?

**Customer problem / diagnostic hypothesis.** Fraud and compliance restrictions must be enforced on operations rather than UI text.

**Option A.** Central policy/entitlement checks plus customer-safe status and recovery.

**Option B.** Hide restricted controls in UI only.

**Choose and justify.** Enforce backend authorization, use least privileged permissions and reveal only allowable reasons.

**Primary metric.** Correct permitted-action handling and safe recovery rate.

**Guardrail.** Unauthorized operation, fraud-rule leakage, wrongful lockout.

**Cross-team or technical dependency.** Risk, Compliance, account core, identity, service.

**Worked spoken answer.**

"First I would scope the requirements: Which restriction types and permitted customer actions are in scope? Fraud and compliance restrictions must be enforced on operations rather than UI text. I see two technical approaches: central policy/entitlement checks plus customer-safe status and recovery, or hide restricted controls in UI only. Enforce backend authorization, use least privileged permissions and reveal only allowable reasons. I would establish the ownership and failure semantics across Risk, Compliance, account core, identity, service. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are correct permitted-action handling and safe recovery rate, with unauthorized operation, fraud-rule leakage, wrongful lockout as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-11] Design savings automation
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-11`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is saving fixed, threshold-based or predictive?

**Customer problem / diagnostic hypothesis.** Scheduled actions can fail if balance changes before execution.

**Option A.** Opt-in scheduled rule with current available-funds check, idempotency and pause.

**Option B.** Forecast-only auto-sweep without execution safeguards.

**Choose and justify.** Build explainable rules first, verify money availability at execution, notify meaningful outcome.

**Primary metric.** Successful sustained scheduled savings.

**Guardrail.** NSF, missed obligations, duplicate sweeps.

**Cross-team or technical dependency.** Scheduler, Money Movement, core balance, preferences.

**Worked spoken answer.**

"First I would scope the requirements: Is saving fixed, threshold-based or predictive? Scheduled actions can fail if balance changes before execution. I see two technical approaches: opt-in scheduled rule with current available-funds check, idempotency and pause, or forecast-only auto-sweep without execution safeguards. Build explainable rules first, verify money availability at execution, notify meaningful outcome. I would establish the ownership and failure semantics across Scheduler, Money Movement, core balance, preferences. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are successful sustained scheduled savings, with nSF, missed obligations, duplicate sweeps as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.6-12] Design a payment recovery flow
**Category:** 10.6 System-design and technical scenarios.  **Answer ID:** `Q10.6-12`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What failure classes are customer-recoverable versus operational incidents?

**Customer problem / diagnostic hypothesis.** A failed/unknown outcome needs cause-specific safe next steps.

**Option A.** Guided status detail and retry eligibility based on authoritative reason.

**Option B.** Single generic Retry button for all failures.

**Choose and justify.** Classify errors; allow retry only when safe, with idempotency and escalation for unknown outcomes.

**Primary metric.** Safe recovery completion and time to resolution.

**Guardrail.** Double payment, illegal release, privacy leak.

**Cross-team or technical dependency.** Payments state, case management, support, Risk.

**Worked spoken answer.**

"First I would scope the requirements: What failure classes are customer-recoverable versus operational incidents? A failed/unknown outcome needs cause-specific safe next steps. I see two technical approaches: guided status detail and retry eligibility based on authoritative reason, or single generic Retry button for all failures. Classify errors; allow retry only when safe, with idempotency and escalation for unknown outcomes. I would establish the ownership and failure semantics across Payments state, case management, support, Risk. I would validate the system through happy-path, duplicate, delayed and failed-operation cases as applicable. The key measures are safe recovery completion and time to resolution, with double payment, illegal release, privacy leak as critical guardrails. I would not call the design done until the result is traceable and the customer experience accurately represents the authoritative financial state."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.

## 10.7 Strategy and prioritization scenarios


### [Q10.7-01] What should Questrade build first in everyday banking?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-01`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are foundational account/payment jobs already reliable and what customer segment is primary?

**Customer problem / diagnostic hypothesis.** Differentiation fails without trust, but a mature foundation may shift the priority.

**Option A.** Improve balance, payment state, transaction clarity and activation.

**Option B.** Lead with rich AI insights and advanced automation.

**Choose and justify.** Prioritize evidence-backed foundational trust and adoption gaps; then build cross-product differentiation.

**Primary metric.** Sustained primary-banking activity with successful core tasks.

**Guardrail.** Financial correctness, fraud, outages.

**Cross-team or technical dependency.** Core banking, Cards, Money Movement, Investments.

**Worked spoken answer.**

"I would clarify the strategic constraint first: Are foundational account/payment jobs already reliable and what customer segment is primary? The important tension is that differentiation fails without trust, but a mature foundation may shift the priority.. One route would be to improve balance, payment state, transaction clarity and activation; another would be to lead with rich AI insights and advanced automation. Prioritize evidence-backed foundational trust and adoption gaps; then build cross-product differentiation. I would make dependencies across Core banking, Cards, Money Movement, Investments explicit rather than optimizing one team's roadmap in isolation. I would judge success through sustained primary-banking activity with successful core tasks, while protecting against financial correctness, fraud, outages. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-02] How would you differentiate Questrade from Wealthsimple?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-02`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which target customer job is underserved and what unique assets can Questrade use?

**Customer problem / diagnostic hypothesis.** Feature parity creates a race without customer value or economics.

**Option A.** Connected banking-to-investing journeys and financial confidence.

**Option B.** Copy each latest competitor release.

**Choose and justify.** Prioritize a credible integrated value proposition and reliable core utility over reactive feature copying.

**Primary metric.** Target-segment acquisition to sustained multi-product value.

**Guardrail.** Unsupported claims, regulatory risk, customer confusion.

**Cross-team or technical dependency.** Investments, banking, customer research, strategy.

**Worked spoken answer.**

"I would clarify the strategic constraint first: Which target customer job is underserved and what unique assets can Questrade use? The important tension is that feature parity creates a race without customer value or economics.. One route would be to connected banking-to-investing journeys and financial confidence; another would be to copy each latest competitor release. Prioritize a credible integrated value proposition and reliable core utility over reactive feature copying. I would make dependencies across Investments, banking, customer research, strategy explicit rather than optimizing one team's roadmap in isolation. I would judge success through target-segment acquisition to sustained multi-product value, while protecting against unsupported claims, regulatory risk, customer confusion. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-03] Which banking features are table stakes?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-03`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What segment, account type and launch maturity are assumed?

**Customer problem / diagnostic hypothesis.** A bank must safely enable funding, spending, transfer, status and recovery before delight features.

**Option A.** Reliable account balances, transfers, card basics, support and security.

**Option B.** Advanced budgeting, AI and automated investing first.

**Choose and justify.** Sequence essential customer jobs and mandatory controls before optional enhancements.

**Primary metric.** Core-job successful completion and active usage.

**Guardrail.** Availability, fraud loss, reconciliation, complaints.

**Cross-team or technical dependency.** Core banking, Cards, Money Movement, compliance.

**Worked spoken answer.**

"I would clarify the strategic constraint first: What segment, account type and launch maturity are assumed? The important tension is that a bank must safely enable funding, spending, transfer, status and recovery before delight features.. One route would be to reliable account balances, transfers, card basics, support and security; another would be to advanced budgeting, AI and automated investing first. Sequence essential customer jobs and mandatory controls before optional enhancements. I would make dependencies across Core banking, Cards, Money Movement, compliance explicit rather than optimizing one team's roadmap in isolation. I would judge success through core-job successful completion and active usage, while protecting against availability, fraud loss, reconciliation, complaints. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-04] What should be built versus bought?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-04`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is the capability differentiating, regulated, commodity or deeply coupled?

**Customer problem / diagnostic hypothesis.** Ownership should reflect strategic control, integration cost and operating risk.

**Option A.** Buy proven commodity core/rail capability; build differentiated customer layer.

**Option B.** Build everything in-house for control.

**Choose and justify.** Evaluate total cost, vendor dependency, resilience, compliance and speed; retain critical design/contract ownership.

**Primary metric.** Time to safe value and long-run unit economics.

**Guardrail.** Vendor concentration, service reliability, data portability.

**Cross-team or technical dependency.** Architecture, procurement, risk, finance, platform.

**Worked spoken answer.**

"I would clarify the strategic constraint first: Is the capability differentiating, regulated, commodity or deeply coupled? The important tension is that ownership should reflect strategic control, integration cost and operating risk.. One route would be to buy proven commodity core/rail capability; build differentiated customer layer; another would be to build everything in-house for control. Evaluate total cost, vendor dependency, resilience, compliance and speed; retain critical design/contract ownership. I would make dependencies across Architecture, procurement, risk, finance, platform explicit rather than optimizing one team's roadmap in isolation. I would judge success through time to safe value and long-run unit economics, while protecting against vendor concentration, service reliability, data portability. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-05] What would your first 90 days look like?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-05`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What is live today, what is promised, and where is the highest-severity gap?

**Customer problem / diagnostic hypothesis.** Rushing into features before learning architecture and customer evidence creates risk.

**Option A.** Map jobs, teams, metrics and incidents; ship narrow verified improvement.

**Option B.** Declare a broad roadmap immediately.

**Choose and justify.** First understand state/data contracts and activation funnel, align leaders, then deliver a measured quick win.

**Primary metric.** Baseline quality and customer outcome movement on first selected problem.

**Guardrail.** Disrupting existing commitments, risky change.

**Cross-team or technical dependency.** Jaz, peer PMs, engineering, operations, customer research.

**Worked spoken answer.**

"I would clarify the strategic constraint first: What is live today, what is promised, and where is the highest-severity gap? The important tension is that rushing into features before learning architecture and customer evidence creates risk.. One route would be to map jobs, teams, metrics and incidents; ship narrow verified improvement; another would be to declare a broad roadmap immediately. First understand state/data contracts and activation funnel, align leaders, then deliver a measured quick win. I would make dependencies across Jaz, peer PMs, engineering, operations, customer research explicit rather than optimizing one team's roadmap in isolation. I would judge success through baseline quality and customer outcome movement on first selected problem, while protecting against disrupting existing commitments, risky change. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-06] How would you work across three PM-owned areas?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-06`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Where are customer journeys currently broken by ownership seams?

**Customer problem / diagnostic hypothesis.** Local optimization can make end-to-end outcomes worse.

**Option A.** Shared outcome, contract, dependency map and regular cross-team review.

**Option B.** Centralize all decisions in one PM.

**Choose and justify.** Preserve team ownership while agreeing on end-to-end customer tasks and states.

**Primary metric.** End-to-end task success and fewer handoff incidents.

**Guardrail.** Blurred accountability, delivery gridlock.

**Cross-team or technical dependency.** Accounts, Cards, Money Movement, engineering leaders.

**Worked spoken answer.**

"I would clarify the strategic constraint first: Where are customer journeys currently broken by ownership seams? The important tension is that local optimization can make end-to-end outcomes worse.. One route would be to shared outcome, contract, dependency map and regular cross-team review; another would be to centralize all decisions in one PM. Preserve team ownership while agreeing on end-to-end customer tasks and states. I would make dependencies across Accounts, Cards, Money Movement, engineering leaders explicit rather than optimizing one team's roadmap in isolation. I would judge success through end-to-end task success and fewer handoff incidents, while protecting against blurred accountability, delivery gridlock. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-07] What if Cards and Money Movement have competing priorities?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-07`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Which dependency blocks a customer outcome and what is the relative impact?

**Customer problem / diagnostic hypothesis.** Teams can rationally optimize different backlogs.

**Option A.** Evidence-based shared priority and minimum contract.

**Option B.** Escalate immediately or bypass one team.

**Choose and justify.** Quantify customer severity, options and sequencing before director escalation.

**Primary metric.** Highest-value end-to-end outcome delivered on schedule.

**Guardrail.** Reliability regression, unresolved ownership.

**Cross-team or technical dependency.** Peer PMs, architecture, operations, director.

**Worked spoken answer.**

"I would clarify the strategic constraint first: Which dependency blocks a customer outcome and what is the relative impact? The important tension is that teams can rationally optimize different backlogs.. One route would be to evidence-based shared priority and minimum contract; another would be to escalate immediately or bypass one team. Quantify customer severity, options and sequencing before director escalation. I would make dependencies across Peer PMs, architecture, operations, director explicit rather than optimizing one team's roadmap in isolation. I would judge success through highest-value end-to-end outcome delivered on schedule, while protecting against reliability regression, unresolved ownership. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-08] How would you prioritize reliability versus growth?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-08`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Is there financial correctness or compliance harm, or a low-severity transient issue?

**Customer problem / diagnostic hypothesis.** Reliability is a prerequisite for durable banking growth.

**Option A.** Mitigate high-severity incidents and prevent recurrence.

**Option B.** Continue acquisition launch despite known integrity incident.

**Choose and justify.** Use severity and customer harm thresholds; protect non-negotiable correctness before growth.

**Primary metric.** Recovered core-job reliability plus sustained adoption.

**Guardrail.** Financial loss, fraud, unavailable funds.

**Cross-team or technical dependency.** Incident team, SRE, Risk, product leadership.

**Worked spoken answer.**

"I would clarify the strategic constraint first: Is there financial correctness or compliance harm, or a low-severity transient issue? The important tension is that reliability is a prerequisite for durable banking growth.. One route would be to mitigate high-severity incidents and prevent recurrence; another would be to continue acquisition launch despite known integrity incident. Use severity and customer harm thresholds; protect non-negotiable correctness before growth. I would make dependencies across Incident team, SRE, Risk, product leadership explicit rather than optimizing one team's roadmap in isolation. I would judge success through recovered core-job reliability plus sustained adoption, while protecting against financial loss, fraud, unavailable funds. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-09] Would you launch with incomplete transaction categorization?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-09`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** Are raw financial amounts and posting statuses correct despite partial enrichment?

**Customer problem / diagnostic hypothesis.** Categorization is optional interpretation; financial truth is mandatory.

**Option A.** Ship accurate transactions with clearly unlabeled/other category where uncertain.

**Option B.** Delay all transaction history for perfect enrichment.

**Choose and justify.** Launch scoped categorization with honest confidence if core records remain correct; never guess categories as fact.

**Primary metric.** Successful transaction identification and category precision.

**Guardrail.** Wrong merchant identity, hidden fraud, broken balances.

**Cross-team or technical dependency.** Transaction enrichment, Accounts design, data QA.

**Worked spoken answer.**

"I would clarify the strategic constraint first: Are raw financial amounts and posting statuses correct despite partial enrichment? The important tension is that categorization is optional interpretation; financial truth is mandatory.. One route would be to ship accurate transactions with clearly unlabeled/other category where uncertain; another would be to delay all transaction history for perfect enrichment. Launch scoped categorization with honest confidence if core records remain correct; never guess categories as fact. I would make dependencies across Transaction enrichment, Accounts design, data QA explicit rather than optimizing one team's roadmap in isolation. I would judge success through successful transaction identification and category precision, while protecting against wrong merchant identity, hidden fraud, broken balances. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.


### [Q10.7-10] How would you respond to a late regulatory change?
**Category:** 10.7 Strategy and prioritization scenarios.  **Answer ID:** `Q10.7-10`.  **Status:** hypothetical practice question, not a confirmed interview prompt.

**Clarify first.** What exactly is required, effective when, and which customer flows are affected?

**Customer problem / diagnostic hypothesis.** Compliance changes can invalidate a launch promise and require backend state/control updates.

**Option A.** Narrow scope and implement enforced compliant state with transparent UX.

**Option B.** Keep schedule and only update customer-facing copy.

**Choose and justify.** Align Legal, Risk, engineering and leadership; delay/limit launch if compliance cannot be proven.

**Primary metric.** Successful compliant processing of in-scope flows.

**Guardrail.** Early release, audit gaps, illegal transactions.

**Cross-team or technical dependency.** Compliance, Risk, Money Movement, core, QA.

**Worked spoken answer.**

"I would clarify the strategic constraint first: What exactly is required, effective when, and which customer flows are affected? The important tension is that compliance changes can invalidate a launch promise and require backend state/control updates.. One route would be to narrow scope and implement enforced compliant state with transparent UX; another would be to keep schedule and only update customer-facing copy. Align Legal, Risk, engineering and leadership; delay/limit launch if compliance cannot be proven. I would make dependencies across Compliance, Risk, Money Movement, core, QA explicit rather than optimizing one team's roadmap in isolation. I would judge success through successful compliant processing of in-scope flows, while protecting against early release, audit gaps, illegal transactions. I would revisit the decision if evidence about customer harm, value or readiness changes."

**How to defend it under follow-up.** Explain which evidence would change your initial assumption, what the authoritative system can actually prove, and why the customer benefit is worth the dependency and risk.



# 11. Extended worked exemplar: hydro bill confirmation

**Prompt:** "A customer keeps checking transaction history to determine if they paid their hydro bill. What would you try first?"

**One decisive clarification:** Are they checking a past payment, or trying to remember a future bill? Assume a past payment was initiated from this bank.

**Problem:** The job is to verify an obligation was addressed, but transaction history doesn't establish confidence. A broader bill tracker could be valuable, yet would add recurrence logic and potentially inaccurate due dates.

**Option A:** Reliable transaction detail: biller, account-appropriate masking, amount, date, bank-side processing state, receipt/reference and safe next action. **Option B:** Entire bill-management calendar, with upcoming due dates, reminders and paid/unpaid rollups.

**Choice:** Start with A if evidence validates uncertainty about a past payment. Preserve strict language around what has been bank-processed versus externally biller-credited. A is more targeted and needs fewer predictions. Revisit B if interviews show that upcoming obligation planning is the dominant job.

**Metrics:** Customer task test for correct payment-status understanding; unresolved status contacts per 1,000 eligible bill payments; repeat searches as supporting diagnostics; false confirmations and duplicate payments as guardrails.

**Spoken answer:** "I'd first clarify whether they're verifying a payment they already made or planning for the next bill. If they've already paid, I'd focus on giving them a trustworthy way to confirm what happened: amount, biller, time, status, and an appropriate reference. I could also envision a broader bill tracker, but that solves a larger problem and would depend on reliable future obligation data. I'd start with the transaction detail improvement, measure whether people can confirm payment without repeatedly searching or contacting us, and watch for incorrect completion claims or duplicate payments. If the research shows the actual issue is upcoming bills, I'd change direction."

# 12. Diagnostic practice: successful transfer completion declines

**Prompt:** "Successful transfers fell 20% after the latest release. What would you do?"

1. Verify definition: successful *distinct intended transfers* divided by eligible attempts, not raw event count. Separate count decline from rate decline and instrument/reporting changes.
2. Scope severity: financial integrity? Missing funds, duplicate transfers, unreconciled events? If yes, initiate incident controls immediately.
3. Segment: payment route, platform, account cohort, bank partner, risk result, time of day, release version.
4. Find stage: initiation -> validation -> risk -> rail submission -> acknowledgment -> ledger/settlement -> final projection.
5. Test hypotheses: actual payment decline, recent API change, risk-rule false positives, external rail outage, or missing completion telemetry.
6. Mitigate: pause/roll back safely, ensure in-flight transactions aren't resent blindly, communicate where necessary, reconcile unresolved outcomes.
7. Verify recovery: completion rate, failure mix, duplicate incidence, status lag, reconciliation breaks, contact rate and complaints.

**Spoken answer:** "I'd establish whether transfers actually failed or whether completion measurement stopped firing. I'd compare distinct intended transfers through the funnel by route and deployment. If financial integrity is at risk, I'd contain the incident first. I would not blindly roll back or retry in-flight transfers without understanding their state, because that can create duplicates. Once the failing stage is isolated, I'd mitigate, reconcile uncertain payments, and watch completion, error codes, duplicate counts and support impact to verify recovery."

# 13. System-design practice: shared transaction status

**Prompt:** "Design transaction status across Cards and Money Movement."

**Functional requirements:** Transaction list and detail; correct status and timestamp; linked pending/posted records; search by amount/merchant/date; receipt/reference; permitted customer actions; safe support escalation.

**Non-functional requirements:** Financial correctness, customer entitlements, freshness, read latency, availability, scale, event durability, versioned states, auditability and recoverability.

**Conceptual components:**

- **App / web:** Presents financial facts without inventing authoritative completion.
- **Accounts experience API:** Authenticates customer and checks account permission.
- **Transaction projection / search index:** Normalized, read-optimized projection of authorized financial events.
- **Domain systems:** Cards authorization/clearing, Money Movement processing, core ledger posting.
- **Shared mechanisms:** Event publication, deduplication/versioning, reconciliation, logs/metrics/traces, case management.

**Failure handling:** Duplicate request -> idempotency. Duplicate event -> dedupe. Late event -> state transition order. Missing callback -> status lookup and reconciliation. Search lag -> explicit freshness and no false payment decision. Notification failure -> payment state remains authoritative. Read outage -> controlled degradation. Unknown payment outcome -> don't blindly retry.

**Trade-off:** Event projections enable responsive customer history but may be eventually consistent. Payment authorization and true spendability require the correct authoritative sources. Frontend convenience must not be substituted for financial control.

**Spoken answer:** "I'd separate the system of financial truth from the read experience. Cards and Money Movement would publish consistent identifiers and defined lifecycle events; Accounts would present a normalized, searchable transaction view. I'd agree on the meaning of each state and handle duplicates, out-of-order events and reconciliation. I'd also clarify freshness, authorization and what happens when one dependency goes down, because customers must not be told a transaction succeeded based solely on a delayed projection."

# 14. Questrade-specific strategic hypotheses and current opportunities

**Context:** The Temenos core banking announcement (2026-05-14) and the RTR infrastructure launch with Questbank in the initial active cohort (2026-11-09) make customer-facing financial state, ledger integration, fraud and availability logical areas to study. They do not reveal the actual internal product organization, deployment architecture or specific enabled consumer transfer features.

**Wealthsimple:** Its 2026-11-05 announcements create external comparison points: integrated finance, instant transfers between eligible Wealthsimple clients, and announced future AI/experience releases. Do not assume upcoming experiences are already available. The key strategic question for Questrade is not copying the feature roster but choosing the highest-value connected financial journey.

Three illustrative phases:

1. **Trusted foundation:** Correct balances, transactions, payments, security and recovery.
2. **Primary-banking adoption:** First funding, recurring income, card use, bill switching and ongoing utility.
3. **Connected differentiation:** Banking-to-investing funding, comprehensive financial position, explainable cash-flow assistance and responsible automation.

A plausible real-time payments case asks: *Which specific use case benefits from real-time settlement, which routes/recipients are supported, and how do fraud/recovery protections change?* Never confuse payment infrastructure membership with universal consumer availability.

# 15. Segments that materially change design

| Segment | High-value job | Key caution |
|---|---|---|
| Existing Questrade investor | Activate banking and fund from known relationship | Financial entity, consent and KYC distinctions |
| New-to-Questrade customer | Trust first funding and everyday utility | Switching effort and initial risk perception |
| Primary-bank switcher | Move salary, bills and card habits | External employer/biller dependencies |
| Irregular-income earner | Save without jeopardizing rent | Automation can cause shortfall |
| High-frequency card user | Find, classify and understand purchases | Authorizations differ from posting |
| Family helper/caregiver | Help with one issue without oversharing | Permission scope, revocation and privacy |
| Multi-product investor | Know position and move funds | Cash is not equivalent to buying power |
| Customer in distress | Recover access, understand holds | Sensitive disclosures and urgency |

Segmentation prompts: Is this a new or established user? Is the job daily or rare but consequential? Is it a single-product or multi-product journey? Does the customer want to **view** information or **take action**? Which population truly benefits from the proposed feature?

# 16. High-value clarifying questions

| Scenario | Ask this first |
|---|---|
| Transaction history | What is the customer trying to establish from history? |
| Bill payments | Past payment confirmation or next due date? |
| Available balance | Incorrect number or misunderstood difference? |
| Pending transfer | True processing delay or status propagation delay? |
| Failed transfer | Initiation failure, processing failure or later return? |
| Banking activation | Drop-off at opening, first funding or recurring use? |
| Spending insight | Which specific decision should the insight improve? |
| Savings automation | Remembering to save or knowing how much is safe? |
| Investment funding | Initiating the transfer or waiting for purchasing power? |
| Family assistance | Share one piece of information or delegate control? |
| Notifications | Missing important signal or overloaded with noise? |
| Regulation | Which transactions, users and dates are in scope? |
| System design | Which properties need strong correctness/freshness guarantees? |
| Prioritization | Which customer/business outcome and constraints dominate? |

Ask **one decisive question**, state a working assumption and continue. Long requirement interrogations can stall a collaborative case.

# 17. Interview challenge / pushback responses

**"Engineering says six months."** Identify the expensive dependency (data, new rail, UX, third party). Find a smaller safe intervention if possible, but don't work around a dependency required for financial correctness.

**"Customers asked for a full dashboard."** Treat it as signal; clarify what decision or task customers fail. A dashboard may be right, but don't equate a proposed feature with a validated need.

**"How do you know this is a real problem?"** Triangulate behavioral data, support contact reasons, interviews and task testing. Distinguish symptom from cause.

**"Your leading metric improved but CSAT did not."** Challenge whether leading behavior was causally connected to the actual job. Inspect downstream outcomes and guardrails rather than scaling a vanity success.

**"Another PM owns the API."** Establish shared outcome, ownership, semantic contract, delivery dependency and escalation threshold. Respect peer roadmaps while making customer impact explicit.

**"Would you launch with limitations?"** Launch an honestly scoped enhancement if core financial states remain correct and safe. Do not knowingly ship wrong balances, duplicate payment exposure, regulatory gaps or privacy leaks.

**"You have only two weeks."** Choose an intervention that solves one customer job and fits safe requirements. Be explicit about what cannot be cut and how you'd test it.

**"Why option A over B?"** Use direct fit to diagnosed job, confidence, time to value, risk and cost of false assumptions. State what evidence could reverse the choice.

# 18. Self-review rubric for strong Senior PM answers

1. Asked one high-leverage clarifying question.
2. Named the customer's job in plain language.
3. Distinguished symptom from root cause.
4. Considered two **credible and different** approaches.
5. Chose one and explained why it fits evidence and constraints.
6. Recognized authoritative source and cross-team dependencies.
7. Selected a meaningful customer outcome, not only feature clicks.
8. Chose a material guardrail for this financial use case.
9. Described an appropriate validation mechanism.
10. Delivered the core answer conversationally in ~2 minutes, with depth ready for follow-up.

This is a coaching checklist, not an official Questrade interview scoring rubric. Avoid reciting every line when the interviewer wants a quick collaborative answer.

# 19. Live navigation matrix

| Trigger words | Root problem to consider | Candidate first intervention | Outcome | Guardrail |
|---|---|---|---|---|
| Open account | Identity, KYC, first value | Contextual onboarding | Funded activation | Fraud/KYC |
| Switch bank | Payroll, billers, trust | Guided switch | Recurring use | Missed bills |
| Transaction history | Find, identify, status | Search and details | Task success | Wrong data |
| Balance | Holds, available versus posted | Availability explanation | Correct comprehension | Wrong balance |
| Pending payment | State, timing, retry | Truthful timeline | Uncertainty reduction | Duplicate debit |
| Bill tracker | Past versus future obligation | Narrow job first | Bill task completed | False due date |
| Card spend | Authorization / clearing | Linked lifecycle | Recognition | Fraud/declines |
| Family helper | Scope and consent | Redacted receipt | Safe assistance | Privacy leak |
| Saving | Predictability, control | Opt-in threshold rule | Safe saving | NSF |
| Investment funding | Bank versus brokerage state | Joined timeline | Funding task success | Wrong purchasing power |
| API timeout | Unknown outcome | Idempotency and status lookup | Safe completion | Duplicate execution |
| Regulatory change | Applicable rules and timing | Backend enforcement / safe rescope | Compliant processing | Violation |

# 20. Final interview priorities and use of your experience

**Preparation order:** (1) transaction history/payment clarity; (2) current/available balances; (3) primary banking activation; (4) Accounts / Cards / Money Movement / Investments boundaries; (5) comparison of MVP choices with outcomes; (6) safe transfer state, idempotency, atomicity, asynchronous completion and reconciliation.

**Relevant experience to reference briefly:** RBC Avion Select non-RBC cashback withdrawal through Interac e-Transfer supports payment/reconciliation stories; HBC Mastercard with Neo supports conversion and application/eligibility; Arc'teryx membership/CRM supports identity, state, integration and cross-team coordination. Use authentic examples rather than inventing implementation details. The goal is to combine technical understanding with customer-first product judgment.

**Five repeatable interview prompts:** What is the job? What is causing friction? What are two credible choices and why this one? What must be true in the underlying system? What customer outcome and guardrail prove safe value?

**Most important principle:** Accounts & State exists to make financial activity coherent and understandable across product boundaries. Banking customers care less about team names than whether their money is accurate, available, traceable and safe.

# References and validity notes

- Temenos, "Temenos Core Banking SaaS to Power Questrade Financial Group's Banking Offering," 2026-05-14: https://www.temenos.com/press_release/temenos-core-banking-saas-to-power-questrade-financial-groups-banking-offering/
- Payments Canada, "Canada launches the Real-Time Rail," 2026-11-09: https://www.payments.ca/canada-launches-real-time-rail-bringing-247-payment-infrastructure-national-economy
- Payments Canada, "Testing and launch / phased onboarding": https://www.payments.ca/systems-services/payment-systems/real-time-rail-payment-system/testing-and-launch
- Wealthsimple newsroom, "Wealthsimple announces AI assistant, Penny, and 11 more releases," 2026-11-05: https://newsroom.wealthsimple.com/wealthsimple-announces-ai-assistant-penny-and-11-more-releases-at-wealthsimple-presents-something-good-is-going-to-happen

**Validity:** Document date 2026-11-11. References verify public announcements only. Customer journeys, scoring, options, examples and proposed architectures are hypothetical teaching material. Avoid presenting them as existing Questrade product functionality.

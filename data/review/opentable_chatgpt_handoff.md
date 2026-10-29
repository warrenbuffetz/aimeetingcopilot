# OpenTable — ChatGPT answer handoff

Generated: 2026-10-29T16:53:41.414Z

**Scope:** Author spoken answers for predicted questions marked Missing or Adapt where overlap is insufficient. Cursor must not auto-import predictions.

## P0 — Write first (Very High likelihood)

1. **Walk me through how you would take a 0-to-1 AI revenue feature from ambiguous problem to launch.** (hiring_manager, Adapt)  
   - Prediction ID: `opentable-pred-hm-002`  
   - Reuse: opentable-rec-010 — Combine opentable-rec-010 + opentable-rec-013 (scope/learn first)

2. **Where would you look first in OpenTable data to find incremental restaurant revenue opportunities?** (hiring_manager, Adapt)  
   - Prediction ID: `opentable-pred-hm-003`  
   - Reuse: opentable-rec-010 — Framework answer + ask discovery questions

3. **How would you design an experiment to prove a revenue recommendation actually increased covers, not just shifted bookings?** (hiring_manager, Adapt)  
   - Prediction ID: `opentable-pred-hm-004`  
   - Reuse: opentable-rec-011 — HBC holdout experiments (opentable-rec-007) + opentable-rec-011

4. **Describe a product case: unfilled tables on Friday at 7pm — what would you build and why?** (hiring_manager, Missing)  
   - Prediction ID: `opentable-pred-hm-005`  
   - Reuse: none — Synthesize opentable-rec-010/011; add OpenTable-specific product case

5. **How do you partner with ML engineers on model selection — when is a simpler model good enough?** (hiring_manager, Adapt)  
   - Prediction ID: `opentable-pred-hm-009`  
   - Reuse: opentable-rec-019 — Personal semantic retrieval project trade-offs

6. **How would you evaluate offline model quality versus online business impact for a demand forecast?** (cross_functional_panel, Missing)  
   - Prediction ID: `opentable-pred-panel-001`  
   - Reuse: opentable-rec-011 — Combine measurement + ML evaluation framework (needs ChatGPT)

7. **What is your approach to hallucinations, unsafe recommendations, or low-confidence predictions in a restaurant-facing AI feature?** (cross_functional_panel, Adapt)  
   - Prediction ID: `opentable-pred-panel-002`  
   - Reuse: opentable-rec-008 — Personal apps reliability + RBC controls mindset

## P1 — Missing primary answers

- `opentable-pred-hm-005` (Very High) — Describe a product case: unfilled tables on Friday at 7pm — what would you build and why?
- `opentable-pred-hm-007` (High) — How would you translate restaurant revenue goals into a product narrative engineering and design can execute?
- `opentable-pred-panel-003` (High) — Describe system architecture at a whiteboard level for an AI feature that recommends actions to restaurants.
- `opentable-pred-hm-011` (High) — What is your framework for pricing and promotions in a marketplace you don't fully control?
- `opentable-pred-hm-012` (High) — Tell me about a launch that underperformed — what did you change?
- `opentable-pred-hm-013` (Medium) — How would you define success in your first 6 months in this role?
- `opentable-pred-panel-004` (Medium) — How would you monitor model drift after launch for a seasonality-heavy restaurant demand model?
- `opentable-pred-hm-017` (Medium) — How would you use OpenTable's diner-side data responsibly to help restaurants without creeping guests out?
- `opentable-pred-hm-005-fu1` (High) — Would you recommend discounts, pacing reservations, or reallocation across shifts — how do you decide?
- `opentable-pred-panel-001` (Very High) — How would you evaluate offline model quality versus online business impact for a demand forecast?

## Adapt — extend existing approved answers

- `opentable-pred-hm-001-fu1` — start from `opentable-rec-012`; What would you need from ML engineering and data science in your first 90 days?
- `opentable-pred-hm-001-fu2` — start from `opentable-rec-005`; Tell me about a time you had to learn a new technical domain quickly to ship a product.
- `opentable-pred-hm-002` — start from `opentable-rec-010`; Walk me through how you would take a 0-to-1 AI revenue feature from ambiguous problem to launch.
- `opentable-pred-hm-003` — start from `opentable-rec-010`; Where would you look first in OpenTable data to find incremental restaurant revenue opportunities?
- `opentable-pred-hm-004` — start from `opentable-rec-011`; How would you design an experiment to prove a revenue recommendation actually increased covers, not just shifted bookings?
- `opentable-pred-hm-004-fu1` — start from `opentable-rec-011`; What guardrail metrics would you monitor so revenue tactics don't hurt service quality?
- `opentable-pred-hm-008-fu1` — start from `opentable-rec-007`; What would you do if the experiment won on volume but lost on margin?
- `opentable-pred-hm-009` — start from `opentable-rec-019`; How do you partner with ML engineers on model selection — when is a simpler model good enough?
- `opentable-pred-panel-002` — start from `opentable-rec-008`; What is your approach to hallucinations, unsafe recommendations, or low-confidence predictions in a restaurant-facing AI feature?
- `opentable-pred-panel-002-fu1` — start from `opentable-rec-019`; How do latency and token cost factor into your product requirements for AI features?
- `opentable-pred-panel-005` — start from `opentable-rec-019`; Walk through how your semantic matching side project informs retrieval design for a copilot or operator assistant.
- `opentable-pred-panel-005-fu1` — start from `opentable-rec-019`; How did you evaluate retrieval accuracy versus user trust in that application?
- `opentable-pred-hm-015` — start from `opentable-rec-013`; How do you decide when an AI feature is ready for GA versus extended pilot?
- `opentable-pred-hm-016` — start from `opentable-rec-014`; Tell me about influencing engineers when you disagreed on build vs experiment.
- `opentable-pred-hm-018` — start from `opentable-rec-002`; What restaurant or hospitality product would you benchmark, and what would you steal?

## Guardrails (unchanged)

- Currently employed at Arc'teryx; selective move narrative  
- Distinguish personal AI apps from enterprise ML launches  
- Compensation: CAD $185K–$205K base target; OpenTable published $135K–$165K (see opentable-rec-017)  
- Do not invent restaurant production metrics or ML deployments  

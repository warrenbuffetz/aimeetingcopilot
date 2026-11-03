# Gap report — OpenTable Bristol profile

## Ready to reuse (no GPT required for body)

| ID | Source | Notes |
|----|--------|-------|
| B01–B04, B06 | OpenTable import | Authored for OpenTable; B05 still `needs_gpt_draft` |
| B40 | Shared UUID (Interac) | Corrected RBC chronology; transferable payments story |
| B41–B48 | OpenTable import | Experience modules |
| B49, B50, B52, B53, B55 | Shared UUID | Behavioural / leadership |
| B02, B03 | OpenTable import | Why role / company |

## Structure ready (GPT still needed for spoken answers)

| Area | IDs | In UI |
|------|-----|--------|
| Industry reference scaffold | **IP-REF** | Pain points, segments, trade-offs, priority ranking (verify sources) |
| Live scenarios | **SC01–SC10** | Twist, probes, metrics, framework — spoken answer `needs_gpt_draft` |
| Industry POV questions | **IP01–IP12** | Some challenge follow-ups; answers `needs_gpt_draft` |
| Philosophy (Jaz pattern) | **B59, B60** | Questions only |
| Battlecard / weakness tracker | embedded | Navigation + `WEAKNESS_TRACKER.md` |

## Light adaptation (optional closing)

Shared UUID answers may need **OpenTable-specific closing** only. Resolver strips Questrade banking closings from shared bodies.

## Needs GPT authoring (placeholder in UI)

- **Industry POV:** IP01–IP12 (+ follow-ups where listed)
- **Scenarios:** SC01–SC10 spoken responses
- **Philosophy:** B59, B60 (authentic personal content only — no fabricated stories)
- **Restaurant strategy:** B07–B16
- **AI/ML:** B17–B26
- **Economics:** B27–B32 + **B-R01–B-R11**
- **Craft / experiments:** B33–B39 + **B-E01–B-E08**
- **Career:** B05
- **Leadership:** B51, B56–B58

See `answer-authoring-backlog-by-type.json` for grouped queue.

## Highest-priority preparation gaps (post–Jaz)

1. **Decisive industry framing** — IP02, IP03, IP06, IP12 (not competitor lists without a sharp customer problem)
2. **Scenario judgment under twists** — SC01, SC05, SC06 (change promise vs workaround; incrementality)
3. **Proxy vs economics** — SC03, SC04, B-R* metrics definitions
4. **Second-order effects** — rehearse scenarios with restaurant profit, ops, trust, support load
5. **PM philosophy** — B59, B60 from real motivation (no new invented experiences)

## Needs more research (before strong answers)

- OpenTable **Table Automations**, **Turn Times**, **Availability Insights** — extensions only
- Incremental revenue / demand capture methodology — IP12, SC06
- Competitive set — verify claims before interviews
- IP-REF evidence bullets — label hypotheses; refresh with 2026 public sources

## Likely follow-up pressure (experience gaps)

| Risk | Mitigation |
|------|------------|
| No production AI/ML shipped | B06 + B18 + IP08; do not fabricate production ML |
| No hospitality PM title | B40/B43 + industry POV transfer from marketplace/growth work |
| Yield / RevPASH depth | B-R04, B11, IP-REF metrics — author with humility |
| Strategic spontaneity | Live scenarios + battlecard framework drills |

Full row-level status: `answer-authoring-backlog.json`.

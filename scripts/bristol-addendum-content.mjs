/**
 * Jaz interview learnings (Nov 3, 2026) — preparation structure only. Not confirmed Bristol questions.
 */

export const SCENARIO_JUDGMENT_FRAMEWORK = {
  title: "Scenario judgment (live interview)",
  steps: [
    { id: "clarify", label: "Clarify", detail: "Problem, customer, objective, hard constraint." },
    { id: "diagnose", label: "Diagnose", detail: "Evidence, segmentation, root cause — not symptoms." },
    { id: "evaluate", label: "Evaluate", detail: "Options, trade-offs, second-order effects." },
    { id: "decide", label: "Decide", detail: "Recommendation now — change the promise if the constraint requires it." },
    { id: "validate", label: "Validate", detail: "Test design, primary metric, guardrails, decision threshold." },
    { id: "adapt", label: "Adapt", detail: "What changes if data, policy, or economics shift." },
  ],
  initialPovHint: "Lead with a clear recommendation in ~10 seconds, then structure ~45–75 seconds.",
  jazMistakesToAvoid: [
    "Listing competitors without a decisive customer problem.",
    "Preserving the original UX promise when a new constraint invalidates it.",
    "Optimizing proxy metrics (pending state, engagement) over economic outcomes.",
    "Stopping at a technically workable fix without second-order customer impact.",
  ],
};

export function buildPhilosophyQuestions(q) {
  return [
    q("B59", {
      category: "Career & Motivation",
      title: "What do you love about product management?",
      navigationLabel: "What do you love about PM?",
      priority: 0,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "personal",
      suggestedPinned: true,
      backlogType: "personal_philosophy",
      aliases: ["Why PM", "Product philosophy"],
    }),
    q("B60", {
      category: "Career & Motivation",
      title: "What frustrates you about product management?",
      navigationLabel: "What frustrates you about PM?",
      priority: 0,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "personal",
      suggestedPinned: true,
      backlogType: "personal_philosophy",
      aliases: ["PM frustrations", "Growth areas"],
    }),
  ];
}

export function buildIndustryPovQuestions(q) {
  const cat = "Industry POV & Strategic Judgment";
  const items = [
    ["IP01", "What's your take on the restaurant industry today?", 0, true],
    ["IP02", "What are the biggest pain points restaurant operators face?", 0, true],
    [
      "IP03",
      "Which of those pain points would you prioritize for OpenTable, and why?",
      0,
      true,
      ["Why that over labor cost or acquisition?", "What would you deprioritize?"],
    ],
    ["IP04", "What is OpenTable particularly well positioned to solve?", 0, true],
    ["IP05", "Where is OpenTable's existing product strong, and where could it improve?", 1, false],
    [
      "IP06",
      "What important restaurant problems cannot be solved simply by generating more bookings?",
      0,
      true,
      ["How would you measure success without more covers?"],
    ],
    ["IP07", "Where do you see AI genuinely improving restaurant economics?", 0, true],
    ["IP08", "What AI use cases are overhyped or unlikely to create meaningful value?", 0, true],
    ["IP09", "How would you balance small independents with larger restaurant groups?", 1, false],
    [
      "IP10",
      "What product investment would you deliberately NOT prioritize, and why?",
      0,
      true,
      ["What would need to be true for you to revisit that call?"],
    ],
    [
      "IP11",
      "How would you distinguish a real industry problem from an attractive technology solution?",
      0,
      true,
    ],
    [
      "IP12",
      "How would you determine whether OpenTable creates incremental revenue rather than capturing existing demand?",
      0,
      true,
      ["What data would you need?", "What would falsify incrementality?"],
    ],
  ];
  return items.map(([key, title, priority, pin, probes = []]) =>
    q(key, {
      category: cat,
      title,
      navigationLabel: title.length > 48 ? `${title.slice(0, 45)}…` : title,
      priority,
      suggestedPinned: pin,
      answerStatus: "needs_gpt_draft",
      evidenceStatus: "hypothesis",
      backlogType: "industry_pov",
      aliases: key === "IP12" ? ["incremental revenue", "demand capture"] : [],
      followUps: probes.map((question) => ({ question, answer: "" })),
      accuracyNote:
        key === "IP05"
          ? "Ground claims in public OpenTable product pages; label hypotheses."
          : "Preparation hypothesis — not a confirmed interview question.",
    })
  );
}

export function buildIndustryReferenceQuestion(q) {
  return q("IP-REF", {
    category: "Industry POV & Strategic Judgment",
    title: "Industry reference — five pain points & priority ranking",
    navigationLabel: "Industry reference (5 pain points)",
    priority: 2,
    recordType: "industry_reference",
    answerStatus: "needs_gpt_draft",
    evidenceStatus: "reference",
    backlogType: "industry_reference",
    accuracyNote: "Reference scaffold — verify trends; label unsupported hypotheses.",
    industryReference: {
      disclaimer:
        "Public-source scaffold for GPT authoring. Hypotheses marked [H] require verification before interview.",
      painPoints: [
        {
          id: 1,
          name: "Thin margins & volatile demand",
          segments: ["Independents", "Full-service", "Seasonal venues"],
          evidence: "Industry reports cite labor, food cost, and demand volatility post-pandemic [verify current stats].",
          commercialConsequence: "Operators optimize short-term covers over long-term platform fees.",
          opentableCapabilities: "Demand generation, pacing, marketing tools, guest CRM.",
          underserved: "[H] Profitability-aware recommendations vs raw booking volume.",
          metrics: ["RevPASH", "Contribution margin", "Cover mix"],
          tradeoffs: "More bookings may not improve profit if discount-driven.",
        },
        {
          id: 2,
          name: "No-shows & late cancellations",
          segments: ["High-demand urban", "Tasting menus", "Small seat counts"],
          evidence: "OpenTable publishes no-show reduction features (deposits, confirmations) — existing product surface.",
          commercialConsequence: "Empty tables, staff idle, food waste.",
          opentableCapabilities: "Deposits, reminders, Table Automations (verify current scope).",
          underserved: "[H] Targeted policies by segment without hurting conversion.",
          metrics: ["Show rate", "Recovered covers", "Cancellation lead time"],
          tradeoffs: "Deposits vs conversion (see SC01).",
        },
        {
          id: 3,
          name: "Labor & service capacity constraints",
          segments: ["Independent", "Fine dining", "Understaffed peaks"],
          evidence: "Turn time and staffing pressure widely reported in hospitality press [verify].",
          commercialConsequence: "Cannot absorb unlimited demand even if marketing succeeds.",
          opentableCapabilities: "Turn Times / Availability Insights (existing — extensions not reinvention).",
          underserved: "[H] Capacity-aware demand shaping vs blunt discounts.",
          metrics: ["Table turn time", "Seat utilization", "Guest satisfaction"],
          tradeoffs: "Faster turns vs experience (see SC02).",
        },
        {
          id: 4,
          name: "Guest acquisition cost & platform dependence",
          segments: ["New independents", "Competitive markets"],
          evidence: "Operators debate incremental vs cannibalized demand [H — validate with OT/partner research].",
          commercialConsequence: "Skepticism of platform ROI; churn from restaurant product.",
          opentableCapabilities: "Discovery, network, marketing, data on diner behavior.",
          underserved: "Transparent incrementality measurement for operators.",
          metrics: ["Incremental covers", "Repeat rate", "Cost per incremental guest"],
          tradeoffs: "Marketplace growth vs partner trust (see SC06, SC08).",
        },
        {
          id: 5,
          name: "Operational complexity of revenue levers",
          segments: ["Multi-location groups", "Operators without revenue management staff"],
          evidence: "Revenue management maturity varies; tech adoption uneven [H].",
          commercialConsequence: "Low adoption of sophisticated features including AI recommendations.",
          opentableCapabilities: "Automations, insights, POS integrations (verify).",
          underserved: "[H] Simple operator workflows with explainable recommendations.",
          metrics: ["Feature adoption", "Operator NPS", "Revenue per active location"],
          tradeoffs: "Automation vs operator autonomy (see SC04).",
        },
      ],
      proposedPriorityRanking: [
        "1. Incrementality & trust (IP12, SC06) — without it, other levers stall.",
        "2. No-show / cancellation economics (SC01) — direct P&L, existing hooks.",
        "3. Capacity-aware utilization (SC02) — links demand to operations.",
        "4. Segmented operator tooling (IP09) — independents vs groups.",
        "5. AI where economics proven (IP07/IP08) — not hype-first.",
      ],
      sourcesToVerify: [
        "https://www.opentable.com/restaurant-solutions/product-innovation/",
        "https://www.opentable.com/blog/press/page/summer-product-launch/",
        "Independent hospitality / NRA-style trend reports (verify dates)",
      ],
    },
  });
}

function scenario(q, key, fields) {
  return q(key, {
    category: "Live Product Scenarios",
    recordType: "scenario",
    answerStatus: "needs_gpt_draft",
    evidenceStatus: "illustrative_scenario",
    backlogType: "live_scenario",
    accuracyNote: "Illustrative numbers and facts — not OpenTable internal data.",
    followUps: [],
    ...fields,
  });
}

export function buildLiveScenarios(q) {
  return [
    scenario(q, "SC01", {
      title: "Deposits cut no-shows but booking conversion drops",
      navigationLabel: "Scenario: deposits vs conversion",
      priority: 0,
      suggestedPinned: true,
      aliases: ["no-show", "deposits", "conversion"],
      scenario: {
        originalQuestion:
          "We rolled out optional deposits for high-risk slots. No-shows fell sharply, but overall booking conversion is down. What do you do?",
        illustrativeData:
          "Illustrative: no-shows −35%, conversion −12% overall, −18% on new guests [illustrative].",
        initialPovPrompt: "State whether you keep, redesign, or roll back deposits — and for whom.",
        structuredGuide: SCENARIO_JUDGMENT_FRAMEWORK.steps.map((s) => s.label).join(" → "),
        unexpectedTwist:
          "Legal/compliance says you cannot charge deposits for certain reservation types in a key market starting next quarter.",
        followUpProbes: [
          "Which segments should keep deposits vs alternatives (card hold, messaging)?",
          "How do you measure incremental profit, not just show rate?",
          "What second-order effects hit guest acquisition or support?",
        ],
        assessedSkills: ["Product judgment", "Commercial reasoning", "Constraint adaptation"],
        answerFramework: SCENARIO_JUDGMENT_FRAMEWORK.steps.map((s) => s.label),
        primaryMetric: "Incremental restaurant profit per service period",
        guardrailMetrics: ["Booking conversion", "Guest complaints", "New diner share"],
        commonMistakes: [
          "Optimizing show rate alone while ignoring conversion and acquisition.",
          "Uniform policy instead of segmentation.",
          "UI tricks instead of changing the product promise when deposits are disallowed.",
        ],
      },
    }),
    scenario(q, "SC02", {
      title: "Faster turns raise covers but hurt experience scores",
      navigationLabel: "Scenario: turns vs experience",
      priority: 0,
      suggestedPinned: true,
      scenario: {
        originalQuestion:
          "A feature nudges parties to order before seated and shortens default table duration. Covers are up, but satisfaction and tips are down. How do you respond?",
        unexpectedTwist:
          "Top operators say they'll disable the feature unless you prove it doesn't harm brand reputation.",
        followUpProbes: [
          "How do you segment restaurants where this helps vs hurts?",
          "What operational signals would you monitor beyond covers?",
          "Would you change the promise from 'more covers' to something else?",
        ],
        assessedSkills: ["Second-order thinking", "Marketplace balance", "Metrics"],
        primaryMetric: "RevPASH with stable or improving guest satisfaction",
        guardrailMetrics: ["NPS / ratings", "Repeat diners", "Staff feedback"],
        commonMistakes: ["Maximizing turns without capacity or experience guardrails."],
      },
    }),
    scenario(q, "SC03", {
      title: "More reservations, flat profitability",
      navigationLabel: "Scenario: bookings up, profit flat",
      priority: 0,
      suggestedPinned: true,
      scenario: {
        originalQuestion:
          "Dashboards show reservation volume up 15% [illustrative] but operators report flat profit. What's your diagnosis and plan?",
        unexpectedTwist:
          "Data science says uplift is real on covers but average check and mix shifted toward promos.",
        followUpProbes: [
          "How do you separate incremental vs cannibalized covers?",
          "What would you stop doing if promos drive volume not profit?",
        ],
        assessedSkills: ["Analytical rigor", "Proxy vs economic outcomes"],
        primaryMetric: "Incremental contribution margin",
        guardrailMetrics: ["Average check", "Promo mix", "Repeat rate"],
        commonMistakes: ["Celebrating booking volume as revenue success."],
      },
    }),
    scenario(q, "SC04", {
      title: "Accurate AI model, poor operator adoption",
      navigationLabel: "Scenario: AI accuracy, low adoption",
      priority: 0,
      suggestedPinned: true,
      aliases: ["AI adoption", "operator trust"],
      scenario: {
        originalQuestion:
          "Your pacing recommendation model beats benchmarks in backtests, but only 8% of operators act on suggestions [illustrative]. Next step?",
        unexpectedTwist:
          "Operators say suggestions feel like OpenTable optimizing for marketplace fees, not their floor.",
        followUpProbes: [
          "What would you change in the product vs the model first?",
          "How do you test trust and explainability?",
        ],
        assessedSkills: ["AI/ML product judgment", "Trust", "Go-to-market"],
        primaryMetric: "Adopted recommendations driving incremental margin",
        guardrailMetrics: ["Override rate", "Operator satisfaction", "Support tickets"],
        commonMistakes: ["Shipping more model accuracy before workflow and trust."],
      },
    }),
    scenario(q, "SC05", {
      title: "Privacy rule removes guest-level data before launch",
      navigationLabel: "Scenario: privacy constraint",
      priority: 0,
      suggestedPinned: true,
      scenario: {
        originalQuestion:
          "You're two sprints from launch on personalized off-peak offers. Legal says you must drop guest-level attributes you relied on for targeting.",
        unexpectedTwist:
          "Sales already promised the capability to key restaurant groups.",
        followUpProbes: [
          "Do you ship, delay, or rescope — and how do you message each?",
          "What aggregate-level alternative is honest about limitations?",
        ],
        assessedSkills: ["Constraint adaptation", "Leadership", "Product promise"],
        primaryMetric: "Incremental off-peak margin (segment-level if needed)",
        guardrailMetrics: ["Compliance", "Partner trust", "Conversion"],
        commonMistakes: [
          "Cosmetic UI launch without changing the value proposition.",
          "Ignoring sales promise — escalate decision rights early.",
        ],
      },
    }),
    scenario(q, "SC06", {
      title: "Operator doubts OpenTable incrementality",
      navigationLabel: "Scenario: incrementality skepticism",
      priority: 0,
      suggestedPinned: true,
      scenario: {
        originalQuestion:
          "A flagship partner says OpenTable fills tables they would have filled anyway. How do you investigate and respond product-wise?",
        unexpectedTwist:
          "Their POS data integration breaks; you lose the cleanest read on walk-ins vs platform covers.",
        followUpProbes: [
          "What experiment or holdout would you propose?",
          "What do you stop claiming in product marketing until proven?",
        ],
        assessedSkills: ["Commercial reasoning", "Experiment design", "Trust"],
        primaryMetric: "Verified incremental covers or margin",
        guardrailMetrics: ["Retention", "Churn risk", "Support load"],
        commonMistakes: ["Defending with aggregate marketplace stats only."],
      },
    }),
    scenario(q, "SC07", {
      title: "Operators want revenue now, not more AI",
      navigationLabel: "Scenario: AI vs immediate revenue",
      priority: 1,
      suggestedPinned: false,
      scenario: {
        originalQuestion:
          "Leadership wants an AI roadmap headline; restaurant council wants practical tools that move profit this quarter.",
        unexpectedTwist:
          "Engineering capacity only allows one major bet for the next two quarters.",
        followUpProbes: [
          "What non-AI bet might deliver faster incremental margin?",
          "When would you still choose AI?",
        ],
        assessedSkills: ["Prioritization", "Strategic judgment"],
        primaryMetric: "Incremental operator profit within two quarters",
        guardrailMetrics: ["Adoption", "Technical debt", "Partner NPS"],
        commonMistakes: ["AI for AI's sake without operator workflow fit."],
      },
    }),
    scenario(q, "SC08", {
      title: "Marketplace win for diners hurts some restaurants",
      navigationLabel: "Scenario: diner benefit, partner harm",
      priority: 0,
      suggestedPinned: true,
      scenario: {
        originalQuestion:
          "A discovery change lifts diner conversion and total bookings, but long-tail restaurants see fewer high-value slots filled.",
        unexpectedTwist:
          "Internal metric review shows aggregate GMV up while partner complaints spike.",
        followUpProbes: [
          "How do you define fairness in a two-sided marketplace?",
          "What guardrails or segmentation would you add?",
        ],
        assessedSkills: ["Marketplace thinking", "Systems thinking"],
        primaryMetric: "Sustainable partner retention weighted by economic value",
        guardrailMetrics: ["Diner conversion", "Complaints", "Slot quality by segment"],
        commonMistakes: ["Optimizing diner funnel only."],
      },
    }),
    scenario(q, "SC09", {
      title: "Experiment wins proxy metric, not revenue",
      navigationLabel: "Scenario: proxy metric win",
      priority: 1,
      suggestedPinned: false,
      scenario: {
        originalQuestion:
          "An A/B test shows +9% [illustrative] on 'optimization score' but flat seated revenue in treatment restaurants.",
        unexpectedTwist:
          "The team wants to ship because the score correlates with engagement in other products.",
        followUpProbes: [
          "What would convince you to ship or kill?",
          "How do you redesign the experiment?",
        ],
        assessedSkills: ["Experimentation", "Metric discipline"],
        primaryMetric: "Incremental seated revenue or margin",
        guardrailMetrics: ["Operator overrides", "Guest experience", "Support"],
        commonMistakes: ["Shipping correlated proxies as success."],
      },
    }),
    scenario(q, "SC10", {
      title: "Integration loss blocks forecasting launch",
      navigationLabel: "Scenario: data source unavailable",
      priority: 1,
      suggestedPinned: false,
      scenario: {
        originalQuestion:
          "Demand forecast MVP depends on POS cover data; a major integration partner pauses API access indefinitely.",
        unexpectedTwist:
          "Sales committed launch dates to enterprise groups already.",
        followUpProbes: [
          "What degraded mode is honest to operators?",
          "Pause vs ship — decision criteria?",
        ],
        assessedSkills: ["Technical judgment", "Constraint adaptation"],
        primaryMetric: "Forecast accuracy where used + operator trust",
        guardrailMetrics: ["False positive recommendations", "Churn"],
        commonMistakes: ["Launching with hidden uncertainty."],
      },
    }),
  ];
}

export function buildBattlecard() {
  return {
    title: "Bristol interview battlecard",
    subtitle: "Fast reference — preparation only, not confirmed questions.",
    sections: [
      {
        id: "stories",
        heading: "3 strongest transferable stories",
        bullets: [
          "B40 — RBC Interac cashback withdrawals (complex launch, ops, risk)",
          "B43 — Arc'teryx membership 0-to-1 (scope, exec alignment, trade-offs)",
          "B42 or B45 — HBC commercial / ShopPlus discovery (metrics, incrementality lesson)",
        ],
      },
      {
        id: "pain",
        heading: "5 industry pain points (see IP-REF)",
        bullets: [
          "Thin margins & volatile demand",
          "No-shows / cancellations",
          "Labor & capacity limits",
          "Platform dependence & incrementality skepticism",
          "Operational complexity of revenue levers",
        ],
      },
      {
        id: "opportunities",
        heading: "Top 3 strategic hypotheses [author with GPT]",
        bullets: [
          "[H] Incrementality measurement & operator trust (SC06)",
          "[H] Segmented no-show / deposit policies (SC01)",
          "[H] Capacity-aware demand shaping — extend existing Turn Times/Insights",
        ],
      },
      {
        id: "metrics",
        heading: "Core revenue metrics",
        bullets: [
          "RevPASH — revenue per available seat-hour",
          "Show rate & recovered covers",
          "Incremental margin vs total covers",
          "Table utilization / turn time (with experience guardrails)",
          "Operator adoption & retention",
        ],
      },
      {
        id: "ai",
        heading: "AI/ML: credible vs skip ML",
        bullets: [
          "Credible: pacing, demand shaping, no-show risk — with operator control",
          "Skip ML when: rules suffice, data thin, trust low, economics unproven",
          "Always: offline + online eval, guardrails, human override",
        ],
      },
      {
        id: "scenarios",
        heading: "6 P0 scenario entry points",
        bullets: ["SC01", "SC02", "SC03", "SC04", "SC05", "SC06", "SC08"],
      },
      {
        id: "framework",
        heading: "6-step judgment framework",
        bullets: SCENARIO_JUDGMENT_FRAMEWORK.steps.map((s) => `${s.label}: ${s.detail}`),
      },
      {
        id: "jaz",
        heading: "Avoid (from Jaz interview)",
        bullets: SCENARIO_JUDGMENT_FRAMEWORK.jazMistakesToAvoid,
      },
    ],
  };
}

export function buildWeaknessTracker() {
  return [
    {
      skill: "Problem-first industry framing",
      jazEvidence: "Banking pain-point answer listed competitors/opportunities without a sharp customer problem.",
      opentableEquivalent: "IP02, IP06, IP-REF — restaurant economics before features",
      coverage: "New Industry POV category",
      priority: "P0",
      missing: "GPT answers for IP01–IP12",
      practice: "IP03 + IP10 aloud with forced ranking",
    },
    {
      skill: "Decisive strategic prioritization",
      jazEvidence: "Needed clearer 'I would prioritize X because…' with trade-offs.",
      opentableEquivalent: "IP03, IP10, B07, SC07",
      coverage: "Partial — structure added",
      priority: "P0",
      missing: "Authored prioritization narratives",
      practice: "Battlecard opportunities + defend deprioritization",
    },
    {
      skill: "Adapting to unexpected constraints",
      jazEvidence: "48-hour hold — focused on pending UX vs changing product promise.",
      opentableEquivalent: "SC01, SC05, SC10",
      coverage: "Live Scenarios with twists",
      priority: "P0",
      missing: "Practiced spoken answers",
      practice: "SC05 twist drill: rescope vs delay",
    },
    {
      skill: "Proxy vs economic outcomes",
      jazEvidence: "Instant experience vs regulatory reality.",
      opentableEquivalent: "SC03, SC09, B30, IP12",
      coverage: "Scenarios + metrics questions",
      priority: "P0",
      missing: "GPT metric answers",
      practice: "SC09 ship/kill decision aloud",
    },
    {
      skill: "Second-order consequences",
      jazEvidence: "Underweighted downstream customer impact.",
      opentableEquivalent: "SC02, SC08, follow-ups on profitability/trust",
      coverage: "Scenario follow-up probes",
      priority: "P0",
      missing: "Habit in answers",
      practice: "After each scenario, state 2 second-order effects",
    },
    {
      skill: "Concise, direct answers",
      jazEvidence: "Longer exploratory answers under time pressure.",
      opentableEquivalent: "All P0 — use 10s POV + 45–75s structure",
      coverage: "Framework in UI",
      priority: "P1",
      missing: "Rehearsal",
      practice: "Timer drills on SC01/SC06",
    },
    {
      skill: "Product leadership philosophy",
      jazEvidence: "Asked what you love / frustrates about PM.",
      opentableEquivalent: "B59, B60",
      coverage: "Questions added — answers missing",
      priority: "P1",
      missing: "GPT personal answers (no fabricated stories)",
      practice: "Draft from authentic experience only",
    },
  ];
}

export function buildUpdatedP0Prediction() {
  return {
    disclaimer: "Predicted preparation focus — not confirmed Bristol questions. Balances experience proof, industry POV, and scenario judgment.",
    p0: [
      { id: "B40", area: "experience_proof", reason: "Complex shipped product with measurable outcome" },
      { id: "B43", area: "experience_proof", reason: "0-to-1 under ambiguity" },
      { id: "B06", area: "experience_proof", reason: "JD ML requirement — honest gap framing" },
      { id: "IP02", area: "industry_pov", reason: "Operator pain points — decisive framing" },
      { id: "IP03", area: "industry_pov", reason: "Prioritization with defense" },
      { id: "IP06", area: "industry_pov", reason: "Beyond more bookings" },
      { id: "IP12", area: "industry_pov", reason: "Incrementality — marketplace trust" },
      { id: "SC01", area: "scenario_judgment", reason: "Constraint + proxy vs profit" },
      { id: "SC05", area: "scenario_judgment", reason: "Change product promise under constraint" },
      { id: "SC06", area: "scenario_judgment", reason: "Incrementality skepticism" },
      { id: "B17", area: "ai_strategy", reason: "JD 0-to-1 AI vision without overclaim" },
      { id: "IP08", area: "ai_strategy", reason: "Overhyped AI — judgment" },
      { id: "B59", area: "philosophy", reason: "Personal motivation (Jaz pattern)" },
    ],
  };
}

export function buildWeaknessTrackerMd(rows) {
  const lines = [
    "# OpenTable — Bristol — Weakness tracker (from Jaz interview)",
    "",
    "| Skill | Jaz evidence | OpenTable equivalent | Coverage | Priority | Missing | Practice |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map(
      (r) =>
        `| ${r.skill} | ${String(r.jazEvidence).replace(/\|/g, "\\|")} | ${r.opentableEquivalent} | ${r.coverage} | ${r.priority} | ${r.missing} | ${r.practice} |`
    ),
    "",
  ];
  return lines.join("\n");
}

export function buildP0Md(prediction) {
  return [
    "# OpenTable — Bristol — P0 prediction (post–Jaz addendum)",
    "",
    prediction.disclaimer,
    "",
    ...prediction.p0.map((b) => `- **${b.id}** [${b.area}] — ${b.reason}`),
    "",
    "_Predicted preparation focus — not confirmed interview questions._",
    "",
  ].join("\n");
}

/** Live product-sense flow: maps the doc’s A–E tables onto the spoken framework. */

export type ProductSenseJourneyStepId =
  | "clarify"
  | "user"
  | "problem"
  | "solutions"
  | "prioritize"
  | "measure";

export type ProductSenseJourneyStep = {
  id: ProductSenseJourneyStepId;
  label: string;
  livePrompt: string;
  /** Cheat sheet section ids from product-sense-cheat-sheet.json */
  sectionIds: string[];
  showSegments?: boolean;
  showIntro?: boolean;
};

export const PRODUCT_SENSE_JOURNEY_STEPS: ProductSenseJourneyStep[] = [
  {
    id: "clarify",
    label: "Clarify",
    livePrompt: "What decision are we being asked to make? Scope, constraints, success.",
    sectionIds: [],
    showIntro: true,
  },
  {
    id: "user",
    label: "User",
    livePrompt: "Who is the customer? Pick one segment — don’t design for everyone.",
    sectionIds: [],
    showSegments: true,
  },
  {
    id: "problem",
    label: "Problem",
    livePrompt:
      "Where is the customer in the journey? Pick the problem — solutions, metrics, and guardrails load together.",
    sectionIds: ["problems"],
  },
  {
    id: "solutions",
    label: "Solutions",
    livePrompt: "What levers could we pull? Ideas before commitment.",
    sectionIds: ["solutions"],
  },
  {
    id: "prioritize",
    label: "Prioritize",
    livePrompt: "What do we build first? Impact, risk, time to value.",
    sectionIds: ["prioritize"],
  },
  {
    id: "measure",
    label: "Measure",
    livePrompt: "How do we know it worked? Metrics, guardrails, experiments.",
    sectionIds: ["metrics", "experiments"],
  },
];

/** Questbank-oriented funnel — aligns with starred metrics in the cheat sheet. */
export const QUESTBANK_CUSTOMER_FUNNEL = [
  { id: "acquire", label: "Acquire", metricHint: "Qualified signups" },
  { id: "onboard", label: "Onboard", metricHint: "First value / verification" },
  { id: "activate", label: "Activate", metricHint: "First meaningful action ★" },
  { id: "direct-deposit", label: "Direct deposit", metricHint: "Recurring payroll ★" },
  { id: "primary", label: "Primary bank", metricHint: "Primary usage threshold ★" },
] as const;

export function funnelStepToJourney(
  funnelId: (typeof QUESTBANK_CUSTOMER_FUNNEL)[number]["id"]
): ProductSenseJourneyStepId {
  switch (funnelId) {
    case "acquire":
    case "onboard":
      return "user";
    case "activate":
    case "direct-deposit":
    case "primary":
      return "measure";
    default:
      return "problem";
  }
}

/** Customer journey stages for mapping Section A problems (cheat sheet categories). */
export type JourneyProblemStageId =
  | "discover"
  | "decide-open"
  | "onboard"
  | "first-value"
  | "switch-deepen"
  | "everyday";

export type JourneyProblemStage = {
  id: JourneyProblemStageId;
  label: string;
  journeyMoment: string;
  /** Matches cheat sheet “Problem category” (without ★). */
  problemCategories: string[];
};

export const JOURNEY_PROBLEM_STAGES: JourneyProblemStage[] = [
  {
    id: "discover",
    label: "Discover",
    journeyMoment: "Learning Questbank exists and what it’s for",
    problemCategories: ["Awareness", "Discoverability", "Unclear value"],
  },
  {
    id: "decide-open",
    label: "Decide & open",
    journeyMoment: "Choosing to sign up and start an application",
    problemCategories: ["Unclear value", "Trust", "Privacy concerns"],
  },
  {
    id: "onboard",
    label: "Onboard",
    journeyMoment: "Verification, funding, reaching first value",
    problemCategories: ["Onboarding friction", "Poor accessibility", "Low confidence", "Low motivation"],
  },
  {
    id: "first-value",
    label: "First value",
    journeyMoment: "First deposit, card use, or meaningful transaction",
    problemCategories: ["Trust", "Uncertainty", "Unreliable performance", "Recovery friction"],
  },
  {
    id: "switch-deepen",
    label: "Switch & deepen",
    journeyMoment: "Payroll, bills, moving activity from another bank",
    problemCategories: ["Switching costs", "Low confidence", "Unexpected costs"],
  },
  {
    id: "everyday",
    label: "Everyday banking",
    journeyMoment: "Ongoing balances, payments, control, returning weekly",
    problemCategories: [
      "Fragmentation",
      "Lack of clarity",
      "Uncertainty",
      "Lack of control",
      "High cognitive load",
      "Unexpected costs",
      "Habit formation",
      "Poor personalization",
      "Collaboration gaps",
    ],
  },
];

export type JourneyProblemCard = {
  category: string;
  problem: string;
  intervention: string;
  priority: boolean;
  stageIds: JourneyProblemStageId[];
};

export function normalizeProblemCategory(category: string): string {
  return category.replace(/\s*★\s*/g, "").trim();
}

/** Build journey-staged problem cards from cheat sheet rows; duplicates allowed across stages. */
export function buildJourneyProblemCards(
  rows: string[][]
): { stages: JourneyProblemStage[]; cardsByStage: Record<JourneyProblemStageId, JourneyProblemCard[]> } {
  const cardsByStage = Object.fromEntries(
    JOURNEY_PROBLEM_STAGES.map((s) => [s.id, [] as JourneyProblemCard[]])
  ) as Record<JourneyProblemStageId, JourneyProblemCard[]>;

  for (const [category, problem, intervention] of rows) {
    const norm = normalizeProblemCategory(category);
    const priority = /★|\u2605/.test(category);
    const card: Omit<JourneyProblemCard, "stageIds"> = {
      category,
      problem,
      intervention,
      priority,
    };
    for (const stage of JOURNEY_PROBLEM_STAGES) {
      if (stage.problemCategories.some((c) => normalizeProblemCategory(c) === norm)) {
        cardsByStage[stage.id].push({ ...card, stageIds: [stage.id] });
      }
    }
  }

  return { stages: JOURNEY_PROBLEM_STAGES, cardsByStage };
}

export function funnelIdToProblemStage(
  funnelId: (typeof QUESTBANK_CUSTOMER_FUNNEL)[number]["id"]
): JourneyProblemStageId {
  switch (funnelId) {
    case "acquire":
      return "decide-open";
    case "onboard":
      return "onboard";
    case "activate":
      return "first-value";
    case "direct-deposit":
      return "switch-deepen";
    case "primary":
      return "everyday";
    default:
      return "discover";
  }
}

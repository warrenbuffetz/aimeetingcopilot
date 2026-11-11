import type { CheatSheetSection } from "@/lib/questrade-jaz-interview/product-sense-cheat-sheet";
import { normalizeProblemCategory } from "@/lib/questrade-jaz-interview/product-sense-journey";

export type SolutionLever = { lever: string; examples: string };

export type MetricRow = {
  objective: string;
  primary: string;
  leading: string;
  guardrails: string;
};

export type GuardrailRow = { dimension: string; guardrails: string };

export type ProblemBundle = {
  category: string;
  problem: string;
  intervention: string;
  priority: boolean;
  solutions: SolutionLever[];
  metrics: MetricRow[];
  universalGuardrails: GuardrailRow[];
};

/** Curated links from cheat sheet problem categories → levers, objectives, guardrail dimensions. */
export const PROBLEM_LINKS_PUBLIC: Record<
  string,
  { solutions: string[]; objectives: string[]; guardrailDims: string[] }
> = {
  Awareness: {
    solutions: ["Education", "Better discovery"],
    objectives: ["Acquisition", "Feature adoption"],
    guardrailDims: ["Customer experience"],
  },
  Discoverability: {
    solutions: ["Better discovery", "Simplification"],
    objectives: ["Feature adoption", "Conversion"],
    guardrailDims: ["Customer experience"],
  },
  "Onboarding friction": {
    solutions: ["Simplification", "Automation", "Education"],
    objectives: ["Onboarding", "Activation"],
    guardrailDims: ["Customer experience", "Operational efficiency"],
  },
  "Unclear value": {
    solutions: ["Education", "Transparency", "Personalization"],
    objectives: ["Acquisition", "Conversion", "Activation"],
    guardrailDims: ["Customer experience", "Trust"],
  },
  Trust: {
    solutions: ["Transparency", "Trust-building", "Education"],
    objectives: ["Activation", "Direct deposit", "Primary banking", "Trust"],
    guardrailDims: ["Trust", "Payment integrity", "Reliability"],
  },
  "Switching costs": {
    solutions: ["Reduced switching friction", "Automation", "Education"],
    objectives: ["Direct deposit", "Primary banking", "Onboarding"],
    guardrailDims: ["Customer experience", "Trust"],
  },
  Fragmentation: {
    solutions: ["Integration", "Simplification", "Intelligent assistance"],
    objectives: ["Primary banking", "Engagement", "Financial insights"],
    guardrailDims: ["Customer experience"],
  },
  "Lack of clarity": {
    solutions: ["Transparency", "Simplification", "Education"],
    objectives: ["Account understanding", "Transaction activity"],
    guardrailDims: ["Trust", "Customer experience"],
  },
  Uncertainty: {
    solutions: ["Transparency", "Proactive assistance", "Reliability improvements", "Self-service"],
    objectives: ["Money movement", "Account understanding", "Transaction activity"],
    guardrailDims: ["Reliability", "Payment integrity", "Trust"],
  },
  "Lack of control": {
    solutions: ["Proactive assistance", "Personalization", "Intelligent assistance"],
    objectives: ["Engagement", "Retention", "Transaction activity"],
    guardrailDims: ["Customer experience"],
  },
  "Unexpected costs": {
    solutions: ["Transparency", "Proactive assistance"],
    objectives: ["Trust", "Retention", "Revenue"],
    guardrailDims: ["Trust", "Compliance"],
  },
  "High cognitive load": {
    solutions: ["Simplification", "Education", "Intelligent assistance"],
    objectives: ["Account understanding", "Engagement"],
    guardrailDims: ["Customer experience", "Inclusion / accessibility"],
  },
  "Poor personalization": {
    solutions: ["Personalization", "Intelligent assistance", "Education"],
    objectives: ["Engagement", "Financial insights", "Feature adoption"],
    guardrailDims: ["Privacy", "Customer experience"],
  },
  "Habit formation": {
    solutions: ["Proactive assistance", "Incentives", "Personalization"],
    objectives: ["Engagement", "Retention", "Primary banking"],
    guardrailDims: ["Customer retention", "Communications"],
  },
  "Low motivation": {
    solutions: ["Incentives", "Education", "Proactive assistance"],
    objectives: ["Activation", "Engagement", "Retention"],
    guardrailDims: ["Customer experience"],
  },
  "Poor accessibility": {
    solutions: ["Simplification", "Education"],
    objectives: ["Onboarding", "Conversion"],
    guardrailDims: ["Inclusion / accessibility", "Customer experience"],
  },
  "Collaboration gaps": {
    solutions: ["Collaboration", "Transparency"],
    objectives: ["Engagement", "Retention"],
    guardrailDims: ["Privacy", "Security"],
  },
  "Recovery friction": {
    solutions: ["Self-service", "Reliability improvements", "Proactive assistance"],
    objectives: ["Customer support", "Reliability", "Money movement"],
    guardrailDims: ["Operational efficiency", "Payment integrity"],
  },
  "Privacy concerns": {
    solutions: ["Transparency", "Trust-building", "Education"],
    objectives: ["Trust", "Acquisition"],
    guardrailDims: ["Privacy", "Compliance", "Security"],
  },
  "Low confidence": {
    solutions: ["Trust-building", "Education", "Transparency"],
    objectives: ["Activation", "Direct deposit", "Onboarding"],
    guardrailDims: ["Trust", "Customer experience"],
  },
  "Unreliable performance": {
    solutions: ["Reliability improvements", "Transparency", "Self-service"],
    objectives: ["Reliability", "Money movement", "Transaction activity"],
    guardrailDims: ["Reliability", "Payment integrity"],
  },
};

const PROBLEM_LINKS = PROBLEM_LINKS_PUBLIC;

const DEFAULT_PRIORITIZE_DIMENSIONS = [
  "Customer impact",
  "Reach",
  "Time to value",
  "Risk",
  "Learning potential",
];

const PRIORITIZE_BY_CATEGORY: Record<string, string[]> = {
  Trust: ["Customer impact", "Risk", "Confidence", "Time to value", "Learning potential"],
  "Switching costs": ["Customer impact", "Dependencies", "Time to value", "Risk", "Learning potential"],
  "Onboarding friction": ["Customer impact", "Time to value", "Engineering complexity", "Learning potential"],
  Uncertainty: ["Customer impact", "Risk", "Reversibility", "Learning potential"],
  Fragmentation: ["Customer impact", "Strategic fit", "Engineering complexity", "Learning potential"],
  "Privacy concerns": ["Risk", "Customer impact", "Dependencies", "Reversibility", "Learning potential"],
};

const EXPERIMENT_BY_CATEGORY: Record<string, string> = {
  "Switching costs": "Direct deposit switching is confusing",
  "Onboarding friction": "Onboarding is too long",
  Trust: "Customers distrust payment status",
  Uncertainty: "Customers distrust payment status",
  "Lack of clarity": "Customers don\u2019t understand a feature\u2019s value",
  "Unclear value": "Customers don\u2019t understand a feature\u2019s value",
  Fragmentation: "Users don\u2019t discover financial insights",
  "Habit formation": "Inactive customers need a compelling use case",
  Discoverability: "Users don\u2019t discover financial insights",
};

export type PrioritizeRow = { dimension: string; question: string };

export type ExperimentPattern = {
  hypothesis: string;
  intervention: string;
  successMeasure: string;
  primaryMetricLabel?: string;
  checklist: string;
};

function isPriorityCategory(category: string): boolean {
  return /★|\u2605/.test(category);
}

function findMetricRows(sections: CheatSheetSection[], objectiveNames: string[]): MetricRow[] {
  const metrics = sections.find((s) => s.id === "metrics");
  const table = metrics?.tables?.find((t) => t.id === "objectives");
  if (!table) return [];
  const wanted = new Set(objectiveNames.map((o) => normalizeProblemCategory(o).toLowerCase()));
  const out: MetricRow[] = [];
  for (const row of table.rows) {
    const obj = normalizeProblemCategory(row[0] ?? "");
    const key = obj.toLowerCase();
    const match = [...wanted].some((w) => key.startsWith(w) || w.startsWith(key.split(" ")[0]!));
    if (match && row.length >= 4) {
      out.push({
        objective: row[0]!,
        primary: row[1]!,
        leading: row[2]!,
        guardrails: row[3]!,
      });
    }
  }
  return out;
}

function findSolutionLevers(sections: CheatSheetSection[], leverNames: string[]): SolutionLever[] {
  const sol = sections.find((s) => s.id === "solutions");
  if (!sol?.table) return [];
  const wanted = new Set(leverNames.map((n) => n.toLowerCase()));
  return sol.table.rows
    .filter(([lever]) => wanted.has(lever.toLowerCase()))
    .map(([lever, examples]) => ({ lever, examples: examples ?? "" }));
}

function findUniversalGuardrails(sections: CheatSheetSection[], dimensions: string[]): GuardrailRow[] {
  const metrics = sections.find((s) => s.id === "metrics");
  const table = metrics?.tables?.find((t) => t.id === "guardrails");
  if (!table) return [];
  const wanted = new Set(dimensions.map((d) => d.toLowerCase()));
  return table.rows
    .filter(([dim]) => {
      const d = (dim ?? "").trim();
      if (!d || d.startsWith("For a banking") || d.includes("C. Common product")) return false;
      return wanted.has(d.toLowerCase());
    })
    .map(([dimension, guardrails]) => ({ dimension: dimension!, guardrails: guardrails ?? "" }));
}

export function getPrioritizeRowsForBundle(category: string, sections: CheatSheetSection[]): PrioritizeRow[] {
  const norm = normalizeProblemCategory(category);
  const wanted = new Set(
    (PRIORITIZE_BY_CATEGORY[norm] ?? DEFAULT_PRIORITIZE_DIMENSIONS).map((d) => d.toLowerCase())
  );
  const section = sections.find((s) => s.id === "prioritize");
  const rows = section?.table?.rows ?? [];
  const out: PrioritizeRow[] = [];
  for (const [dimension, question] of rows) {
    if (dimension && wanted.has(dimension.toLowerCase())) {
      out.push({ dimension, question: question ?? "" });
    }
  }
  if (out.length === 0) {
    for (const [dimension, question] of rows.slice(0, 5)) {
      out.push({ dimension: dimension!, question: question ?? "" });
    }
  }
  return out;
}

export function getExperimentPatternForBundle(
  category: string,
  problem: string,
  bundle: Pick<ProblemBundle, "solutions" | "metrics">,
  sections: CheatSheetSection[]
): ExperimentPattern {
  const norm = normalizeProblemCategory(category);
  const table = sections.find((s) => s.id === "experiments")?.table;
  const footnote =
    sections.find((s) => s.id === "experiments")?.footnotes?.[0] ??
    "Eligibility, randomization unit, primary metric, guardrails, duration, unintended effects.";

  const needle =
    EXPERIMENT_BY_CATEGORY[norm] ??
    (problem.toLowerCase().includes("payroll") || problem.toLowerCase().includes("bill")
      ? "Direct deposit switching is confusing"
      : problem.toLowerCase().includes("onboard")
        ? "Onboarding is too long"
        : problem.toLowerCase().includes("payment") || problem.toLowerCase().includes("status")
          ? "Customers distrust payment status"
          : "Customers don\u2019t understand a feature\u2019s value");

  let hypothesis = "";
  let intervention = "";
  let successMeasure = "";

  for (const row of table?.rows ?? []) {
    const colB = row[1] ?? "";
    if (colB.includes(needle) || needle.includes(colB.slice(0, 20))) {
      successMeasure = row[0] ?? "";
      hypothesis = colB;
      intervention = row[2] ?? bundle.solutions[0]?.examples ?? "";
      break;
    }
  }

  if (!hypothesis) {
    hypothesis = problem;
    intervention = bundle.solutions[0]
      ? `${bundle.solutions[0].lever}: ${bundle.solutions[0].examples.split(",")[0]?.trim()}`
      : "Smaller test before a full build";
    successMeasure = bundle.metrics[0]?.primary ?? bundle.metrics[0]?.leading ?? "Primary product metric";
  }

  const topSolution = bundle.solutions[0]?.lever;
  if (topSolution && !intervention.toLowerCase().includes(topSolution.toLowerCase())) {
    intervention = `${topSolution} — ${intervention}`;
  }

  return {
    hypothesis,
    intervention,
    successMeasure,
    primaryMetricLabel: bundle.metrics[0]?.objective,
    checklist: footnote,
  };
}

export function getProblemBundle(
  category: string,
  problem: string,
  intervention: string,
  sections: CheatSheetSection[]
): ProblemBundle {
  const norm = normalizeProblemCategory(category);
  const links = PROBLEM_LINKS[norm] ?? {
    solutions: ["Simplification", "Education", "Transparency"],
    objectives: ["Engagement", "Conversion"],
    guardrailDims: ["Customer experience", "Trust"],
  };
  const priority = isPriorityCategory(category);

  const metrics = findMetricRows(sections, links.objectives);
  const fromMetrics = new Set<string>();
  for (const m of metrics) {
    for (const part of m.guardrails.split(",")) fromMetrics.add(part.trim());
  }

  const universalGuardrails = findUniversalGuardrails(sections, links.guardrailDims);
  if (priority) {
    const extra = findUniversalGuardrails(sections, ["Payment integrity", "Reliability", "Financial risk"]);
    const seen = new Set(universalGuardrails.map((g) => g.dimension));
    for (const g of extra) {
      if (!seen.has(g.dimension)) universalGuardrails.push(g);
    }
  }

  return {
    category,
    problem,
    intervention,
    priority,
    solutions: findSolutionLevers(sections, links.solutions),
    metrics,
    universalGuardrails,
  };
}

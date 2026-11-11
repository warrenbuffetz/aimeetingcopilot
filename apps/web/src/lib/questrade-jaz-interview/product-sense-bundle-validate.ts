import { productSenseCheatSheet } from "@/lib/questrade-jaz-interview/product-sense-cheat-sheet";
import { getProblemBundle } from "@/lib/questrade-jaz-interview/product-sense-problem-bundle";
import { normalizeProblemCategory } from "@/lib/questrade-jaz-interview/product-sense-journey";

export function validateStarredProblemBundles(): string[] {
  const issues: string[] = [];
  const sections = productSenseCheatSheet.sections;
  const rows = sections.find((s) => s.id === "problems")?.table?.rows ?? [];

  for (const [category, problem, intervention] of rows) {
    if (!/★|\u2605/.test(category)) continue;
    const bundle = getProblemBundle(category, problem, intervention, sections);
    const norm = normalizeProblemCategory(category);
    if (bundle.solutions.length === 0) {
      issues.push(`${norm}: no mapped solutions`);
    }
    if (bundle.metrics.length === 0) {
      issues.push(`${norm}: no mapped metrics`);
    }
  }

  const guardrailTable = sections.find((s) => s.id === "metrics")?.tables?.find((t) => t.id === "guardrails");
  for (const row of guardrailTable?.rows ?? []) {
    const dim = row[0] ?? "";
    if (dim.includes("C. Common product") || dim.startsWith("For a banking")) {
      issues.push(`guardrails table polluted: ${dim.slice(0, 40)}…`);
    }
  }

  return issues;
}

import { describe, expect, it } from "vitest";
import { productSenseCheatSheet } from "@/lib/questrade-jaz-interview/product-sense-cheat-sheet";
import {
  getExperimentPatternForBundle,
  getPrioritizeRowsForBundle,
  getProblemBundle,
} from "@/lib/questrade-jaz-interview/product-sense-problem-bundle";
import { searchProductSenseCheatSheet } from "@/lib/questrade-jaz-interview/product-sense-search";
import { validateStarredProblemBundles } from "@/lib/questrade-jaz-interview/product-sense-bundle-validate";

describe("product sense search", () => {
  it("finds direct deposit switching problems", () => {
    const hits = searchProductSenseCheatSheet("direct deposit");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.kind === "problem" || h.kind === "metric")).toBe(true);
  });

  it("finds switching costs by category", () => {
    const hits = searchProductSenseCheatSheet("switching costs");
    expect(hits[0]?.kind).toBe("problem");
    expect(hits[0]?.category?.toLowerCase()).toContain("switching");
  });
});

describe("product sense data quality", () => {
  it("starred problems resolve to solutions and metrics; guardrails table is clean", () => {
    expect(validateStarredProblemBundles()).toEqual([]);
  });
});

describe("problem bundle extensions", () => {
  const sections = productSenseCheatSheet.sections;

  it("adds prioritize and experiment for switching costs", () => {
    const bundle = getProblemBundle(
      "Switching costs ★",
      "Changing payroll and bills feels difficult",
      "Guided account switching",
      sections
    );
    expect(bundle.solutions.length).toBeGreaterThan(0);
    expect(bundle.metrics.length).toBeGreaterThan(0);

    const prioritize = getPrioritizeRowsForBundle(bundle.category, sections);
    expect(prioritize.map((r) => r.dimension)).toContain("Dependencies");

    const experiment = getExperimentPatternForBundle(bundle.category, bundle.problem, bundle, sections);
    expect(experiment.hypothesis.toLowerCase()).toContain("direct deposit");
    expect(experiment.intervention.length).toBeGreaterThan(5);
  });
});

import { productSenseCheatSheet } from "@/lib/questrade-jaz-interview/product-sense-cheat-sheet";
import {
  buildJourneyProblemCards,
  JOURNEY_PROBLEM_STAGES,
  normalizeProblemCategory,
  type JourneyProblemStageId,
} from "@/lib/questrade-jaz-interview/product-sense-journey";
import { PROBLEM_LINKS_PUBLIC } from "@/lib/questrade-jaz-interview/product-sense-problem-bundle";

function fold(text: string): string {
  return text.toLowerCase().replace(/[’']/g, "'");
}

export type ProductSenseSearchKind = "problem" | "stage" | "solution" | "metric";

export type ProductSenseSearchHit = {
  kind: ProductSenseSearchKind;
  label: string;
  subtitle: string;
  score: number;
  stageId?: JourneyProblemStageId;
  category?: string;
  problem?: string;
  intervention?: string;
  priority?: boolean;
  sectionId?: string;
  leverOrObjective?: string;
};

export type ProductSenseSearchNavigate = Omit<ProductSenseSearchHit, "score" | "subtitle"> & {
  subtitle?: string;
};

function scoreContains(hay: string, q: string): number {
  const h = fold(hay);
  if (!h.includes(q)) return 0;
  if (fold(hay) === q) return 80;
  if (h.startsWith(q)) return 60;
  return 40;
}

function categoriesForLever(lever: string): string[] {
  const key = lever.toLowerCase();
  return Object.entries(PROBLEM_LINKS_PUBLIC)
    .filter(([, v]) => v.solutions.some((s) => s.toLowerCase() === key))
    .map(([cat]) => cat);
}

function categoriesForObjective(objective: string): string[] {
  const key = objective.toLowerCase();
  return Object.entries(PROBLEM_LINKS_PUBLIC)
    .filter(([, v]) => v.objectives.some((o) => o.toLowerCase() === key || key.startsWith(o.toLowerCase())))
    .map(([cat]) => cat);
}

function firstProblemForCategory(
  cardsByStage: ReturnType<typeof buildJourneyProblemCards>["cardsByStage"],
  category: string
): { stageId: JourneyProblemStageId; hit: ProductSenseSearchHit } | null {
  const norm = normalizeProblemCategory(category);
  for (const stage of JOURNEY_PROBLEM_STAGES) {
    const card = cardsByStage[stage.id].find((c) => normalizeProblemCategory(c.category) === norm);
    if (card) {
      return {
        stageId: stage.id,
        hit: {
          kind: "problem",
          label: `${norm}${card.priority ? " ★" : ""}`,
          subtitle: card.problem,
          score: 0,
          stageId: stage.id,
          category: card.category,
          problem: card.problem,
          intervention: card.intervention,
          priority: card.priority,
        },
      };
    }
  }
  return null;
}

export function searchProductSenseCheatSheet(query: string): ProductSenseSearchHit[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];

  const { sections } = productSenseCheatSheet;
  const problems = sections.find((s) => s.id === "problems");
  const rows = problems?.table?.rows ?? [];
  const { cardsByStage } = buildJourneyProblemCards(rows);

  const hits: ProductSenseSearchHit[] = [];
  const seen = new Set<string>();

  function push(hit: ProductSenseSearchHit) {
    const id = `${hit.kind}:${hit.label}:${hit.problem ?? ""}:${hit.stageId ?? ""}`;
    if (seen.has(id)) return;
    seen.add(id);
    hits.push(hit);
  }

  for (const stage of JOURNEY_PROBLEM_STAGES) {
    const s = scoreContains(`${stage.label} ${stage.journeyMoment}`, q);
    if (s) {
      push({
        kind: "stage",
        label: stage.label,
        subtitle: stage.journeyMoment,
        score: s,
        stageId: stage.id,
      });
    }
    for (const card of cardsByStage[stage.id]) {
      const hay = `${card.category} ${card.problem} ${card.intervention}`;
      const sc = scoreContains(hay, q);
      if (sc) {
        push({
          kind: "problem",
          label: `${normalizeProblemCategory(card.category)}${card.priority ? " ★" : ""}`,
          subtitle: card.problem,
          score: sc + (card.priority ? 8 : 0),
          stageId: stage.id,
          category: card.category,
          problem: card.problem,
          intervention: card.intervention,
          priority: card.priority,
        });
      }
    }
  }

  const sol = sections.find((s) => s.id === "solutions");
  for (const [lever, examples] of sol?.table?.rows ?? []) {
    const sc = scoreContains(`${lever} ${examples}`, q);
    if (!sc) continue;
    const cats = categoriesForLever(lever);
    const resolved = cats[0] ? firstProblemForCategory(cardsByStage, cats[0]) : null;
    if (resolved) {
      push({
        ...resolved.hit,
        kind: "solution",
        label: lever,
        subtitle: `Lever → ${resolved.hit.label}`,
        score: sc,
        sectionId: "solutions",
        leverOrObjective: lever,
      });
    } else {
      push({
        kind: "solution",
        label: lever,
        subtitle: examples.slice(0, 72) + (examples.length > 72 ? "…" : ""),
        score: sc,
        sectionId: "solutions",
        leverOrObjective: lever,
      });
    }
  }

  const metrics = sections.find((s) => s.id === "metrics");
  const objectives = metrics?.tables?.find((t) => t.id === "objectives");
  for (const row of objectives?.rows ?? []) {
    const objective = row[0] ?? "";
    if (!objective || objective.length > 80) continue;
    const sc = scoreContains(`${objective} ${row.slice(1).join(" ")}`, q);
    if (!sc) continue;
    const cats = categoriesForObjective(objective);
    const resolved = cats[0] ? firstProblemForCategory(cardsByStage, cats[0]) : null;
    if (resolved) {
      push({
        ...resolved.hit,
        kind: "metric",
        label: objective,
        subtitle: `Metric → ${resolved.hit.label}`,
        score: sc,
        sectionId: "metrics",
        leverOrObjective: objective,
      });
    } else {
      push({
        kind: "metric",
        label: objective,
        subtitle: row[1] ? `Primary: ${row[1]}` : "Success metrics",
        score: sc,
        sectionId: "metrics",
        leverOrObjective: objective,
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, 20);
}

import { jazInterviewQuestions } from "@/lib/questrade-jaz-interview/dataset";
import {
  normalizeProblemCategory,
  type JourneyProblemStageId,
} from "@/lib/questrade-jaz-interview/product-sense-journey";

export type ProductSensePanelLink = {
  curatedKey: string;
  shortLabel: string;
  questionId: string;
};

const CATEGORY_PANEL_KEYS: Record<string, string[]> = {
  "Switching costs": ["P03"],
  "Low confidence": ["P03"],
  Trust: ["P03", "P06"],
  "Lack of clarity": ["P04", "P08"],
  Uncertainty: ["P04", "P06"],
  "Unreliable performance": ["P05", "P06"],
  "Recovery friction": ["P05", "P06"],
  Fragmentation: ["P04"],
  "Onboarding friction": ["P03"],
  "High cognitive load": ["P04"],
  "Lack of control": ["P04"],
  "Unexpected costs": ["P05"],
  "Habit formation": ["P05"],
  "Poor personalization": ["P04", "P08"],
};

const STAGE_PANEL_KEYS: Partial<Record<JourneyProblemStageId, string[]>> = {
  "switch-deepen": ["P03"],
  "first-value": ["P06"],
  everyday: ["P04", "P05"],
  onboard: ["P03"],
};

const METRIC_DROP_KEYS = ["P05"];

function resolveLinks(keys: string[]): ProductSensePanelLink[] {
  const out: ProductSensePanelLink[] = [];
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) continue;
    const q = jazInterviewQuestions.find((item) => item.curatedKey === key);
    if (!q) continue;
    seen.add(key);
    out.push({ curatedKey: key, shortLabel: q.shortLabel, questionId: q.id });
  }
  return out;
}

export function getPanelLinksForProblemCategory(category: string): ProductSensePanelLink[] {
  const norm = normalizeProblemCategory(category);
  const keys = CATEGORY_PANEL_KEYS[norm] ?? [];
  return resolveLinks(keys);
}

export function getPanelLinksForJourneyStage(stageId: JourneyProblemStageId): ProductSensePanelLink[] {
  return resolveLinks(STAGE_PANEL_KEYS[stageId] ?? []);
}

export function getPanelLinksForMetricsDiscussion(): ProductSensePanelLink[] {
  return resolveLinks(METRIC_DROP_KEYS);
}

export function mergePanelLinks(...groups: ProductSensePanelLink[][]): ProductSensePanelLink[] {
  const out: ProductSensePanelLink[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    for (const link of group) {
      if (seen.has(link.curatedKey)) continue;
      seen.add(link.curatedKey);
      out.push(link);
    }
  }
  return out;
}

import rawCases from "@/data/questrade-jaz-playbook-cases.json";
import rawPrimer from "@/data/questrade-jaz-primer-live.json";

export type PlaybookLiveType =
  | "priority"
  | "product-sense"
  | "diagnostic"
  | "technical"
  | "strategy";

export type PlaybookCategory = {
  id: string;
  label: string;
  liveType: PlaybookLiveType;
  cheatSheetHint: string;
  count: number;
};

export type PlaybookCase = {
  id: string;
  title: string;
  categoryId: string;
  categoryLabel: string;
  liveType: PlaybookLiveType;
  cheatSheetHint: string;
  priority: boolean;
  clarify: string;
  hypothesis: string;
  optionA: string;
  optionB: string;
  choose: string;
  seniorReasoning: string;
  metric: string;
  guardrail: string;
  dependency: string;
  spokenAnswer: string;
  shortAnswer: string;
  aliases: string[];
};

export type PrimerDistinction = {
  label: string;
  question: string;
  distinction: string;
};

export type PrimerPart = {
  id: string;
  title: string;
  bullets: string[];
  takeaway: string;
};

export type PrimerNavTrigger = {
  trigger: string;
  rootProblem: string;
  intervention: string;
  outcome: string;
  guardrail: string;
};

export type PrimerLive = {
  title: string;
  useFor: string;
  distinctions: PrimerDistinction[];
  parts: PrimerPart[];
  navMatrix: PrimerNavTrigger[];
};

type CasesFile = {
  title: string;
  useFor: string;
  categories: PlaybookCategory[];
  questions: PlaybookCase[];
};

export const playbookCasesData = rawCases as CasesFile;
export const primerLiveData = rawPrimer as PrimerLive;

export const playbookCases = playbookCasesData.questions;
export const playbookCategories = playbookCasesData.categories;
export const playbookPriorityCases = playbookCases.filter((q) => q.priority);

export function getPlaybookCase(id: string): PlaybookCase | undefined {
  return playbookCases.find((q) => q.id === id);
}

export function casesForCategory(categoryId: string): PlaybookCase[] {
  if (categoryId === "priority") return playbookPriorityCases;
  return playbookCases.filter((q) => q.categoryId === categoryId && !q.priority);
}

export function casesForLiveType(liveType: PlaybookLiveType | "all"): PlaybookCase[] {
  if (liveType === "all") return playbookCases;
  if (liveType === "priority") return playbookPriorityCases;
  return playbookCases.filter((q) => q.liveType === liveType && !q.priority);
}

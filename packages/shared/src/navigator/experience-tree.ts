import { EXPERIENCE_MODULES, PRODUCT_EXPERIENCE_COMPANIES } from "./experience-modules";
import { intentLabel } from "./follow-ups";
import { isRetrievalExcluded } from "./revision-retrieval";
import type { EnrichedQaRow, QuestionIntent } from "./types";

export type ExperienceIntentGroup = {
  intent: QuestionIntent;
  intentLabel: string;
  rows: EnrichedQaRow[];
};

export type ExperienceModuleGroup = {
  moduleId: string;
  label: string;
  intents: ExperienceIntentGroup[];
};

export type CompanyExperienceGroup = {
  company: string;
  modules: ExperienceModuleGroup[];
};

const INTENT_ORDER: QuestionIntent[] = [
  "main_story",
  "problem_discovery",
  "prioritization",
  "solution_alternatives",
  "personal_ownership",
  "technical_implementation",
  "measurement_impact",
  "attribution",
  "tradeoffs",
  "challenges_lessons",
  "what_differently",
  "general",
];

function intentSort(a: QuestionIntent, b: QuestionIntent): number {
  return INTENT_ORDER.indexOf(a) - INTENT_ORDER.indexOf(b);
}

function normalizeQuestionText(question: string): string {
  return question.trim().toLowerCase().replace(/\s+/g, " ");
}

function browseRowScore(row: EnrichedQaRow): number {
  let score = 0;
  if (!isRetrievalExcluded(row.navigator)) score += 100;
  if (row.isPreferred) score += 40;
  if (row.navigator.reviewStatus === "ok") score += 20;
  if (row.navigator.revisionStatus === "current" || !row.navigator.revisionStatus) score += 10;
  const ik = row.navigator.importKey ?? "";
  if (!ik.includes("john-experience-depth-v1")) score += 8;
  if (!ik.includes("followup-expansion")) score += 4;
  return score;
}

/** One visible card per canonical question within a module (prefer authoritative library rows). */
export function dedupeExperienceRowsForBrowse(rows: EnrichedQaRow[]): EnrichedQaRow[] {
  const byQuestion = new Map<string, EnrichedQaRow[]>();
  for (const row of rows) {
    const key = normalizeQuestionText(row.question);
    const group = byQuestion.get(key) ?? [];
    group.push(row);
    byQuestion.set(key, group);
  }
  const picked: EnrichedQaRow[] = [];
  for (const group of byQuestion.values()) {
    if (group.length === 1) {
      picked.push(group[0]);
      continue;
    }
    picked.push([...group].sort((a, b) => browseRowScore(b) - browseRowScore(a))[0]);
  }
  return picked.sort((a, b) => a.question.localeCompare(b.question));
}

/** Company → initiative → intents (only intents with at least one answer). */
export function buildProductExperienceTree(catalog: EnrichedQaRow[]): CompanyExperienceGroup[] {
  const byCompany = new Map<string, Map<string, EnrichedQaRow[]>>();

  const seenRowIds = new Set<string>();
  for (const row of catalog) {
    if (seenRowIds.has(row.id)) continue;
    seenRowIds.add(row.id);
    if (isRetrievalExcluded(row.navigator)) continue;
    if (row.navigator.librarySection !== "product_experience") continue;
    const mod = EXPERIENCE_MODULES[row.navigator.experienceModuleId];
    const company = mod?.company;
    if (!company || !PRODUCT_EXPERIENCE_COMPANIES.includes(company as (typeof PRODUCT_EXPERIENCE_COMPANIES)[number])) {
      continue;
    }
    if (!byCompany.has(company)) byCompany.set(company, new Map());
    const mods = byCompany.get(company)!;
    if (!mods.has(row.navigator.experienceModuleId)) mods.set(row.navigator.experienceModuleId, []);
    mods.get(row.navigator.experienceModuleId)!.push(row);
  }

  const companies: string[] = [...PRODUCT_EXPERIENCE_COMPANIES];
  const groups: CompanyExperienceGroup[] = [];
  for (const company of companies) {
    const modMap = byCompany.get(company);
    if (!modMap) continue;
      const modules: ExperienceModuleGroup[] = [...modMap.entries()]
        .map(([moduleId, rows]) => {
          const deduped = dedupeExperienceRowsForBrowse(rows);
          const byIntent = new Map<QuestionIntent, EnrichedQaRow[]>();
          for (const r of deduped) {
            const intent = r.navigator.intent;
            if (!byIntent.has(intent)) byIntent.set(intent, []);
            byIntent.get(intent)!.push(r);
          }
          const intents: ExperienceIntentGroup[] = [...byIntent.entries()]
            .sort(([a], [b]) => intentSort(a, b))
            .map(([intent, intentRows]) => ({
              intent,
              intentLabel: intentLabel(intent),
              rows: intentRows,
            }));
          if (intents.length === 0) return null;
          return {
            moduleId,
            label: EXPERIENCE_MODULES[moduleId]?.label ?? moduleId,
            intents,
          };
        })
        .filter((m): m is ExperienceModuleGroup => m !== null)
        .sort((a, b) => a.label.localeCompare(b.label));
    if (modules.length === 0) continue;
    groups.push({ company, modules });
  }
  return groups;
}

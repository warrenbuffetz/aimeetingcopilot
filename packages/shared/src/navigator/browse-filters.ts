import { isRetrievalExcluded } from "./revision-retrieval";
import type { EnrichedQaRow, InterviewRound, RoundPriority } from "./types";

const ROUND_OK: RoundPriority[] = ["very_high", "high", "medium"];

export function rowMatchesInterviewRound(row: EnrichedQaRow, round: InterviewRound | null): boolean {
  if (!round) return true;
  const rr = row.navigator.roundRelevance?.[round];
  if (!rr) return false;
  return ROUND_OK.includes(rr);
}

/** Module pin from Active experience dropdown (exact id; `-overview` includes same-prefix modules). */
export function rowMatchesExperienceModule(row: EnrichedQaRow, moduleId: string | null): boolean {
  if (!moduleId) return true;
  const rowMod = row.navigator.experienceModuleId;
  if (rowMod === moduleId) return true;
  if (moduleId.endsWith("-overview")) {
    const prefix = moduleId.slice(0, -"-overview".length);
    return rowMod.startsWith(`${prefix}-`) || rowMod === prefix;
  }
  return false;
}

export type BrowseCatalogFilters = {
  experienceModuleId?: string | null;
  interviewRound?: InterviewRound | null;
};

export function filterCatalogForBrowse(
  catalog: EnrichedQaRow[],
  filters: BrowseCatalogFilters
): EnrichedQaRow[] {
  const mod = filters.experienceModuleId ?? null;
  const round = filters.interviewRound ?? null;
  return catalog.filter((row) => {
    if (isRetrievalExcluded(row.navigator)) return false;
    if (!rowMatchesExperienceModule(row, mod)) return false;
    if (!rowMatchesInterviewRound(row, round)) return false;
    return true;
  });
}

export function countCatalogForInterviewRound(catalog: EnrichedQaRow[], round: InterviewRound): number {
  return filterCatalogForBrowse(catalog, { interviewRound: round }).length;
}

export function countRowsInExperienceTree(tree: {
  modules: { intents: { rows: { length: number } }[] }[];
}[]): number {
  let n = 0;
  for (const co of tree) {
    for (const mod of co.modules) {
      for (const ig of mod.intents) n += ig.rows.length;
    }
  }
  return n;
}

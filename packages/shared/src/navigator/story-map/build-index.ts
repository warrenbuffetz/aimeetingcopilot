import { isRetrievalExcluded } from "../revision-retrieval";
import { isPreparedRowEligibleForProfile } from "../profile-content-eligibility";
import { isExperienceModuleEligibleForProfile } from "../experience-modules";
import type { EnrichedQaRow, InterviewProfileKey, InterviewRound, QuestionIntent } from "../types";
import { STORY_MAP_ROOTS, STORY_MAP_TOPICS } from "./taxonomy";
import type { StoryMapBuildOptions, StoryMapIndex, StoryMapRankOptions, StoryMapTopicId } from "./types";

function questionText(row: EnrichedQaRow): string {
  return [row.question, row.navigator.canonicalQuestion].filter(Boolean).join(" ");
}

function haystack(row: EnrichedQaRow): string {
  return [
    questionText(row),
    row.answer.slice(0, 800),
    ...row.navigator.altPhrasings,
    ...row.navigator.topicTags,
    ...row.navigator.keywords,
  ]
    .join(" ")
    .toLowerCase();
}

function careerTopicIds(row: EnrichedQaRow): StoryMapTopicId[] {
  const q = questionText(row);
  const ids: StoryMapTopicId[] = [];
  if (/\btell me about yourself\b/i.test(q)) ids.push("career:tmay");
  if (
    /\bwhy\s+(questrade|simplii|opentable|questbank|this\s+(role|company|opportunity))\b/i.test(q) ||
    /\bwhy\s+.+\b(role|company|opportunity)\b/i.test(q)
  ) {
    ids.push("career:why-employer");
  }
  if (/\b(leave|leaving|move|motivat|transition|arc'teryx|arcteryx)\b/i.test(q) && /\bwhy\b/i.test(q)) {
    ids.push("career:transitions");
  }
  if (/\b(strength|weakness|hire you|choose you)\b/i.test(q)) ids.push("career:strengths");
  if (
    /\b(notice period|compensation|salary|hybrid|interviewing elsewhere|logistics|handover)\b/i.test(q)
  ) {
    ids.push("career:logistics");
  }
  const mod = row.navigator.experienceModuleId;
  if (mod === "career-general" && ids.length === 0) ids.push("career:other");
  return ids;
}

function leadershipTopicIds(row: EnrichedQaRow): StoryMapTopicId[] {
  const h = haystack(row);
  const ids: StoryMapTopicId[] = [];
  if (/\b(strategy|roadmap|vision|investment case|business case)\b/i.test(h)) ids.push("leadership:strategy");
  if (/\b(priorit|backlog|scope|cut scope|trade.?off)\b/i.test(h)) ids.push("leadership:prioritization");
  if (/\b(stakeholder|executive|leadership|align)\b/i.test(h)) ids.push("leadership:stakeholders");
  if (/\b(cross.?functional|influence|teams that did not report)\b/i.test(h)) ids.push("leadership:cross-functional");
  if (/\b(discovery|research|experiment|prototype|hypothesis)\b/i.test(h)) ids.push("leadership:discovery");
  if (/\b(conflict|disagree|difficult|pushback)\b/i.test(h)) ids.push("leadership:conflict");
  if (/\b(fail|lesson|mistake|what would you do differently)\b/i.test(h)) ids.push("leadership:failures");
  if (
    row.navigator.librarySection === "people_leadership" ||
    /\b(direct report|people manager|coaching|performance)\b/i.test(h)
  ) {
    ids.push("leadership:people");
  }
  if (
    ids.length === 0 &&
    (row.navigator.experienceModuleId === "leadership-general" ||
      row.navigator.librarySection === "leadership_behavioural" ||
      row.navigator.librarySection === "people_leadership")
  ) {
    ids.push("leadership:cross-functional");
  }
  return ids;
}

function arcteryxSyntheticTopics(row: EnrichedQaRow): StoryMapTopicId[] {
  const h = haystack(row);
  const ids: StoryMapTopicId[] = [];
  if (/\bsperro\b/i.test(h)) ids.push("arcteryx:sperro");
  if (/\$5\.2|5\.2 million|investment case\b/i.test(h)) ids.push("arcteryx:investment");
  return ids;
}

function bankingCrossTopics(row: EnrichedQaRow): StoryMapTopicId[] {
  const h = haystack(row);
  const ids: StoryMapTopicId[] = [];
  if (
    row.navigator.experienceModuleId === "rbc-cashback" ||
    /\binterac|e-transfer|payout|reconciliation|money movement|transfer\b/i.test(h)
  ) {
    ids.push("banking:money-movement");
  }
  if (/\b(fraud|risk|compliance|control|aml|kyc)\b/i.test(h)) ids.push("banking:risk");
  return ids;
}

function topicIdsForRow(row: EnrichedQaRow, profile: InterviewProfileKey): StoryMapTopicId[] {
  if (!isExperienceModuleEligibleForProfile(row.navigator.experienceModuleId, profile)) {
    return [];
  }

  const set = new Set<StoryMapTopicId>();
  const mod = row.navigator.experienceModuleId;

  for (const topic of STORY_MAP_TOPICS) {
    if (topic.moduleIds?.includes(mod)) set.add(topic.id);
  }

  for (const id of careerTopicIds(row)) set.add(id);
  for (const id of leadershipTopicIds(row)) set.add(id);
  for (const id of arcteryxSyntheticTopics(row)) set.add(id);
  for (const id of bankingCrossTopics(row)) set.add(id);

  if (row.navigator.librarySection === "people_leadership") {
    set.add("leadership:people");
  }

  return [...set];
}

const roundWeight = (p?: string) =>
  p === "very_high" ? 4 : p === "high" ? 3 : p === "medium" ? 2 : p === "low" ? 1 : 0;

export function rankStoryMapRows(
  rows: EnrichedQaRow[],
  opts?: StoryMapRankOptions
): EnrichedQaRow[] {
  const round = opts?.highlightRound ?? null;
  return [...rows].sort((a, b) => {
    let sa = 0;
    let sb = 0;
    if (a.isPreferred) sa += 25;
    if (b.isPreferred) sb += 25;
    if (a.navigator.topicTags?.some((t) => t.includes("P0"))) sa += 15;
    if (b.navigator.topicTags?.some((t) => t.includes("P0"))) sb += 15;
    if (round) {
      sa += roundWeight(a.navigator.roundRelevance?.[round]);
      sb += roundWeight(b.navigator.roundRelevance?.[round]);
    }
    if (a.navigator.reviewStatus === "ok") sa += 2;
    if (b.navigator.reviewStatus === "ok") sb += 2;
    return sb - sa || a.question.localeCompare(b.question);
  });
}

export function buildStoryMapIndex(
  catalog: EnrichedQaRow[],
  opts: StoryMapBuildOptions
): StoryMapIndex {
  const eligibleRows = catalog.filter(
    (r) =>
      !isRetrievalExcluded(r.navigator) &&
      isPreparedRowEligibleForProfile(r, opts.profile)
  );

  const rowsByTopic = new Map<StoryMapTopicId, EnrichedQaRow[]>();
  for (const t of STORY_MAP_TOPICS) rowsByTopic.set(t.id, []);

  const indexedRowIds = new Set<string>();

  for (const row of eligibleRows) {
    const topicIds = topicIdsForRow(row, opts.profile);
    for (const tid of topicIds) {
      rowsByTopic.get(tid)?.push(row);
      indexedRowIds.add(row.id);
    }
  }

  for (const [tid, rows] of rowsByTopic) {
    rowsByTopic.set(tid, rankStoryMapRows(rows, {}));
  }

  const topics = new Map(STORY_MAP_TOPICS.map((t) => [t.id, t]));
  const roots = STORY_MAP_ROOTS.map((root) => ({
    ...root,
    topicIds: STORY_MAP_TOPICS.filter((t) => t.rootId === root.id)
      .filter((t) => (rowsByTopic.get(t.id)?.length ?? 0) > 0)
      .map((t) => t.id),
  })).filter((r) => r.topicIds.length > 0);

  return {
    roots,
    topics,
    rowsByTopic,
    indexedRowIds,
    eligibleRows,
  };
}

export function storyMapUnclassifiedRows(index: StoryMapIndex): EnrichedQaRow[] {
  return index.eligibleRows.filter((r) => !index.indexedRowIds.has(r.id));
}

export function storyMapTopicCount(index: StoryMapIndex, topicId: StoryMapTopicId): number {
  return index.rowsByTopic.get(topicId)?.length ?? 0;
}

export function storyMapRowsForTopic(
  index: StoryMapIndex,
  topicId: StoryMapTopicId,
  opts?: StoryMapRankOptions & { intentFilter?: QuestionIntent | "all" }
): EnrichedQaRow[] {
  let rows = index.rowsByTopic.get(topicId) ?? [];
  if (opts?.intentFilter && opts.intentFilter !== "all") {
    rows = rows.filter((r) => r.navigator.intent === opts.intentFilter);
  }
  return rankStoryMapRows(rows, opts);
}

export function storyMapTopQuestions(
  index: StoryMapIndex,
  topicId: StoryMapTopicId,
  limit: number,
  opts?: StoryMapRankOptions
): EnrichedQaRow[] {
  return storyMapRowsForTopic(index, topicId, { ...opts, intentFilter: "all" }).slice(0, limit);
}

export function storyMapIntentsInTopic(
  index: StoryMapIndex,
  topicId: StoryMapTopicId
): QuestionIntent[] {
  const rows = index.rowsByTopic.get(topicId) ?? [];
  const intents = new Set<QuestionIntent>();
  for (const r of rows) intents.add(r.navigator.intent);
  return [...intents];
}

export function storyMapSearch(
  index: StoryMapIndex,
  query: string,
  limit: number,
  opts?: StoryMapRankOptions
): EnrichedQaRow[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored: { row: EnrichedQaRow; score: number }[] = [];
  for (const row of index.eligibleRows) {
    const h = haystack(row);
    if (h.includes(q)) {
      scored.push({ row, score: 1 });
      continue;
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    let hits = 0;
    for (const t of tokens) {
      if (h.includes(t)) hits += 1;
    }
    if (hits > 0) scored.push({ row, score: hits / tokens.length });
  }

  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: EnrichedQaRow[] = [];
  for (const { row } of scored) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
    if (out.length >= limit) break;
  }
  return rankStoryMapRows(out, opts);
}

/** Same canonical row resolves from two topic paths */
export function storyMapRowIdsEqual(a: EnrichedQaRow, b: EnrichedQaRow): boolean {
  return a.id === b.id;
}

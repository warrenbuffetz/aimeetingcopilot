import {
  editorialReasonLabel,
  editorialTierRankBoost,
  editorialTopQuestionLimit,
  editorialTopQuestionsForProfile,
} from "./editorial-top-questions";
import { findBestCatalogMatchForEditorial } from "./editorial-question-match";
import type { InterviewProfileKey } from "./profile-content-eligibility";
import { isRetrievalExcluded } from "./revision-retrieval";
import type { EnrichedQaRow, FollowUpSuggestion, InterviewRound, InterviewSessionContext, RoundPriority } from "./types";

const DEFAULT_ROUND: InterviewRound = "recruiter";

const RECRUITER_TOPIC_BOOSTS: { pattern: RegExp; weight: number; label: string }[] = [
  { pattern: /tell me about yourself/i, weight: 12, label: "Introduction" },
  { pattern: /why questrade/i, weight: 11, label: "Why Questrade" },
  { pattern: /everyday banking|retail banking|rewards and loyalty|move into banking/i, weight: 10, label: "Why banking" },
  {
    pattern: /arc'?teryx|current role|what are you working on|membership platform/i,
    weight: 9,
    label: "Current Arc'teryx",
  },
  { pattern: /new role|looking for|leave your|motivat/i, weight: 8, label: "Career transition" },
  { pattern: /tell me more about your time at (rbc|hbc|arc|air)/i, weight: 8, label: "Employer overview" },
  { pattern: /interac|payout|payment|cashback withdrawal|reconcil/i, weight: 7, label: "Payments" },
  { pattern: /stakeholder|leadership|say no|disagree|influence/i, weight: 6, label: "Leadership" },
  { pattern: /compensation|salary|availability|notice period/i, weight: 5, label: "Logistics" },
  { pattern: /career goal|where do you see/i, weight: 5, label: "Career goals" },
];

const HM_TOPIC_BOOSTS: { pattern: RegExp; weight: number }[] = [
  { pattern: /prioritiz|roadmap|trade-?off|scope/i, weight: 10 },
  { pattern: /ownership|personally (own|decide)/i, weight: 9 },
  { pattern: /measure|metric|experiment|attribution/i, weight: 8 },
  { pattern: /risk|compliance|stakeholder/i, weight: 7 },
  { pattern: /integration|technical|ledger|payment/i, weight: 7 },
];

const PANEL_TOPIC_BOOSTS: { pattern: RegExp; weight: number }[] = [
  { pattern: /risk|compliance|fraud|aml|kyc/i, weight: 10 },
  { pattern: /reconcil|settlement|ledger|exception/i, weight: 9 },
  { pattern: /measure|experiment|guardrail/i, weight: 8 },
  { pattern: /technical|integration|vendor/i, weight: 8 },
  { pattern: /ai|agent|mcp/i, weight: 6 },
];

const SIMPLII_PANEL_TOPIC_BOOSTS: { pattern: RegExp; weight: number; label: string }[] = [
  { pattern: /tell me about yourself|why simplii|strongest reason to hire/i, weight: 12, label: "Panel opener" },
  { pattern: /backlog|prioritiz|sprint|acceptance criteria|user story|refinement/i, weight: 11, label: "Delivery & backlog" },
  { pattern: /risk|legal|compliance|control/i, weight: 10, label: "Controls partnership" },
  { pattern: /stakeholder|disagree|influence|say no/i, weight: 10, label: "Stakeholder judgment" },
  { pattern: /discovery|hypothesis|customer data|experiment/i, weight: 9, label: "Discovery & evidence" },
  { pattern: /simplii|mobile app|folders|bill.payment|redesign/i, weight: 9, label: "Simplii product" },
  { pattern: /metric|numerator|denominator|launch|scorecard/i, weight: 8, label: "Metrics" },
  { pattern: /scope|cut scope|defer/i, weight: 8, label: "Prioritization trade-off" },
];

const SIMPLII_TECH_DEEP_PATTERN =
  /\b(idempoten|reconcil|settlement rail|5m\+|ledger posting|enterprise settlement events)\b/i;

function roundWeight(priority: RoundPriority | undefined): number {
  if (priority === "very_high") return 4;
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  if (priority === "low") return 1;
  return 0;
}

function preparationBoost(tags: string[]): number {
  if (tags.some((t) => t === "P0" || t === "priority:P0")) return 0.5;
  if (tags.some((t) => t === "P1" || t === "priority:P1")) return 0.25;
  return 0;
}

function topicBoost(
  round: InterviewRound,
  question: string,
  importKey?: string,
  profile: InterviewProfileKey = "questrade"
): { score: number; label: string } {
  const boosts =
    profile === "simplii" && round === "cross_functional_panel"
      ? SIMPLII_PANEL_TOPIC_BOOSTS
      : round === "hiring_manager"
        ? HM_TOPIC_BOOSTS
        : round === "cross_functional_panel"
          ? PANEL_TOPIC_BOOSTS
          : RECRUITER_TOPIC_BOOSTS;
  let best = 0;
  let label = "Editorial priority";
  for (const b of boosts) {
    if (b.pattern.test(question) && b.weight > best) {
      best = b.weight;
      label = "label" in b ? (b as { label: string }).label : "Role-relevant topic";
    }
  }
  if (
    profile !== "simplii" &&
    importKey?.startsWith("simplii-jd-")
  ) {
    return { score: -2, label: "JD practice (lower recruiter priority)" };
  }
  if (
    profile === "simplii" &&
    round === "cross_functional_panel" &&
    SIMPLII_TECH_DEEP_PATTERN.test(question) &&
    !/timeout|duplicate|status|pending/i.test(question)
  ) {
    best = Math.min(best, 3);
    label = "Technical deep-dive (conditional)";
  }
  if (/walk me through how you would run discovery for an unfamiliar/i.test(question) && round === "recruiter") {
    return { score: Math.min(best, 2), label: "Generic discovery (lower recruiter priority)" };
  }
  return { score: best, label };
}

function canonicalDedupeKey(row: EnrichedQaRow): string {
  const cid = row.navigator.canonicalQuestionId;
  if (cid) return `cid:${cid}`;
  return `q:${row.question.toLowerCase().replace(/\s+/g, " ").slice(0, 120)}`;
}

function curatedSuggestions(
  catalog: EnrichedQaRow[],
  round: InterviewRound,
  profile: InterviewProfileKey
): FollowUpSuggestion[] {
  const list = editorialTopQuestionsForProfile(profile, round);
  const pool = catalog.filter((r) => !isRetrievalExcluded(r.navigator));
  const out: FollowUpSuggestion[] = [];

  for (const entry of list) {
    const match = findBestCatalogMatchForEditorial(entry.question, pool, {
      interviewProfile: profile,
    });
    if (!match) continue;

    const editorialScore = 10_000 - entry.rank + editorialTierRankBoost(entry.tier);
    out.push({
      rowId: match.row.id,
      question: entry.question,
      answer: match.row.answer,
      experienceModuleId: match.row.navigator.experienceModuleId,
      experienceLabel: match.row.navigator.experienceLabel,
      intent: match.row.navigator.intent,
      rank: editorialScore,
      reason: editorialReasonLabel(round, entry.rank, entry.tier),
    });
  }

  return out;
}

function heuristicSuggestions(
  catalog: EnrichedQaRow[],
  round: InterviewRound,
  askedIds: Set<string>,
  alreadyPicked: Set<string>,
  limit: number,
  profile: InterviewProfileKey
): FollowUpSuggestion[] {
  const pool = catalog.filter((r) => !isRetrievalExcluded(r.navigator));
  const roundSorted = [...pool].sort(
    (a, b) => roundWeight(b.navigator.roundRelevance?.[round]) - roundWeight(a.navigator.roundRelevance?.[round])
  );

  const seenCanonical = new Set<string>();
  const scored: FollowUpSuggestion[] = [];

  for (const row of roundSorted) {
    if (askedIds.has(row.id) || alreadyPicked.has(row.id)) continue;
    const dedupe = canonicalDedupeKey(row);
    if (seenCanonical.has(dedupe)) continue;
    seenCanonical.add(dedupe);

    const rr = row.navigator.roundRelevance?.[round];
    const rw = roundWeight(rr);
    const prep = preparationBoost(row.navigator.topicTags ?? []);
    const topic = topicBoost(round, row.question, row.navigator.importKey, profile);
    const preferred = row.isPreferred ? 0.35 : 0;
    const section =
      row.navigator.librarySection === "career_motivation" && round === "recruiter" ? 0.4 : 0;

    const rank = rw + prep + topic.score + preferred + section;

    scored.push({
      rowId: row.id,
      question: row.question,
      answer: row.answer,
      experienceModuleId: row.navigator.experienceModuleId,
      experienceLabel: row.navigator.experienceLabel,
      intent: row.navigator.intent,
      rank,
      reason:
        rr === "very_high" || rr === "high"
          ? `${round.replace(/_/g, " ")}: ${rr.replace(/_/g, " ")} editorial priority`
          : topic.label,
    });
  }

  scored.sort((a, b) => b.rank - a.rank || a.question.localeCompare(b.question));
  return scored.slice(0, limit);
}

/**
 * Right-panel interview-wide shortlist — stable across detected-question changes; driven by round + curated editorial lists.
 */
export function suggestTopInterviewQuestions(
  catalog: EnrichedQaRow[],
  ctx: InterviewSessionContext,
  opts?: { limit?: number; interviewProfile?: InterviewProfileKey }
): FollowUpSuggestion[] {
  const profile = opts?.interviewProfile ?? "questrade";
  const round = ctx.activeInterviewRound ?? DEFAULT_ROUND;
  const limit = opts?.limit ?? editorialTopQuestionLimit(round, profile);
  const askedIds = new Set(ctx.askedQuestionIds);

  const curated = curatedSuggestions(catalog, round, profile);
  const picked = new Set(curated.map((c) => c.rowId));
  const remaining = limit - curated.length;
  const fill =
    remaining > 0
      ? heuristicSuggestions(catalog, round, askedIds, picked, remaining, profile)
      : [];

  return [...curated, ...fill].slice(0, limit);
}

import { inferNavigatorMeta, type InferMetaInput } from "./meta-inference";
import { librarySectionForModule, librarySectionFromCategory } from "./library-sections";
import { experienceModule, EXPERIENCE_MODULES } from "./experience-modules";
import { canonicalModuleId, canonicalQuestionIntent } from "./module-id-map";
import type {
  EvidenceStatus,
  InterviewRound,
  NavigatorQaMeta,
  PanelDiscipline,
  QuestionIntent,
  ReviewStatus,
  RevisionStatus,
  RoundPriority,
} from "./types";

export type PersistedNavigatorMeta = {
  seedKey?: string;
  notes?: string;
  libraryCategory?: string;
  librarySection?: string;
  experienceModuleId?: string;
  experienceLabel?: string;
  intent?: string;
  evidenceStatus?: string;
  altPhrasings?: string[];
  topicTags?: string[];
  keywords?: string[];
  part?: number;
  canonicalQuestion?: string;
  shortAnswer?: string;
  relatedQuestionIds?: string[];
  sourceFile?: string;
  reviewStatus?: ReviewStatus;
  revisionStatus?: RevisionStatus;
  retrievalExcluded?: boolean;
  supersededByQuestion?: string;
  canonicalQuestionId?: string;
  roundRelevance?: Partial<Record<InterviewRound, RoundPriority>>;
  panelDiscipline?: PanelDiscipline;
  spokenAnswer?: string;
  importKey?: string;
  primaryInterviewRound?: string;
  proposedAnswerUpdate?: string;
  supplementalTalkingPoints?: { label: string; content: string; importKey?: string }[];
};

export function navigatorMetaToPersisted(meta: NavigatorQaMeta): PersistedNavigatorMeta {
  return {
    seedKey: meta.seedKey,
    notes: meta.seedKey,
    libraryCategory: meta.libraryCategory,
    librarySection: meta.librarySection,
    experienceModuleId: meta.experienceModuleId,
    experienceLabel: meta.experienceLabel,
    intent: meta.intent,
    evidenceStatus: meta.evidenceStatus,
    altPhrasings: meta.altPhrasings,
    topicTags: meta.topicTags,
    keywords: meta.keywords,
    part: meta.part,
    canonicalQuestion: meta.canonicalQuestion,
    shortAnswer: meta.shortAnswer,
    relatedQuestionIds: meta.relatedQuestionIds,
    sourceFile: meta.sourceFile,
    reviewStatus: meta.reviewStatus,
    revisionStatus: meta.revisionStatus,
    retrievalExcluded: meta.retrievalExcluded,
    supersededByQuestion: meta.supersededByQuestion,
    canonicalQuestionId: meta.canonicalQuestionId,
    roundRelevance: meta.roundRelevance,
    panelDiscipline: meta.panelDiscipline,
    spokenAnswer: meta.spokenAnswer,
    importKey: meta.importKey,
    primaryInterviewRound: meta.primaryInterviewRound,
    proposedAnswerUpdate: meta.proposedAnswerUpdate,
    supplementalTalkingPoints: meta.supplementalTalkingPoints,
  };
}

const VALID_INTENTS = new Set<string>([
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
]);

export function navigatorMetaFromPersisted(
  raw: PersistedNavigatorMeta | null | undefined,
  row: InferMetaInput
): NavigatorQaMeta {
  const inferred = inferNavigatorMeta(row);
  if (!raw || Object.keys(raw).length === 0) return inferred;

  const moduleId = canonicalModuleId(raw.experienceModuleId ?? inferred.experienceModuleId);
  const mod = EXPERIENCE_MODULES[moduleId] ?? experienceModule(moduleId);
  const intent = raw.intent
    ? canonicalQuestionIntent(raw.intent)
    : inferred.intent;
  const resolvedIntent = VALID_INTENTS.has(intent) ? intent : inferred.intent;

  const librarySection =
    (raw.librarySection as NavigatorQaMeta["librarySection"]) ??
    librarySectionForModule(mod);

  return {
    seedKey: raw.seedKey ?? inferred.seedKey,
    libraryCategory: (raw.libraryCategory as NavigatorQaMeta["libraryCategory"]) ?? inferred.libraryCategory,
    librarySection,
    experienceModuleId: moduleId,
    experienceLabel: raw.experienceLabel ?? mod.label,
    intent: resolvedIntent,
    evidenceStatus: (raw.evidenceStatus as EvidenceStatus) ?? inferred.evidenceStatus,
    altPhrasings: raw.altPhrasings?.length ? raw.altPhrasings : inferred.altPhrasings,
    topicTags: raw.topicTags ?? inferred.topicTags,
    keywords: raw.keywords?.length ? raw.keywords : inferred.keywords,
    part: raw.part ?? inferred.part,
    canonicalQuestion: raw.canonicalQuestion ?? row.question,
    shortAnswer: raw.shortAnswer ?? row.shortAnswer ?? undefined,
    relatedQuestionIds: raw.relatedQuestionIds ?? [],
    sourceFile: raw.sourceFile,
    reviewStatus: raw.reviewStatus ?? inferred.reviewStatus,
    revisionStatus: (raw.revisionStatus as RevisionStatus) ?? "current",
    retrievalExcluded: raw.retrievalExcluded ?? false,
    supersededByQuestion: raw.supersededByQuestion,
    canonicalQuestionId: raw.canonicalQuestionId,
    roundRelevance: raw.roundRelevance,
    panelDiscipline: raw.panelDiscipline as PanelDiscipline | undefined,
    spokenAnswer: raw.spokenAnswer,
    importKey: raw.importKey,
    primaryInterviewRound: raw.primaryInterviewRound as NavigatorQaMeta["primaryInterviewRound"],
    proposedAnswerUpdate: raw.proposedAnswerUpdate,
    supplementalTalkingPoints: raw.supplementalTalkingPoints,
  };
}

export function enrichQaRowFromPersisted(row: InferMetaInput & { navigatorMeta?: PersistedNavigatorMeta | null }) {
  const navigator = navigatorMetaFromPersisted(row.navigatorMeta ?? null, row);
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    isPreferred: row.isPreferred,
    navigator,
  };
}

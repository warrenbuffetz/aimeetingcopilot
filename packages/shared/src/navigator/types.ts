export type InterviewProfileKey = "questrade" | "simplii" | "opentable" | "unknown";

export type LibraryCategory =
  | "career_recruiter"
  | "resume_deep_dive"
  | "banking_strategy"
  | "banking_technical"
  | "product_analytics"
  | "leadership_behavioural";

/** Primary library sections (product UX). */
export type LibrarySection =
  | "career_motivation"
  | "product_experience"
  | "questrade_cases"
  | "product_banking_knowledge"
  | "leadership_behavioural"
  | "people_leadership";

export type QuestionIntent =
  | "main_story"
  | "problem_discovery"
  | "prioritization"
  | "solution_alternatives"
  | "personal_ownership"
  | "technical_implementation"
  | "measurement_impact"
  | "attribution"
  | "tradeoffs"
  | "challenges_lessons"
  | "what_differently"
  | "general";

export type ReviewStatus = "ok" | "needs_review" | "duplicate_candidate";

export type RevisionStatus = "current" | "superseded" | "archived";

export type InterviewRound = "recruiter" | "hiring_manager" | "cross_functional_panel";

export type RoundPriority = "very_high" | "high" | "medium" | "low";

export type PanelDiscipline =
  | "payments_ops"
  | "risk_compliance"
  | "finance_economics"
  | "engineering_platform"
  | "data_experimentation"
  | "ai_agentic"
  | "general";

export type EvidenceStatus =
  | "verified_accomplishment"
  | "resume_supported"
  | "illustrative_scenario"
  | "rehearsal_framework"
  | "unverified_detail";

export interface ExperienceModule {
  id: string;
  label: string;
  company?: string;
  libraryCategory: LibraryCategory;
}

export interface NavigatorQaMeta {
  seedKey?: string;
  libraryCategory: LibraryCategory;
  librarySection: LibrarySection;
  experienceModuleId: string;
  experienceLabel: string;
  intent: QuestionIntent;
  evidenceStatus: EvidenceStatus;
  altPhrasings: string[];
  topicTags: string[];
  keywords: string[];
  part?: number;
  canonicalQuestion?: string;
  shortAnswer?: string;
  relatedQuestionIds: string[];
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
  /** When set, row is only eligible for this interview profile (job-specific prepared answer). */
  profileExclusive?: InterviewProfileKey;
  /** Optional per-profile closing paragraph for shared answer bodies. */
  employerClosing?: Partial<Record<InterviewProfileKey, string>>;
  primaryInterviewRound?: InterviewRound;
  proposedAnswerUpdate?: string;
  supplementalTalkingPoints?: { label: string; content: string; importKey?: string }[];
  /** Round-ordered contextual follow-up child IDs (optional DB copy; runtime uses bundled resolved map). */
  curatedContextualFollowUpsByRound?: Partial<
    Record<
      InterviewRound,
      { questionId: string; order: number; intent?: string; reason: string }[]
    >
  >;
  curatedContextualFollowUpsVersion?: string;
}

export interface EnrichedQaRow {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  isPreferred?: boolean;
  navigator: NavigatorQaMeta;
}

export interface InterviewSessionContext {
  activeExperienceModuleId: string | null;
  activeExperienceLabel: string | null;
  activeIntent: QuestionIntent | null;
  activeQuestionId: string | null;
  previousExperienceModuleId: string | null;
  askedQuestionIds: string[];
  askedQuestionTexts: string[];
  manualExperienceOverrideId: string | null;
  lastDetectedQuestion: string | null;
  activeInterviewRound: InterviewRound | null;
}

export function emptyInterviewContext(): InterviewSessionContext {
  return {
    activeExperienceModuleId: null,
    activeExperienceLabel: null,
    activeIntent: null,
    activeQuestionId: null,
    previousExperienceModuleId: null,
    askedQuestionIds: [],
    askedQuestionTexts: [],
    manualExperienceOverrideId: null,
    lastDetectedQuestion: null,
    activeInterviewRound: null,
  };
}

export interface FollowUpSuggestion {
  rowId: string;
  question: string;
  answer: string;
  experienceModuleId: string;
  experienceLabel: string;
  intent: QuestionIntent;
  rank: number;
  reason: string;
}

export interface ContextResolution {
  experienceModuleId: string | null;
  experienceLabel: string | null;
  intent: QuestionIntent | null;
  topicSwitch: boolean;
  confidence: number;
  rowId: string | null;
}

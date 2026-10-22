export type LibraryCategory =
  | "career_recruiter"
  | "resume_deep_dive"
  | "banking_strategy"
  | "banking_technical"
  | "product_analytics"
  | "leadership_behavioural";

export type QuestionIntent =
  | "main_story"
  | "problem_discovery"
  | "prioritization"
  | "solution_alternatives"
  | "personal_ownership"
  | "technical_implementation"
  | "measurement_impact"
  | "tradeoffs"
  | "challenges_lessons"
  | "what_differently"
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
  experienceModuleId: string;
  experienceLabel: string;
  intent: QuestionIntent;
  evidenceStatus: EvidenceStatus;
  altPhrasings: string[];
  keywords: string[];
  part?: number;
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

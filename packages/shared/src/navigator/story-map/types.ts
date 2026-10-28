import type { EnrichedQaRow, InterviewProfileKey, InterviewRound, QuestionIntent } from "../types";

export type StoryMapRootId =
  | "career"
  | "rbc"
  | "arcteryx"
  | "hbc"
  | "aeroplan"
  | "leadership"
  | "banking-cases";

export type StoryMapTopicId = string;

export type StoryMapRoot = {
  id: StoryMapRootId;
  label: string;
  topicIds: StoryMapTopicId[];
};

export type StoryMapTopic = {
  id: StoryMapTopicId;
  rootId: StoryMapRootId;
  label: string;
  /** Primary association: experience module ids */
  moduleIds?: string[];
  /** Synthetic topic within a company (e.g. Sperro) */
  synthetic?: boolean;
};

export type StoryMapIndex = {
  roots: StoryMapRoot[];
  topics: Map<StoryMapTopicId, StoryMapTopic>;
  /** Rows per topic (same row id may appear in multiple topics) */
  rowsByTopic: Map<StoryMapTopicId, EnrichedQaRow[]>;
  /** All eligible row ids indexed in at least one topic */
  indexedRowIds: Set<string>;
  eligibleRows: EnrichedQaRow[];
};

export type StoryMapPath = {
  rootId: StoryMapRootId;
  topicId?: StoryMapTopicId;
  intentFilter?: QuestionIntent | "all";
};

export type StoryMapBuildOptions = {
  profile: InterviewProfileKey;
};

export type StoryMapRankOptions = {
  highlightRound?: InterviewRound | null;
};

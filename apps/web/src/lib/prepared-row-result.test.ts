import { describe, expect, it } from "vitest";
import { analyzeResultFromPreparedRow } from "./prepared-row-result";
import type { EnrichedQaRow } from "@interview-copilot/shared";

const row: EnrichedQaRow = {
  id: "test-id",
  question: "Tell me more about your time at Arc'teryx.",
  answer: "Full answer text.",
  isPreferred: true,
  category: "Experience deep dive",
  navigator: {
    libraryCategory: "resume_deep_dive",
    librarySection: "product_experience",
    experienceModuleId: "arcteryx-overview",
    experienceLabel: "Arc'teryx — Employer Overview",
    intent: "main_story",
    evidenceStatus: "resume_supported",
    altPhrasings: [],
    topicTags: [],
    keywords: [],
    relatedQuestionIds: [],
    shortAnswer: "Short text.",
  },
};

describe("analyzeResultFromPreparedRow", () => {
  it("uses row id as match source", () => {
    const r = analyzeResultFromPreparedRow(row);
    expect(r.matches[0]?.sourceId).toBe("test-id");
    expect(r.preparedQuestion).toBe(row.question);
    expect(r.answer).toBe(row.answer);
  });

  it("preserves detected question when browsing from live session", () => {
    const r = analyzeResultFromPreparedRow(row, { preserveDetectedQuestion: "tell me about arc turks" });
    expect(r.question).toBe("tell me about arc turks");
    expect(r.preparedQuestion).toBe(row.question);
  });
});

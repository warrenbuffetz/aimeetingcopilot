import { describe, expect, it } from "vitest";
import {
  analyzeResultFromLexicalRank,
  shouldReplaceOptimisticWithHybrid,
} from "./analyze-result-from-lexical";
import type { AnalyzeQuestionResult, LexicalMatchResult } from "@interview-copilot/shared";

function row(overrides: Partial<LexicalMatchResult> & { rowId: string }): LexicalMatchResult {
  return {
    rowId: overrides.rowId,
    score: overrides.score ?? 0.9,
    kind: overrides.kind ?? "main",
    parentQuestion: overrides.parentQuestion ?? "Parent?",
    matchQuestion: overrides.matchQuestion ?? "Parent?",
    answer: overrides.answer ?? "Answer text",
    followUps: overrides.followUps ?? [],
    isPreferred: overrides.isPreferred ?? false,
  };
}

describe("analyzeResultFromLexicalRank", () => {
  it("returns null below prepared threshold", () => {
    expect(analyzeResultFromLexicalRank("q", [row({ rowId: "a", score: 0.2 })])).toBeNull();
  });

  it("marks optimistic prepared matches", () => {
    const result = analyzeResultFromLexicalRank("q", [row({ rowId: "a", score: 0.85 })]);
    expect(result?.matchPhase).toBe("optimistic");
    expect(result?.matches[0]?.sourceId).toBe("a");
  });
});

describe("shouldReplaceOptimisticWithHybrid", () => {
  const optimistic: AnalyzeQuestionResult = {
    question: "q",
    outcome: "PREPARED",
    confidence: 0.9,
    answer: "A",
    matches: [{ id: "1", contentType: "prepared_qa", sourceId: "1", title: "t", content: "A", similarity: 0.9 }],
  };

  it("does not replace when top row unchanged", () => {
    const hybrid = { ...optimistic, matchPhase: "confirmed" as const };
    expect(shouldReplaceOptimisticWithHybrid(optimistic, hybrid)).toBe(false);
  });

  it("replaces when hybrid top row differs", () => {
    const hybrid: AnalyzeQuestionResult = {
      ...optimistic,
      matches: [{ id: "2", contentType: "prepared_qa", sourceId: "2", title: "t2", content: "B", similarity: 0.88 }],
    };
    expect(shouldReplaceOptimisticWithHybrid(optimistic, hybrid)).toBe(true);
  });
});

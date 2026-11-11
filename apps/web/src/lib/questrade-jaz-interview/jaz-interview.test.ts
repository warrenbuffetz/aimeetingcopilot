import { describe, expect, it } from "vitest";
import { jazInterviewDeepDives, jazInterviewQuestions, validateJazInterviewDataset } from "./dataset";

describe("jaz interview pack dataset", () => {
  it("loads PDF-aligned content with reduced deep dives and follow-ups", () => {
    expect(validateJazInterviewDataset()).toEqual([]);
    expect(jazInterviewQuestions.length).toBeGreaterThanOrEqual(15);
    expect(jazInterviewDeepDives).toHaveLength(5);
    for (const d of jazInterviewDeepDives) {
      expect(d.answer.length).toBeGreaterThan(200);
      expect(d.followUps.length).toBe(5);
      expect(d.questionTriggers.length).toBe(5);
    }
    const fu = jazInterviewDeepDives.reduce((n, q) => n + q.followUps.length, 0);
    expect(fu).toBe(25);
  });
});

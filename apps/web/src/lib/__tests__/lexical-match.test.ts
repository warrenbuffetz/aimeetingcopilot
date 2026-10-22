import { describe, expect, it } from "vitest";
import { rankPreparedQaLexical, scoreLexicalSimilarity } from "@interview-copilot/shared";

describe("scoreLexicalSimilarity", () => {
  it("scores paraphrased questions highly", () => {
    expect(
      scoreLexicalSimilarity("Tell me about yourself.", "Can you tell me about yourself and your background?")
    ).toBeGreaterThan(0.35);
  });
});

describe("rankPreparedQaLexical", () => {
  it("matches follow-up scripts", () => {
    const ranked = rankPreparedQaLexical("Why are you looking to leave Arc'teryx?", [
      {
        id: "1",
        question: "Tell me about yourself.",
        answer: "Intro",
        followUps: [
          { question: "Why are you looking to leave Arc'teryx?", answer: "Leave script" },
        ],
      },
    ]);
    expect(ranked[0].kind).toBe("follow_up");
    expect(ranked[0].answer).toBe("Leave script");
  });
});

import { describe, expect, it } from "vitest";
import { boostSimilarity, isLikelyQuestion } from "@interview-copilot/shared";

describe("isLikelyQuestion", () => {
  it("detects question marks", () => {
    expect(isLikelyQuestion("What is your approach?")).toBe(true);
  });

  it("detects behavioral starters", () => {
    expect(isLikelyQuestion("Tell me about a time you influenced stakeholders")).toBe(true);
  });

  it("rejects statements", () => {
    expect(isLikelyQuestion("Thanks for joining today.")).toBe(false);
  });
});

describe("boostSimilarity", () => {
  it("caps at 1", () => {
    expect(boostSimilarity(0.98, { preferred: true, sameProfile: true })).toBe(1);
  });
});

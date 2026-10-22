import { describe, expect, it } from "vitest";
import { mergeTranscriptFragments, utteranceLooksComplete } from "@interview-copilot/shared";

describe("mergeTranscriptFragments", () => {
  it("extends when whisper repeats with more words", () => {
    expect(mergeTranscriptFragments("Thanks for joining", "Thanks for joining today.")).toBe(
      "Thanks for joining today."
    );
  });

  it("joins distinct phrases without duplicating overlap", () => {
    expect(
      mergeTranscriptFragments("how do you handle", "how do you handle disagreements")
    ).toBe("how do you handle disagreements");
  });
});

describe("utteranceLooksComplete", () => {
  it("detects sentence endings", () => {
    expect(utteranceLooksComplete("Thanks for joining today.")).toBe(true);
    expect(utteranceLooksComplete("Why Questrade?")).toBe(true);
    expect(utteranceLooksComplete("still talking")).toBe(false);
  });
});

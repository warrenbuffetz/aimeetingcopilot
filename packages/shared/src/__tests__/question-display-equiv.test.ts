import { describe, expect, it } from "vitest";
import { questionsEquivalentForDisplay } from "../question-display-equiv";

describe("questionsEquivalentForDisplay", () => {
  it("treats punctuation-only differences as equivalent", () => {
    expect(
      questionsEquivalentForDisplay(
        "Tell me about your time at Arc'teryx?",
        "Tell me about your time at Arc'teryx"
      )
    ).toBe(true);
  });

  it("keeps meaningfully different phrasings separate", () => {
    expect(
      questionsEquivalentForDisplay(
        "How did you measure success?",
        "Walk me through the membership platform"
      )
    ).toBe(false);
  });
});

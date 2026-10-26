import { describe, expect, it } from "vitest";
import {
  countWords,
  excerptWords,
  segmentTranscriptForDisplay,
  tailLines,
  tailWords,
} from "@/lib/transcript-display";
import { sliceWebSpeechResults } from "@/lib/web-speech-results";

describe("transcript display", () => {
  it("tails interim to recent words/lines", () => {
    const long = Array.from({ length: 40 }, (_, i) => `word${i}`).join(" ");
    expect(countWords(tailWords(long, 12))).toBeLessThanOrEqual(12);
    expect(tailLines(long, 3).split(/\s+/).length).toBeLessThanOrEqual(3 * 14 + 5);
  });

  it("segments long speech at sentence boundaries when possible", () => {
    const text =
      "Tell me about yourself. " +
      Array.from({ length: 90 }, (_, i) => `answer${i}`).join(" ") +
      " That is the summary.";
    const parts = segmentTranscriptForDisplay(text, 50);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.join(" ").replace(/\s+/g, " ")).toContain("Tell me about yourself");
  });

  it("excerptWords truncates with ellipsis", () => {
    expect(excerptWords("one two three four five", 3)).toBe("one two three…");
  });
});

describe("web speech results", () => {
  it("emits only new finals and current interim (not session history)", () => {
    const results = [
      { isFinal: true, 0: { transcript: "Tell me about yourself." } },
      { isFinal: false, 0: { transcript: "Sure I started" } },
    ] as { isFinal: boolean; 0: { transcript: string } }[];

    const slice = sliceWebSpeechResults(results, 1);
    expect(slice.finals).toEqual([]);
    expect(slice.interim).toBe("Sure I started");

    const slice2 = sliceWebSpeechResults(results, 0);
    expect(slice2.finals).toEqual(["Tell me about yourself."]);
    expect(slice2.interim).toBe("Sure I started");
  });
});

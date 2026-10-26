import { describe, expect, it } from "vitest";
import { stitchWebSpeechLive } from "@/hooks/use-web-speech-transcription";
import { sliceWebSpeechResults } from "@/lib/web-speech-results";

describe("stitchWebSpeechLive", () => {
  it("joins confirmed and interim", () => {
    expect(stitchWebSpeechLive("Hello", "world")).toBe("Hello world");
  });

  it("trims extra spaces", () => {
    expect(stitchWebSpeechLive("  a  ", "  b  ")).toBe("a b");
  });
});

describe("sliceWebSpeechResults", () => {
  it("does not replay earlier finals when resultIndex advances", () => {
    const results = [
      { isFinal: true, 0: { transcript: "Hello." } },
      { isFinal: true, 0: { transcript: "World." } },
    ] as { isFinal: boolean; 0: { transcript: string } }[];
    expect(sliceWebSpeechResults(results, 1).finals).toEqual(["World."]);
    expect(sliceWebSpeechResults(results, 1).interim).toBe("");
  });
});

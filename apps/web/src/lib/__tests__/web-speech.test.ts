import { describe, expect, it } from "vitest";
import { stitchWebSpeechLive } from "@/lib/web-speech-results";

describe("stitchWebSpeechLive", () => {
  it("joins confirmed and interim", () => {
    expect(stitchWebSpeechLive("Hello", "world")).toBe("Hello world");
  });

  it("trims extra spaces", () => {
    expect(stitchWebSpeechLive("  a  ", "  b  ")).toBe("a b");
  });
});

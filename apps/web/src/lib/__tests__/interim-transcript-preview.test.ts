import { describe, expect, it } from "vitest";
import {
  interimPreviewIsTruncated,
  tailInterimPreview,
} from "@/lib/interim-transcript-preview";

describe("interim transcript preview", () => {
  it("shows the most recent words when collapsed", () => {
    const words = Array.from({ length: 80 }, (_, i) => `w${i}`);
    const full = words.join(" ");
    const preview = tailInterimPreview(full, 5);
    expect(preview.startsWith("w0")).toBe(false);
    expect(preview).toContain("w79");
  });

  it("detects when preview is shorter than full text", () => {
    const full = Array.from({ length: 100 }, (_, i) => `word${i}`).join(" ");
    const preview = tailInterimPreview(full);
    expect(interimPreviewIsTruncated(full, preview)).toBe(true);
    expect(interimPreviewIsTruncated("short phrase", "short phrase")).toBe(false);
  });
});

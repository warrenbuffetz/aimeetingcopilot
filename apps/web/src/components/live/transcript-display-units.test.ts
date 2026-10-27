import { describe, expect, it } from "vitest";
import { buildTranscriptDisplayUnits } from "./transcript-display-units";
import type { TranscriptLine } from "@/hooks/use-live-session";

function line(partial: Partial<TranscriptLine> & Pick<TranscriptLine, "id" | "text" | "kind">): TranscriptLine {
  return {
    sequenceId: 1,
    isFinal: true,
    isQuestion: false,
    ...partial,
  };
}

describe("buildTranscriptDisplayUnits", () => {
  it("merges consecutive readback lines into one display unit", () => {
    const lines: TranscriptLine[] = [
      line({ id: "a", text: "First chunk of answer.", kind: "readback" }),
      line({ id: "b", text: "Second chunk continues.", kind: "readback" }),
      line({ id: "c", text: "Interviewer question?", kind: "question" }),
    ];
    const units = buildTranscriptDisplayUnits(lines);
    expect(units).toHaveLength(2);
    expect(units[0].type).toBe("readback_group");
    if (units[0].type === "readback_group") {
      expect(units[0].lines).toHaveLength(2);
      expect(units[0].fullText).toBe("First chunk of answer. Second chunk continues.");
    }
  });

  it("does not merge readback separated by other kinds", () => {
    const lines: TranscriptLine[] = [
      line({ id: "a", text: "Reading part one.", kind: "readback" }),
      line({ id: "b", text: "Um okay.", kind: "speech" }),
      line({ id: "c", text: "Reading part two.", kind: "readback" }),
    ];
    const units = buildTranscriptDisplayUnits(lines);
    expect(units.every((u) => u.type === "single")).toBe(true);
  });

  it("keeps a single readback as single unit", () => {
    const lines: TranscriptLine[] = [line({ id: "a", text: "Only one.", kind: "readback" })];
    const units = buildTranscriptDisplayUnits(lines);
    expect(units).toHaveLength(1);
    expect(units[0].type).toBe("single");
  });
});

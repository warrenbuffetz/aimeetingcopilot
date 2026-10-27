import type { TranscriptLine } from "@/hooks/use-live-session";
import { countWords } from "@/lib/transcript-display";

export type TranscriptDisplayUnit =
  | { type: "single"; line: TranscriptLine }
  | {
      type: "group";
      groupId: string;
      lines: TranscriptLine[];
      fullText: string;
      wordCount: number;
    }
  | {
      type: "readback_group";
      groupId: string;
      lines: TranscriptLine[];
      fullText: string;
      wordCount: number;
    };

function joinReadbackTexts(groupLines: TranscriptLine[]): string {
  return groupLines
    .map((l) => l.text.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildTranscriptDisplayUnits(lines: TranscriptLine[]): TranscriptDisplayUnit[] {
  const units: TranscriptDisplayUnit[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.speechGroupId && (line.segmentTotal ?? 0) > 1) {
      const groupLines: TranscriptLine[] = [line];
      const gid = line.speechGroupId;
      i += 1;
      while (i < lines.length && lines[i].speechGroupId === gid) {
        groupLines.push(lines[i]);
        i += 1;
      }
      const fullText = line.fullText ?? groupLines.map((l) => l.text).join(" ");
      units.push({
        type: "group",
        groupId: gid,
        lines: groupLines,
        fullText,
        wordCount: countWords(fullText),
      });
      continue;
    }

    if (line.kind === "readback" && line.isFinal) {
      const groupLines: TranscriptLine[] = [line];
      i += 1;
      while (
        i < lines.length &&
        lines[i].kind === "readback" &&
        lines[i].isFinal &&
        !lines[i].speechGroupId
      ) {
        groupLines.push(lines[i]);
        i += 1;
      }
      if (groupLines.length > 1) {
        const fullText = joinReadbackTexts(groupLines);
        units.push({
          type: "readback_group",
          groupId: `readback:${groupLines[0].id}`,
          lines: groupLines,
          fullText,
          wordCount: countWords(fullText),
        });
        continue;
      }
    }

    units.push({ type: "single", line });
    i += 1;
  }
  return units;
}

export function stickToBottomKey(lines: TranscriptLine[]): string {
  const finals = lines.filter((l) => l.isFinal);
  if (finals.length === 0) {
    const interim = lines.find((l) => !l.isFinal);
    return interim ? `interim:${interim.id}` : "empty";
  }
  const last = finals[finals.length - 1];
  return `final:${finals.length}:${last.id}`;
}

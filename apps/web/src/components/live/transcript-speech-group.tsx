"use client";

import type { TranscriptLine } from "@/hooks/use-live-session";
import { excerptWords, lineMatchesQuestionHighlight } from "@/lib/transcript-display";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { TranscriptLineItem } from "@/components/live/transcript-line";

type Props = {
  lines: TranscriptLine[];
  fullText: string;
  wordCount: number;
  expanded: boolean;
  onToggleExpand: () => void;
  highlightQuestion?: string | null;
  selectedTranscriptIds: string[];
  onToggleSelect: (lineId: string, shiftKey: boolean) => void;
  onFindAnswer: (line: TranscriptLine) => void;
  onExploreRelated: (text: string) => void;
  onEditRetry: (line: TranscriptLine) => void;
};

export function TranscriptSpeechGroup({
  lines,
  fullText,
  wordCount,
  expanded,
  onToggleExpand,
  highlightQuestion,
  selectedTranscriptIds,
  onToggleSelect,
  onFindAnswer,
  onExploreRelated,
  onEditRetry,
}: Props) {
  const questionHighlight = lineMatchesQuestionHighlight(fullText, highlightQuestion);
  const first = lines[0];
  const kind = first?.kind ?? "speech";

  if (!expanded && wordCount > 80) {
    return (
      <div
        className={cn(
          "rounded-md px-2 py-1.5",
          questionHighlight && "ring-1 ring-cyan-400/50 bg-cyan-500/10",
          kind === "question" && liveSemantic.transcriptQuestion
        )}
      >
        <p className="text-sm leading-snug">{excerptWords(fullText, 48)}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {lines.length} parts · {wordCount} words
        </p>
        <button
          type="button"
          className="mt-1 text-[10px] font-medium text-sky-300/80 hover:text-sky-200"
          onClick={onToggleExpand}
        >
          Expand full passage
        </button>
        <button
          type="button"
          className="ml-2 mt-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
          onClick={() => onFindAnswer({ ...first, text: fullText, fullText })}
        >
          Find answer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1 border-l border-border/50 pl-2">
      {wordCount > 80 && (
        <button
          type="button"
          className="text-[10px] text-muted-foreground hover:text-foreground"
          onClick={onToggleExpand}
        >
          Collapse passage
        </button>
      )}
      {lines.map((line) => (
        <TranscriptLineItem
          key={line.id}
          line={line}
          selected={selectedTranscriptIds.includes(line.id)}
          highlightQuestion={highlightQuestion}
          onFindAnswer={() => onFindAnswer(line)}
          onToggleSelect={(shift) => onToggleSelect(line.id, shift)}
          onExploreRelated={() => onExploreRelated(line.fullText ?? line.text)}
          onEditRetry={() => onEditRetry(line)}
        />
      ))}
    </div>
  );
}

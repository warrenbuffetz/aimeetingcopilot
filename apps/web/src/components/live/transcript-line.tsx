"use client";

import { useLayoutEffect, useRef } from "react";
import type { TranscriptLine } from "@/hooks/use-live-session";
import { countWords, excerptWords, lineMatchesQuestionHighlight } from "@/lib/transcript-display";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/** Cap live interim height; full text stays inside and scrolls (latest at bottom). */
const LIVE_INTERIM_MAX_HEIGHT = "max-h-36";

const LONG_LINE_COLLAPSE_WORDS = 55;

function LiveInterimBubble({ text, kind }: { text: string; kind: TranscriptLine["kind"] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const readback = kind === "readback";
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [text]);

  return (
    <div
      className={cn(
        "rounded-md border px-2 py-1.5",
        readback
          ? "border-border/60 bg-muted/20"
          : "border-sky-500/25 bg-sky-500/5"
      )}
    >
      <p
        className={cn(
          "text-[10px] font-medium",
          readback ? "text-sky-100/80" : "text-sky-300/90"
        )}
      >
        {readback ? "Reading answer" : "Live speech"}
      </p>
      <div
        ref={scrollRef}
        className={cn(
          "mt-1 overflow-y-auto text-sm leading-snug whitespace-pre-wrap",
          LIVE_INTERIM_MAX_HEIGHT,
          readback ? "text-foreground/75" : "text-ic-answer/90 italic"
        )}
      >
        {text}
      </div>
    </div>
  );
}

function transcriptLineClass(
  kind: TranscriptLine["kind"],
  isFinal: boolean,
  selected: boolean,
  questionHighlight?: boolean
) {
  return cn(
    "rounded-md px-2 py-1 transition-colors",
    !isFinal && "opacity-90",
    selected && liveSemantic.transcriptSelected,
    questionHighlight && "ring-1 ring-cyan-400/50 bg-cyan-500/10",
    kind === "filler" && "text-muted-foreground/70 text-xs",
    kind === "speech" && "text-ic-answer/90",
    kind === "candidate" && "border border-amber-500/50 bg-amber-500/10 text-amber-50/90",
    kind === "question" && liveSemantic.transcriptQuestion,
    kind === "readback" && "border border-border/60 bg-muted/20 text-foreground/75 text-xs",
    (kind === "speech" || kind === "question" || kind === "candidate") &&
      isFinal &&
      "cursor-pointer hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ic-detected/40"
  );
}

const READBACK_COLLAPSE_MIN_WORDS = 12;

export type TranscriptLineItemProps = {
  line: TranscriptLine;
  selected?: boolean;
  highlightQuestion?: string | null;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onFindAnswer: () => void;
  onToggleSelect?: (shiftKey: boolean) => void;
  onExploreRelated?: () => void;
  onEditRetry?: () => void;
};

export function TranscriptLineItem({
  line,
  selected = false,
  highlightQuestion = null,
  expanded = false,
  onToggleExpand,
  onFindAnswer,
  onToggleSelect,
  onExploreRelated,
  onEditRetry,
}: TranscriptLineItemProps) {
  const interactive =
    line.isFinal && (line.kind === "speech" || line.kind === "question" || line.kind === "candidate");

  const wordCount = countWords(line.text);
  const questionHighlight =
    line.kind === "question" ||
    lineMatchesQuestionHighlight(line.fullText ?? line.text, highlightQuestion);

  if (!line.isFinal) {
    return <LiveInterimBubble text={line.text} kind={line.kind} />;
  }

  const collapsibleReadback = line.kind === "readback" && wordCount >= READBACK_COLLAPSE_MIN_WORDS;
  const collapsibleLongSpeech =
    line.isFinal && wordCount >= LONG_LINE_COLLAPSE_WORDS && line.kind !== "readback";

  if (collapsibleReadback) {
    const preview =
      line.text.length > 64 ? `${line.text.slice(0, 64).trim()}…` : line.text;
    return (
      <div>
        <details
          className={cn(transcriptLineClass(line.kind, line.isFinal, selected, questionHighlight), "group py-1.5")}
        >
          <summary className="cursor-pointer list-none outline-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start gap-1.5">
              <ChevronRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300/80 transition-transform group-open:rotate-90"
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="font-medium text-sky-100/90">Reading answer</span>
                <span className="text-muted-foreground"> · {wordCount} words</span>
                <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted-foreground/90">
                  {preview}
                </span>
              </span>
            </span>
          </summary>
          <p className="mt-2 border-t border-sky-500/20 pt-2 text-[11px] leading-relaxed text-foreground/80">
            {line.text}
          </p>
        </details>
      </div>
    );
  }

  if (collapsibleLongSpeech && !expanded) {
    const preview = excerptWords(line.text, 42);
    return (
      <div className={transcriptLineClass(line.kind, line.isFinal, selected, questionHighlight)}>
        <p className="text-sm leading-snug">{preview}</p>
        {onToggleExpand && (
          <button
            type="button"
            className="mt-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
            onClick={onToggleExpand}
          >
            {wordCount} words · Expand
          </button>
        )}
      </div>
    );
  }

  if (line.kind === "readback") {
    return (
      <div className={transcriptLineClass(line.kind, line.isFinal, selected, questionHighlight)}>
        <span className="font-medium text-sky-100/80">Reading answer · </span>
        {line.text}
      </div>
    );
  }

  if (!interactive) {
    return (
      <div className={transcriptLineClass(line.kind, line.isFinal, selected, questionHighlight)}>{line.text}</div>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className={cn(
          "w-full text-left",
          transcriptLineClass(line.kind, line.isFinal, selected, questionHighlight)
        )}
        onClick={(e) => {
          if (e.shiftKey && onToggleSelect) {
            onToggleSelect(true);
            return;
          }
          onFindAnswer();
        }}
        title="Find answer for this transcript (Shift+click to combine bubbles)"
      >
        {line.text}
      </button>
      <div className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton
            render={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                aria-label="Transcript actions"
              />
            }
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs">
            <DropdownMenuItem onClick={onFindAnswer}>Find answer</DropdownMenuItem>
            {onExploreRelated && (
              <DropdownMenuItem onClick={onExploreRelated}>Explore related answers</DropdownMenuItem>
            )}
            {onEditRetry && <DropdownMenuItem onClick={onEditRetry}>Edit and retry</DropdownMenuItem>}
            {onToggleSelect && (
              <DropdownMenuItem onClick={() => onToggleSelect(false)}>Select for combine</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

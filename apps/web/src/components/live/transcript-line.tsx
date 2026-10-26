"use client";

import type { TranscriptLine } from "@/hooks/use-live-session";
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

function transcriptLineClass(
  kind: TranscriptLine["kind"],
  isFinal: boolean,
  selected: boolean
) {
  return cn(
    "rounded-md px-2 py-1 transition-colors",
    !isFinal && "opacity-60 italic",
    selected && liveSemantic.transcriptSelected,
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
  onFindAnswer: () => void;
  onToggleSelect?: (shiftKey: boolean) => void;
  onExploreRelated?: () => void;
  onEditRetry?: () => void;
};

export function TranscriptLineItem({
  line,
  selected = false,
  onFindAnswer,
  onToggleSelect,
  onExploreRelated,
  onEditRetry,
}: TranscriptLineItemProps) {
  const interactive =
    line.isFinal && (line.kind === "speech" || line.kind === "question" || line.kind === "candidate");

  const wordCount = line.text.split(/\s+/).filter(Boolean).length;
  const collapsibleReadback = line.kind === "readback" && wordCount >= READBACK_COLLAPSE_MIN_WORDS;

  if (collapsibleReadback) {
    const preview =
      line.text.length > 64 ? `${line.text.slice(0, 64).trim()}…` : line.text;
    return (
      <div>
        <details className={cn(transcriptLineClass(line.kind, line.isFinal, selected), "group py-1.5")}>
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

  if (line.kind === "readback") {
    return (
      <div className={transcriptLineClass(line.kind, line.isFinal, selected)}>
        <span className="font-medium text-sky-100/80">Reading answer · </span>
        {line.text}
      </div>
    );
  }

  if (!interactive) {
    return <div className={transcriptLineClass(line.kind, line.isFinal, selected)}>{line.text}</div>;
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className={cn("w-full text-left", transcriptLineClass(line.kind, line.isFinal, selected))}
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

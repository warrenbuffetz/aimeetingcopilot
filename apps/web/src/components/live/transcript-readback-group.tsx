"use client";

import type { TranscriptLine } from "@/hooks/use-live-session";
import { countWords } from "@/lib/transcript-display";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const PREVIEW_CHARS = 72;

type Props = {
  lines: TranscriptLine[];
  fullText: string;
  expanded: boolean;
  onToggleExpand: () => void;
};

/** Display-only merge of consecutive readback transcript lines (one bubble). */
export function TranscriptReadbackGroup({ lines, fullText, expanded, onToggleExpand }: Props) {
  const wordCount = countWords(fullText);
  const preview =
    fullText.length > PREVIEW_CHARS ? `${fullText.slice(0, PREVIEW_CHARS).trim()}…` : fullText;
  const collapsible = wordCount >= 12;

  if (!collapsible) {
    return (
      <div className="rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-xs text-foreground/75">
        <span className="font-medium text-sky-100/80">Reading answer · </span>
        {fullText}
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        className={cn(
          "w-full rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-left text-xs text-foreground/75",
          "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30"
        )}
        onClick={onToggleExpand}
      >
        <span className="flex items-start gap-1.5">
          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300/80" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="font-medium text-sky-100/90">Reading answer</span>
            <span className="text-muted-foreground">
              {" "}
              · {wordCount} words
              {lines.length > 1 ? ` · ${lines.length} segments` : ""}
            </span>
            <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted-foreground/90">
              {preview}
            </span>
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-xs text-foreground/75">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sky-100/90">
          Reading answer · {wordCount} words
          {lines.length > 1 ? ` · ${lines.length} segments` : ""}
        </span>
        <button
          type="button"
          className="shrink-0 text-[10px] text-muted-foreground hover:text-foreground"
          onClick={onToggleExpand}
        >
          Collapse
        </button>
      </div>
      <p className="mt-2 border-t border-sky-500/20 pt-2 text-[11px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
        {fullText}
      </p>
    </div>
  );
}

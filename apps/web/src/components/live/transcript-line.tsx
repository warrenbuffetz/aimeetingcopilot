"use client";

import type { TranscriptLine } from "@/hooks/use-live-session";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

function transcriptLineClass(kind: TranscriptLine["kind"], isFinal: boolean) {
  return cn(
    "rounded-md px-2 py-1",
    !isFinal && "opacity-60 italic",
    kind === "filler" && "text-muted-foreground/70 text-xs",
    kind === "speech" && "text-foreground/80",
    kind === "candidate" && "border border-amber-500/50 bg-amber-500/10 text-amber-50/90",
    kind === "question" && "border border-emerald-500/40 bg-emerald-500/10",
    kind === "readback" && "border border-sky-500/25 bg-sky-500/10 text-foreground/75 text-xs"
  );
}

const READBACK_COLLAPSE_MIN_WORDS = 12;

export function TranscriptLineItem({ line }: { line: TranscriptLine }) {
  const wordCount = line.text.split(/\s+/).filter(Boolean).length;
  const collapsibleReadback = line.kind === "readback" && wordCount >= READBACK_COLLAPSE_MIN_WORDS;

  if (collapsibleReadback) {
    const preview =
      line.text.length > 64 ? `${line.text.slice(0, 64).trim()}…` : line.text;
    return (
      <li>
        <details className={cn(transcriptLineClass(line.kind, line.isFinal), "group py-1.5")}>
          <summary
            className="cursor-pointer list-none outline-none [&::-webkit-details-marker]:hidden"
          >
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
      </li>
    );
  }

  if (line.kind === "readback") {
    return (
      <li className={transcriptLineClass(line.kind, line.isFinal)}>
        <span className="font-medium text-sky-100/80">Reading answer · </span>
        {line.text}
      </li>
    );
  }

  return <li className={transcriptLineClass(line.kind, line.isFinal)}>{line.text}</li>;
}

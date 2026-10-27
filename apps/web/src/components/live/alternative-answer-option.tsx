"use client";

import type { ClosestLibrarySuggestion, EnrichedQaRow } from "@interview-copilot/shared";
import { intentLabel } from "@interview-copilot/shared";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  alt: ClosestLibrarySuggestion;
  catalog: EnrichedQaRow[];
  isPending: boolean;
  onSelect: () => void;
};

export function AlternativeAnswerOption({ alt, catalog, isPending, onSelect }: Props) {
  const row = catalog.find((r) => r.id === alt.sourceId);
  const meta = row?.navigator;
  const showCanonical =
    alt.libraryQuestion.trim().toLowerCase() !== alt.matchedLabel.trim().toLowerCase();
  const shortPreview = row?.navigator.shortAnswer?.slice(0, 120);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => onSelect()}
      className={cn(
        "group w-full touch-manipulation select-none px-2.5 py-2 text-left text-xs",
        "transition-[transform,background-color,border-color] duration-100 ease-out",
        "active:scale-[0.99] active:bg-ic-alternative-surface",
        "hover:border-ic-alternative/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ic-alternative/40",
        liveSemantic.surfaceAlternative,
        isPending && "ring-1 ring-ic-alternative/35"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("min-w-0 flex-1 font-medium leading-snug", liveSemantic.textAnswer)}>
          {alt.matchedLabel}
        </span>
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-ic-alternative" aria-hidden />
        ) : (
          <span
            className={cn(
              "shrink-0 text-[9px] uppercase tracking-wide",
              liveSemantic.labelAlternative,
              "opacity-60 group-hover:opacity-100"
            )}
            title="Alternative library match (rank is not a probability)"
          >
            Alt
          </span>
        )}
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-150 ease-out",
          "grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100",
          "group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100",
          "max-sm:grid-rows-[1fr] max-sm:opacity-100"
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1.5 space-y-1 border-t border-ic-alternative/20 pt-1.5 text-[10px] leading-snug text-muted-foreground">
            {meta && (
              <p>
                {meta.experienceLabel}
                {meta.intent !== "general" && ` · ${intentLabel(meta.intent)}`}
              </p>
            )}
            {showCanonical && (
              <p>
                <span className="text-ic-alternative/90">Library: </span>
                <span className="text-foreground/85">{alt.libraryQuestion}</span>
              </p>
            )}
            {shortPreview && (
              <p className="line-clamp-2 text-foreground/70">{shortPreview}…</p>
            )}
            <p className={liveSemantic.labelAlternative}>Click to use this answer</p>
          </div>
        </div>
      </div>
    </button>
  );
}

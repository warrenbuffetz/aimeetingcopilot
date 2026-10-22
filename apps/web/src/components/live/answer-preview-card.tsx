"use client";

import { intentLabel, type EnrichedQaRow, type FollowUpSuggestion } from "@interview-copilot/shared";
import { Button } from "@/components/ui/button";
import { ScriptText } from "@/components/live/script-text";
import { cn } from "@/lib/utils";
import { Copy, Pin } from "lucide-react";
import { toast } from "sonner";

const expandedAnswerCopyClass =
  "rounded-md border border-white/20 bg-secondary px-3 py-2.5 text-xs leading-[1.55] text-secondary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] border-l-[3px] border-l-sky-500/90 [&_p]:text-secondary-foreground";

function evidenceWarning(status: EnrichedQaRow["navigator"]["evidenceStatus"]): string | null {
  switch (status) {
    case "illustrative_scenario":
      return "Illustrative — not a verified resume fact";
    case "rehearsal_framework":
      return "Rehearsal framework — validate before claiming";
    case "unverified_detail":
      return "Detail requires verification";
    default:
      return null;
  }
}

type PreviewSource = EnrichedQaRow | FollowUpSuggestion;

function rowFromSource(source: PreviewSource, catalog: EnrichedQaRow[]): EnrichedQaRow | null {
  if ("navigator" in source) return source;
  return catalog.find((r) => r.id === source.rowId) ?? null;
}

export function AnswerPreviewCard({
  source,
  catalog,
  expanded,
  onToggle,
  onOpenMain,
  onPin,
  showShortFirst = false,
}: {
  source: PreviewSource;
  catalog: EnrichedQaRow[];
  expanded: boolean;
  onToggle: () => void;
  onOpenMain: () => void;
  onPin: () => void;
  showShortFirst?: boolean;
}) {
  const row = rowFromSource(source, catalog);
  const question = "question" in source && !("navigator" in source) ? source.question : source.question;
  const answer = source.answer;
  const short = row?.navigator.shortAnswer;
  const warn = row ? evidenceWarning(row.navigator.evidenceStatus) : null;
  const label = row?.navigator.experienceLabel ?? ("experienceLabel" in source ? source.experienceLabel : "");
  const intent = row?.navigator.intent ?? ("intent" in source ? source.intent : "general");

  const displayBody =
    showShortFirst && short && !expanded ? short : answer;

  return (
    <div className="rounded-md border border-border/80 bg-muted/10">
      <button type="button" className="flex w-full items-start gap-1 px-2 py-1.5 text-left" onClick={onToggle}>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-snug">{question}</p>
          <p className="text-[10px] text-muted-foreground">
            {label} · {intentLabel(intent)}
          </p>
          {warn && <p className="mt-0.5 text-[10px] text-amber-400/90">{warn}</p>}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-white/15 bg-card px-2.5 pb-2.5 pt-2">
          {short && (
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Quick reference
            </p>
          )}
          <ScriptText
            text={displayBody}
            className={cn("max-h-40 overflow-y-auto", expandedAnswerCopyClass)}
          />
          {short && expanded && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[10px] text-primary">Full prepared answer</summary>
              <ScriptText text={answer} className={cn("mt-1 max-h-48 overflow-y-auto", expandedAnswerCopyClass)} />
            </details>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            <Button type="button" size="sm" variant="secondary" className="h-7 text-xs" onClick={onOpenMain}>
              Open in main panel
            </Button>
            <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={onPin}>
              <Pin className="h-3 w-3" />
              Pin
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => {
                void navigator.clipboard.writeText(answer);
                toast.success("Copied");
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

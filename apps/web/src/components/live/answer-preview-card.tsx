"use client";

import { intentLabel, type EnrichedQaRow, type FollowUpSuggestion } from "@interview-copilot/shared";
import { Button } from "@/components/ui/button";
import { ScriptText } from "@/components/live/script-text";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { ChevronDown, Copy, Pin } from "lucide-react";
import { toast } from "sonner";

function expandedAnswerCopyClass(accent: "suggested" | "library" | "alternative" | "neutral") {
  const border =
    accent === "suggested"
      ? "border-l-ic-suggested/75"
      : accent === "library"
        ? "border-l-ic-library/70"
        : accent === "alternative"
          ? "border-l-ic-alternative/55"
          : "border-l-border";
  return cn(
    "rounded-md border border-white/20 bg-secondary px-3 py-2.5 text-xs leading-[1.55] text-ic-answer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] border-l-[3px]",
    border,
    "[&_p]:text-ic-answer"
  );
}

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
  semanticAccent = "neutral",
  showExpandChevron = false,
  activeInMainPanel = false,
}: {
  source: PreviewSource;
  catalog: EnrichedQaRow[];
  expanded: boolean;
  onToggle: () => void;
  onOpenMain: () => void;
  onPin: () => void;
  showShortFirst?: boolean;
  semanticAccent?: "suggested" | "library" | "alternative" | "neutral";
  showExpandChevron?: boolean;
  activeInMainPanel?: boolean;
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

  const copyClass = expandedAnswerCopyClass(semanticAccent);

  return (
    <div
      className={cn(
        "rounded-md border border-border/80 bg-muted/10",
        semanticAccent === "suggested" && "hover:border-ic-suggested/25",
        semanticAccent === "library" && "hover:border-ic-library/25",
        activeInMainPanel && "border-ic-suggested/50 ring-1 ring-ic-suggested/25"
      )}
    >
      <button
        type="button"
        className="flex w-full items-start gap-1.5 px-2 py-1.5 text-left"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        {showExpandChevron && (
          <ChevronDown
            className={cn(
              "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180 text-foreground"
            )}
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <p className={cn("text-xs font-medium leading-snug", liveSemantic.textAnswer)}>{question}</p>
          <p className="text-[10px] text-muted-foreground">
            {label} · {intentLabel(intent)}
            {activeInMainPanel && (
              <span className={cn("ml-1", liveSemantic.labelSuggested)}>· Open in main panel</span>
            )}
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
          <ScriptText text={displayBody} className={cn("max-h-40 overflow-y-auto", copyClass)} />
          {short && expanded && (
            <details className="mt-2">
              <summary className="cursor-pointer text-[10px] text-primary">Full prepared answer</summary>
              <ScriptText text={answer} className={cn("mt-1 max-h-48 overflow-y-auto", copyClass)} />
            </details>
          )}
          {row?.navigator.supplementalTalkingPoints?.map((block) => (
            <details key={block.label} className="mt-2 rounded border border-border/60 bg-muted/10 px-2 py-1">
              <summary className="cursor-pointer text-[10px] font-medium text-primary">{block.label}</summary>
              <ScriptText text={block.content} className={cn("mt-1 max-h-40 overflow-y-auto text-xs", copyClass)} />
            </details>
          ))}
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

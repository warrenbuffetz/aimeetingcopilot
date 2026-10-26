"use client";

import type { AnalyzeQuestionResult } from "@interview-copilot/shared";
import type { QuestionAnalyzeSource } from "@/hooks/use-live-session";
import { Button } from "@/components/ui/button";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { Map, RotateCcw } from "lucide-react";

export type DetectedQuestionsPanelProps = {
  questionHistory: AnalyzeQuestionResult[];
  historyIndex: number;
  historySources: QuestionAnalyzeSource[];
  loading: boolean;
  candidateText: string | null;
  onSelectIndex: (index: number) => void;
  onJumpToLatest: () => void;
  onReanalyze: (question: string) => void;
  onExplore: (question: string) => void;
};

function sourceLabel(source: QuestionAnalyzeSource | undefined) {
  if (source === "manual") return "Manual";
  if (source === "candidate") return "Confirmed";
  if (source === "browse") return "Library";
  return null;
}

export function DetectedQuestionsPanel({
  questionHistory,
  historyIndex,
  historySources,
  loading,
  candidateText,
  onSelectIndex,
  onJumpToLatest,
  onReanalyze,
  onExplore,
}: DetectedQuestionsPanelProps) {
  const hasHistory = questionHistory.length > 0;
  const isLatest = historyIndex === questionHistory.length - 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border px-2 py-2">
        <p className={cn("text-[10px] font-medium uppercase tracking-wide", liveSemantic.labelDetected)}>
          Detected questions
        </p>
        <p className="text-[10px] text-muted-foreground">Interviewer prompts only — not your spoken answers.</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {candidateText && (
          <div className="mb-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1.5">
            <p className="text-[10px] font-medium text-amber-200/80">Pending</p>
            <p className="line-clamp-3 text-xs text-amber-50/95">{candidateText}</p>
          </div>
        )}
        {!hasHistory && !candidateText && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            No questions detected yet. Select a transcript segment to find an answer.
          </p>
        )}
        <ul className="space-y-1.5">
          {questionHistory.map((entry, index) => {
            const active = index === historyIndex;
            const tag = sourceLabel(historySources[index]);
            return (
              <li key={`${index}-${entry.question.slice(0, 24)}`}>
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-md border px-2 py-2 text-left transition-colors",
                    active
                      ? "border-ic-detected/40 bg-ic-detected-surface ring-1 ring-ic-detected/25"
                      : "border-border/70 bg-muted/15 hover:bg-muted/30"
                  )}
                  onClick={() => onSelectIndex(index)}
                >
                  <p className="line-clamp-3 text-xs font-medium leading-snug">{entry.question}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                    {index === questionHistory.length - 1 && (
                      <span className={liveSemantic.labelDetected}>Latest</span>
                    )}
                    {tag && <span>{tag}</span>}
                    {loading && active && <span>Retrieving…</span>}
                  </div>
                </button>
                {active && (
                  <div className="mt-1 flex flex-wrap gap-1 px-0.5">
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => onReanalyze(entry.question)}>
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Reanalyze
                    </Button>
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => onExplore(entry.question)}>
                      <Map className="mr-1 h-3 w-3" />
                      Explore
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {hasHistory && !isLatest && (
        <div className="border-t border-border p-2">
          <Button type="button" size="sm" variant="outline" className="h-8 w-full text-xs" onClick={onJumpToLatest}>
            Return to latest question
          </Button>
        </div>
      )}
    </div>
  );
}

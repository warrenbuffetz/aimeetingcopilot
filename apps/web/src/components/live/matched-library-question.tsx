"use client";

import type { AnalyzeQuestionResult } from "@interview-copilot/shared";
import { intentLabel, questionsEquivalentForDisplay, type EnrichedQaRow } from "@interview-copilot/shared";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";

type Props = {
  detectedQuestion: string | null;
  result: AnalyzeQuestionResult | null;
  matchedMeta: EnrichedQaRow["navigator"] | undefined;
  onInspectLibraryQuestion: (libraryQuestion: string) => void;
};

export function MatchedLibraryQuestionBlock({
  detectedQuestion,
  result,
  matchedMeta,
  onInspectLibraryQuestion,
}: Props) {
  const libraryQuestion =
    result?.preparedQuestion?.trim() ||
    (result?.outcome === "PREPARED" ? result.matches[0]?.title?.trim() : "") ||
    "";

  if (!libraryQuestion || !result?.answer) return null;

  const detected = (detectedQuestion ?? result.question ?? "").trim();
  const collapsed =
    detected.length > 0 && questionsEquivalentForDisplay(detected, libraryQuestion);

  const alias =
    result.matchedFollowUpQuestion &&
    result.matchedFollowUpQuestion.trim() !== libraryQuestion
      ? result.matchedFollowUpQuestion.trim()
      : null;

  if (collapsed) {
    return (
      <p className="mt-2 text-[11px] text-muted-foreground">
        Matched prepared answer
        {matchedMeta?.experienceLabel && (
          <>
            {" "}
            ·{" "}
            <button
              type="button"
              className={cn(liveSemantic.labelLibrary, "underline-offset-2 hover:underline")}
              onClick={() => onInspectLibraryQuestion(libraryQuestion)}
            >
              {matchedMeta.experienceLabel}
            </button>
          </>
        )}
      </p>
    );
  }

  return (
    <div className={cn("mt-3 max-w-3xl", liveSemantic.surfaceLibrary)}>
      <p className={cn("text-[10px] font-medium uppercase tracking-wide", liveSemantic.labelLibrary)}>
        Matched library question
      </p>
      <button
        type="button"
        className={cn(
          "mt-1 w-full text-left text-sm font-medium leading-snug",
          liveSemantic.textAnswer,
          "rounded-sm hover:underline underline-offset-2"
        )}
        onClick={() => onInspectLibraryQuestion(libraryQuestion)}
        title="Explore this library entry in Question Map"
      >
        {libraryQuestion}
      </button>
      {alias && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Matched phrasing: <span className="text-foreground/85">{alias}</span>
        </p>
      )}
      {matchedMeta && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          {matchedMeta.experienceLabel}
          {matchedMeta.intent !== "general" && ` · ${intentLabel(matchedMeta.intent)}`}
          {matchedMeta.evidenceStatus === "illustrative_scenario" && (
            <span className="text-amber-400/90"> · illustrative</span>
          )}
        </p>
      )}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import { findConceptSpans, type ConceptSpan } from "@interview-copilot/shared";
import type { EnrichedQaRow } from "@interview-copilot/shared";

export function DetectedQuestionConcepts({
  question,
  catalog,
  onExploreConcept,
}: {
  question: string;
  catalog: EnrichedQaRow[];
  onExploreConcept: (span: ConceptSpan) => void;
}) {
  const spans = findConceptSpans(question, catalog);
  if (!spans.length) {
    return <span>{question}</span>;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start > cursor) {
      parts.push(question.slice(cursor, span.start));
    }
    parts.push(
      <button
        key={`${span.start}-${span.label}`}
        type="button"
        className="rounded-sm bg-muted/40 px-0.5 text-foreground underline decoration-dotted underline-offset-2 hover:bg-sky-500/20"
        onClick={() => onExploreConcept(span)}
        title={`Explore ${span.label} in Question Map`}
      >
        {question.slice(span.start, span.end)}
      </button>
    );
    cursor = span.end;
  }
  if (cursor < question.length) {
    parts.push(question.slice(cursor));
  }
  return <>{parts}</>;
}

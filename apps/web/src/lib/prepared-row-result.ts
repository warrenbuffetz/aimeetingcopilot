import type { AnalyzeQuestionResult, EnrichedQaRow } from "@interview-copilot/shared";

/** Load a specific library row into the live answer panel (browse / navigator). */
export function analyzeResultFromPreparedRow(
  row: EnrichedQaRow,
  opts?: { preserveDetectedQuestion?: string | null }
): AnalyzeQuestionResult {
  const answer = row.navigator.spokenAnswer?.trim() || row.answer;
  const short = row.navigator.shortAnswer?.trim();
  return {
    question: opts?.preserveDetectedQuestion?.trim() || row.question,
    outcome: "PREPARED",
    confidence: 1,
    preparedQuestion: row.question,
    answer,
    sourceLabel: "Your prepared answer (library browse)",
    talkingPoints: short && short !== answer ? [short] : [],
    matches: [
      {
        id: row.id,
        contentType: "prepared_qa",
        sourceId: row.id,
        title: row.question,
        content: answer,
        similarity: 1,
      },
    ],
    matchMethod: "lexical",
    semanticStatus: "lexical_only",
  };
}

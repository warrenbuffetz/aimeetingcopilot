import type { BristolQuestion } from "./dataset";

/** Normalize for comparing POV line to the first answer paragraph. */
export function normalizeAnswerCompare(text: string): string {
  return text
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Full spoken answer minus the ~10s POV when that POV is already shown above
 * (quickDecision matches the first paragraph, or shortAnswer when quickDecision is set).
 */
export function structuredScenarioAnswerText(question: BristolQuestion): string {
  const answer = question.answer.trim();
  const scenario = question.scenario;
  if (!scenario || !answer) return answer;

  const paragraphs = answer.split(/\n\n+/).filter(Boolean);
  if (paragraphs.length <= 1) return answer;

  const first = paragraphs[0]!;
  const firstNorm = normalizeAnswerCompare(first);

  const quick = scenario.quickDecision?.trim();
  if (quick && firstNorm === normalizeAnswerCompare(quick)) {
    return paragraphs.slice(1).join("\n\n");
  }

  const short = question.shortAnswer?.trim();
  if (quick && short && firstNorm === normalizeAnswerCompare(short)) {
    return paragraphs.slice(1).join("\n\n");
  }

  return answer;
}

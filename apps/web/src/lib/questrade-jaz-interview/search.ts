import type { JazInterviewQuestion } from "./dataset";

function fold(text: string): string {
  return text.toLowerCase().replace(/[’']/g, "'");
}

export type JazInterviewSearchHit = {
  questionId: string;
  followUpId?: string;
  score: number;
};

export function searchJazInterviewQuestions(
  questions: JazInterviewQuestion[],
  query: string
): JazInterviewSearchHit[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];
  const hits: JazInterviewSearchHit[] = [];
  for (const question of questions) {
    const hay = fold(
      [question.title, question.navigationLabel, ...question.aliases, ...question.questionTriggers].join(" ")
    );
    let score = 0;
    if (hay.includes(q)) score += 40;
    if (question.curatedKey.toLowerCase().includes(q)) score += 30;
    if (score) hits.push({ questionId: question.id, score });
    for (const follow of question.followUps) {
      const fh = fold(follow.question + " " + follow.answer);
      if (fh.includes(q)) hits.push({ questionId: question.id, followUpId: follow.id, score: 50 });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 24);
}

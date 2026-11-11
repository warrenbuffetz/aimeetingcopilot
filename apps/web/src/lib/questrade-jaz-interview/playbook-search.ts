import {
  playbookCases,
  primerLiveData,
  type PlaybookCase,
} from "@/lib/questrade-jaz-interview/playbook-cases";
import { LIVE_CASE_TRIGGERS, matchLiveTrigger } from "@/lib/questrade-jaz-interview/playbook-live-nav";

function fold(text: string): string {
  return text.toLowerCase().replace(/[’']/g, "'");
}

export type PlaybookSearchHit = {
  kind: "case" | "primer" | "trigger";
  id: string;
  label: string;
  subtitle: string;
  score: number;
  caseId?: string;
  categoryId?: string;
};

function scoreHay(hay: string, q: string): number {
  const h = fold(hay);
  if (h.includes(q)) {
    if (h === q) return 90;
    if (h.startsWith(q)) return 60;
    return 40;
  }
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length < 2) return 0;
  const matched = tokens.filter((t) => h.includes(t)).length;
  if (matched === tokens.length) return 30 + matched * 5;
  if (matched >= Math.ceil(tokens.length * 0.6)) return 18 + matched * 3;
  return 0;
}

export function searchPlaybookCases(query: string): PlaybookSearchHit[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];
  const hits: PlaybookSearchHit[] = [];

  for (const item of playbookCases) {
    const hay = [
      item.id,
      item.title,
      item.categoryLabel,
      item.clarify,
      item.hypothesis,
      item.spokenAnswer,
      ...item.aliases,
    ].join(" ");
    const sc = scoreHay(hay, q);
    if (!sc) continue;
    hits.push({
      kind: "case",
      id: item.id,
      label: `${item.id} · ${item.title}`,
      subtitle: item.categoryLabel,
      score: sc + (item.priority ? 12 : 0),
      caseId: item.id,
      categoryId: item.priority ? "priority" : item.categoryId,
    });
  }

  for (const d of primerLiveData.distinctions) {
    const sc = scoreHay(`${d.label} ${d.question} ${d.distinction}`, q);
    if (!sc) continue;
    hits.push({
      kind: "primer",
      id: `dist-${d.label}`,
      label: d.label,
      subtitle: d.distinction,
      score: sc + 5,
    });
  }

  for (const t of primerLiveData.navMatrix) {
    const sc = scoreHay(`${t.trigger} ${t.rootProblem} ${t.intervention}`, q);
    if (!sc) continue;
    const live = matchLiveTrigger(t.trigger) ?? LIVE_CASE_TRIGGERS.find((x) => fold(x.label) === fold(t.trigger));
    hits.push({
      kind: "trigger",
      id: `trig-${t.trigger}`,
      label: t.trigger,
      subtitle: `${t.rootProblem} → ${t.intervention}`,
      score: sc + 8,
      caseId: live?.primaryCaseId,
    });
  }

  for (const t of LIVE_CASE_TRIGGERS) {
    const hay = `${t.label} ${t.hints.join(" ")} ${t.primaryCaseId}`;
    const sc = scoreHay(hay, q);
    if (!sc) continue;
    hits.push({
      kind: "trigger",
      id: `live-${t.id}`,
      label: t.label,
      subtitle: `Open ${t.primaryCaseId}`,
      score: sc + 14,
      caseId: t.primaryCaseId,
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, 24);
}

export function relatedCasesByTrigger(trigger: string): PlaybookCase[] {
  const q = fold(trigger);
  return playbookCases
    .map((item) => ({
      item,
      score: scoreHay(`${item.title} ${item.hypothesis} ${item.spokenAnswer}`, q),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.item);
}

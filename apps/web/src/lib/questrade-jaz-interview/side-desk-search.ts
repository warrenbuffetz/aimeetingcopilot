import {
  SIDE_DESK_CHEAT_SHEETS,
  type SideDeskCheatSheet,
  type SideDeskCheatSheetId,
} from "@/lib/questrade-jaz-interview/side-desk-cheat-sheet";
import { SIDE_DESK_LIVE_CATALOGS } from "@/lib/questrade-jaz-interview/side-desk-live-catalog";

function fold(text: string): string {
  return text.toLowerCase().replace(/[’']/g, "'");
}

export type SideDeskSearchHit = {
  sheetId: SideDeskCheatSheetId;
  sectionId: string;
  sectionTitle: string;
  label: string;
  subtitle: string;
  score: number;
  cardId?: string;
};

function scoreHay(hay: string, q: string): number {
  const h = fold(hay);
  if (!h.includes(q)) return 0;
  if (h === q) return 80;
  if (h.startsWith(q)) return 55;
  return 35;
}

export function searchSideDeskCheatSheets(query: string, sheetId?: SideDeskCheatSheetId): SideDeskSearchHit[] {
  const q = fold(query.trim());
  if (q.length < 2) return [];

  const sheets = sheetId ? [SIDE_DESK_CHEAT_SHEETS[sheetId]] : Object.values(SIDE_DESK_CHEAT_SHEETS);
  const hits: SideDeskSearchHit[] = [];
  const seen = new Set<string>();

  function push(hit: SideDeskSearchHit) {
    const key = `${hit.sheetId}:${hit.cardId ?? hit.sectionId}:${hit.label}`;
    if (seen.has(key)) return;
    seen.add(key);
    hits.push(hit);
  }

  for (const sheet of sheets) {
    collectCardHits(sheet.id, q, push);
    collectSectionHits(sheet, q, push);
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, 24);
}

function collectCardHits(
  sheetId: SideDeskCheatSheetId,
  q: string,
  push: (hit: SideDeskSearchHit) => void
) {
  const catalog = SIDE_DESK_LIVE_CATALOGS[sheetId];
  for (const card of catalog.cards) {
    const hay = `${card.label} ${card.subtitle} ${card.match.join(" ")} ${card.kind}`;
    const sc = scoreHay(hay, q);
    if (!sc) continue;
    push({
      sheetId,
      sectionId: card.flowStepId,
      sectionTitle: catalog.flowSteps.find((s) => s.id === card.flowStepId)?.label ?? card.flowStepId,
      label: card.label,
      subtitle: card.subtitle,
      score: sc + (card.priority ? 10 : 0) + 15,
      cardId: card.id,
    });
  }
}

function collectSectionHits(
  sheet: SideDeskCheatSheet,
  q: string,
  push: (hit: SideDeskSearchHit) => void
) {
  for (const section of sheet.sections) {
    const base = `${section.title} ${(section.prose ?? []).join(" ")}`;
    let sc = scoreHay(base, q);
    if (sc) {
      push({
        sheetId: sheet.id,
        sectionId: section.id,
        sectionTitle: section.title,
        label: section.title.replace(/^[A-Z]\.\s*/, ""),
        subtitle: sheet.id.replace("-", " "),
        score: sc,
      });
    }
    for (const row of section.table?.rows ?? []) {
      const hay = row.join(" ");
      sc = scoreHay(hay, q);
      if (!sc) continue;
      // Prefer card hit if a live card already covers this label
      const catalog = SIDE_DESK_LIVE_CATALOGS[sheet.id];
      const card = catalog.cards.find((c) =>
        c.match.some((m) => fold(hay).includes(fold(m)) || fold(m).includes(fold(row[0] ?? "")))
      );
      if (card) {
        push({
          sheetId: sheet.id,
          sectionId: card.flowStepId,
          sectionTitle: section.title,
          label: card.label,
          subtitle: card.subtitle,
          score: sc + 20,
          cardId: card.id,
        });
        continue;
      }
      push({
        sheetId: sheet.id,
        sectionId: section.id,
        sectionTitle: section.title,
        label: row[0] ?? "",
        subtitle: row.slice(1).join(" · ").slice(0, 96),
        score: sc + 5,
      });
    }
  }
}

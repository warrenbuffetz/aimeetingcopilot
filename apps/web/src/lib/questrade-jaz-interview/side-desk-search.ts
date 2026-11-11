import {
  SIDE_DESK_CHEAT_SHEETS,
  type SideDeskCheatSheet,
  type SideDeskCheatSheetId,
} from "@/lib/questrade-jaz-interview/side-desk-cheat-sheet";

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

  for (const sheet of sheets) {
    collectHits(sheet, q, hits);
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, 24);
}

function collectHits(sheet: SideDeskCheatSheet, q: string, hits: SideDeskSearchHit[]) {
  for (const section of sheet.sections) {
    const base = `${section.title} ${(section.prose ?? []).join(" ")}`;
    let sc = scoreHay(base, q);
    if (sc) {
      hits.push({
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
      if (sc) {
        hits.push({
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
}

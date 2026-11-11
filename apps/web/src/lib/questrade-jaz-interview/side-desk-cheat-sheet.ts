import systemDesign from "@/data/questrade-jaz-system-design-cheat-sheet.json";
import diagnostic from "@/data/questrade-jaz-diagnostic-cheat-sheet.json";
import technical from "@/data/questrade-jaz-technical-cheat-sheet.json";

export type SideDeskCheatSheetId = "system-design" | "diagnostic" | "technical";

export type SideDeskTable = {
  columns: string[];
  rows: string[][];
};

export type SideDeskSection = {
  id: string;
  title: string;
  prose?: string[] | null;
  table?: SideDeskTable | null;
  footnotes?: string[] | null;
};

export type SideDeskCheatSheet = {
  id: SideDeskCheatSheetId;
  title: string;
  useFor: string;
  frameworkNote: string;
  preamble?: string[] | null;
  sections: SideDeskSection[];
};

export const systemDesignCheatSheet = systemDesign as SideDeskCheatSheet;
export const diagnosticCheatSheet = diagnostic as SideDeskCheatSheet;
export const technicalCheatSheet = technical as SideDeskCheatSheet;

export const SIDE_DESK_CHEAT_SHEETS: Record<SideDeskCheatSheetId, SideDeskCheatSheet> = {
  "system-design": systemDesignCheatSheet,
  diagnostic: diagnosticCheatSheet,
  technical: technicalCheatSheet,
};

export const SIDE_DESK_PANEL_KEYS: Record<SideDeskCheatSheetId, string[]> = {
  "system-design": ["P04", "P06"],
  diagnostic: ["P05"],
  technical: ["P06", "P07"],
};

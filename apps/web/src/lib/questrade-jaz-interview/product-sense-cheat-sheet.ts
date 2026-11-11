import raw from "@/data/questrade-jaz-product-sense-cheat-sheet.json";

export type CheatSheetTable = {
  columns: string[];
  rows: string[][];
};

export type CheatSheetSection = {
  id: string;
  title: string;
  prose?: string[];
  table?: CheatSheetTable;
  tables?: ({ id: string; title: string; columns: string[]; rows: string[][] })[];
  callout?: string;
  footnotes?: string[];
};

export type ProductSenseCheatSheet = {
  title: string;
  useFor: string;
  frameworkSteps: string[];
  introNote: string;
  interviewTip: string;
  customerSegments: string[];
  sections: CheatSheetSection[];
};

export const productSenseCheatSheet = raw as ProductSenseCheatSheet;

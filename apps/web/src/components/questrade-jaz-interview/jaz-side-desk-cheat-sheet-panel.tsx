"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  SIDE_DESK_PANEL_KEYS,
  SIDE_DESK_CHEAT_SHEETS,
  type SideDeskCheatSheetId,
  type SideDeskSection,
  type SideDeskTable,
} from "@/lib/questrade-jaz-interview/side-desk-cheat-sheet";
import { jazInterviewQuestions } from "@/lib/questrade-jaz-interview/dataset";
import type { ProductSensePanelLink } from "@/lib/questrade-jaz-interview/product-sense-panel-links";
import { PanelScriptLinks } from "@/components/questrade-jaz-interview/jaz-panel-script-links";
import { cn } from "@/lib/utils";

function HighlightStars({ text }: { text: string }) {
  const parts = text.split(/(★|\u2605)/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "★" || part === "\u2605" ? (
          <span key={`${text}-${i}`} className="text-amber-600">
            ★
          </span>
        ) : (
          <span key={`${text}-${i}`}>{part}</span>
        )
      )}
    </>
  );
}

function DeskTable({ table, starOnly }: { table: SideDeskTable; starOnly?: boolean }) {
  const rows = starOnly
    ? table.rows.filter((row) => row.some((cell) => /★|\u2605/.test(cell)))
    : table.rows;
  return (
    <div className="overflow-x-auto rounded-md border border-violet-100">
      <table className="w-full min-w-[20rem] text-left text-xs">
        <thead className="bg-violet-50/90 text-violet-950">
          <tr>
            {table.columns.map((col) => (
              <th key={col} className="px-2.5 py-2 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")} className="border-t border-violet-50 align-top">
              {row.map((cell, ci) => (
                <td key={`${row[0]}-${ci}`} className="px-2.5 py-2 leading-snug text-neutral-800">
                  <HighlightStars text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlock({
  section,
  open,
  onToggle,
  starOnly,
}: {
  section: SideDeskSection;
  open: boolean;
  onToggle: () => void;
  starOnly?: boolean;
}) {
  const hasStarRows = section.table?.rows.some((row) => row.some((c) => /★|\u2605/.test(c)));
  return (
    <section id={`sd-${section.id}`} className="scroll-mt-28 border-b border-violet-100 pb-4">
      <button type="button" className="flex w-full items-center gap-2 py-3 text-left" onClick={onToggle}>
        {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        <h2 className="text-base font-semibold text-violet-950">{section.title}</h2>
        {hasStarRows ? <span className="text-[10px] text-amber-700">★ rows</span> : null}
      </button>
      {open && (
        <div className="space-y-3 pl-6">
          {section.prose?.map((p) => (
            <p
              key={p.slice(0, 48)}
              className={cn(
                "text-sm leading-relaxed",
                p.startsWith("Five questions") || /^\d+\./.test(p)
                  ? "rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1.5 font-medium text-violet-950"
                  : "text-muted-foreground"
              )}
            >
              {p}
            </p>
          ))}
          {section.table ? <DeskTable table={section.table} starOnly={starOnly} /> : null}
          {section.footnotes?.map((note) => (
            <p key={note.slice(0, 48)} className="text-sm leading-relaxed text-muted-foreground">
              {note}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

const SHEET_LABELS: Record<SideDeskCheatSheetId, string> = {
  "system-design": "System design",
  diagnostic: "Diagnostic",
  technical: "Technical",
};

export function JazSideDeskCheatSheetPanel({
  sheetId,
  onOpenPanelScript,
  focusSectionId,
}: {
  sheetId: SideDeskCheatSheetId;
  onOpenPanelScript?: (questionId: string) => void;
  focusSectionId?: string | null;
}) {
  const sheet = SIDE_DESK_CHEAT_SHEETS[sheetId];
  const [starOnly, setStarOnly] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const first = sheet.sections[0]?.id;
    const init: Record<string, boolean> = {};
    if (first) init[first] = true;
    if (focusSectionId) init[focusSectionId] = true;
    return init;
  });

  const panelLinks = useMemo((): ProductSensePanelLink[] => {
    const keys = SIDE_DESK_PANEL_KEYS[sheetId] ?? [];
    return keys
      .map((key) => {
        const q = jazInterviewQuestions.find((item) => item.curatedKey === key);
        if (!q) return null;
        return { curatedKey: key, shortLabel: q.shortLabel, questionId: q.id };
      })
      .filter((v): v is ProductSensePanelLink => Boolean(v));
  }, [sheetId]);

  useEffect(() => {
    if (!focusSectionId) return;
    setOpenSections((c) => ({ ...c, [focusSectionId]: true }));
    window.requestAnimationFrame(() => {
      document.getElementById(`sd-${focusSectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [focusSectionId]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 md:px-8">
      <p className="text-xs font-medium tracking-wide text-violet-800 uppercase">
        Live reference · {SHEET_LABELS[sheetId]}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{sheet.title.replace(/^\d+\.\s*/, "")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{sheet.useFor}</p>

      <div className="sticky top-0 z-10 -mx-2 mt-4 bg-white/95 px-2 py-2 backdrop-blur">
        <p className="rounded-md border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-medium leading-relaxed text-violet-950">
          {sheet.frameworkNote}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
              starOnly ? "border-amber-400 bg-amber-50 text-amber-950" : "border-violet-200 bg-white text-violet-900"
            )}
            onClick={() => setStarOnly((v) => !v)}
          >
            {starOnly ? "★ rows only" : "Show all rows"}
          </button>
          <button
            type="button"
            className="text-[11px] text-violet-800 underline-offset-2 hover:underline"
            onClick={() => {
              const next = Object.fromEntries(sheet.sections.map((s) => [s.id, true]));
              setOpenSections(next);
            }}
          >
            Expand all
          </button>
        </div>
        <div className="mt-2">
          <PanelScriptLinks links={panelLinks} onOpen={onOpenPanelScript} title="Related panel answers" />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        {sheet.sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            open={openSections[section.id] ?? false}
            onToggle={() => setOpenSections((c) => ({ ...c, [section.id]: !c[section.id] }))}
            starOnly={starOnly}
          />
        ))}
      </div>
    </div>
  );
}

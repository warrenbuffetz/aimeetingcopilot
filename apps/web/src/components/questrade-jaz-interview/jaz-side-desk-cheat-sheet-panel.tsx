"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  SIDE_DESK_CHEAT_SHEETS,
  type SideDeskCheatSheetId,
  type SideDeskSection,
  type SideDeskTable,
} from "@/lib/questrade-jaz-interview/side-desk-cheat-sheet";
import {
  SIDE_DESK_LIVE_CATALOGS,
  cardsForFlowStep,
  type SideDeskLiveCard,
} from "@/lib/questrade-jaz-interview/side-desk-live-catalog";
import { getSideDeskLiveBundle } from "@/lib/questrade-jaz-interview/side-desk-live-bundle";
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
  return (
    <section id={`sd-${section.id}`} className="scroll-mt-28 border-b border-violet-100 pb-4">
      <button type="button" className="flex w-full items-center gap-2 py-3 text-left" onClick={onToggle}>
        {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        <h2 className="text-base font-semibold text-violet-950">{section.title}</h2>
      </button>
      {open && (
        <div className="space-y-3 pl-6">
          {section.prose?.map((p) => (
            <p key={p.slice(0, 48)} className="text-sm leading-relaxed text-muted-foreground">
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

function LiveCardChip({
  card,
  selected,
  onSelect,
}: {
  card: SideDeskLiveCard;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-md border bg-white p-2.5 text-left transition-colors",
        selected ? "border-violet-500 ring-2 ring-violet-200" : "border-violet-100 hover:border-violet-300",
        card.priority ? "border-amber-300" : null
      )}
    >
      <p className="text-xs font-semibold text-violet-950">
        {card.label}
        {card.priority ? <span className="ml-1 text-amber-600">★</span> : null}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-neutral-700">{card.subtitle}</p>
      <p className="mt-1 text-[10px] text-violet-800">Tap for live speak lines</p>
    </button>
  );
}

export function JazSideDeskCheatSheetPanel({
  sheetId,
  onOpenPanelScript,
  focusSectionId,
  focusCardId,
}: {
  sheetId: SideDeskCheatSheetId;
  onOpenPanelScript?: (questionId: string) => void;
  focusSectionId?: string | null;
  focusCardId?: string | null;
}) {
  const sheet = SIDE_DESK_CHEAT_SHEETS[sheetId];
  const catalog = SIDE_DESK_LIVE_CATALOGS[sheetId];
  const [flowStepId, setFlowStepId] = useState(catalog.flowSteps[0]!.id);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showTables, setShowTables] = useState(false);
  const [starOnly, setStarOnly] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const liveCards = useMemo(() => cardsForFlowStep(sheetId, flowStepId), [sheetId, flowStepId]);
  const bundle = useMemo(
    () => (selectedCardId ? getSideDeskLiveBundle(sheetId, selectedCardId) : null),
    [sheetId, selectedCardId]
  );

  useEffect(() => {
    setFlowStepId(catalog.flowSteps[0]!.id);
    setSelectedCardId(null);
    setShowTables(false);
  }, [sheetId, catalog.flowSteps]);

  useEffect(() => {
    if (!focusCardId) return;
    const card = catalog.cards.find((c) => c.id === focusCardId);
    if (!card) return;
    setShowTables(false);
    setFlowStepId(card.flowStepId);
    setSelectedCardId(card.id);
  }, [focusCardId, catalog.cards]);

  useEffect(() => {
    if (!focusSectionId || focusCardId) return;
    setShowTables(true);
    setOpenSections((c) => ({ ...c, [focusSectionId]: true }));
    window.requestAnimationFrame(() => {
      document.getElementById(`sd-${focusSectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [focusSectionId, focusCardId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedCardId) setSelectedCardId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCardId]);

  useEffect(() => {
    if (!selectedCardId) return;
    window.requestAnimationFrame(() => {
      document.getElementById("sd-live-bundle")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [selectedCardId]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 md:px-8">
      <p className="text-xs font-medium tracking-wide text-violet-800 uppercase">
        Live reference · {SHEET_LABELS[sheetId]}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {sheet.title.replace(/^\d+\.\s*/, "")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{sheet.useFor}</p>

      <div className="sticky top-0 z-10 -mx-2 mt-4 space-y-2 bg-white/95 px-2 py-2 backdrop-blur">
        <p className="rounded-md border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-medium leading-relaxed text-violet-950">
          {sheet.frameworkNote}
        </p>

        <div className="overflow-x-auto pb-0.5">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${catalog.flowSteps.length}, minmax(0, 1fr))` }}
          >
            {catalog.flowSteps.map((step) => {
              const active = flowStepId === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  className={cn(
                    "min-h-[2.75rem] rounded-md border px-1.5 py-2 text-center text-[11px] font-semibold transition-colors",
                    active
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-violet-100 bg-white text-violet-950 hover:bg-violet-50"
                  )}
                  onClick={() => {
                    setFlowStepId(step.id);
                    setSelectedCardId(null);
                    setShowTables(false);
                  }}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
              showTables ? "border-violet-400 bg-violet-100 text-violet-950" : "border-violet-200 bg-white text-violet-900"
            )}
            onClick={() => {
              setShowTables((v) => !v);
              setSelectedCardId(null);
            }}
          >
            {showTables ? "Live cards" : "Full tables"}
          </button>
          {showTables ? (
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
          ) : null}
        </div>
      </div>

      {catalog.alwaysSay && !showTables ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2.5">
          <p className="text-[10px] font-semibold tracking-wide text-amber-900 uppercase">Always ask (banking feature)</p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-xs text-amber-950">
            {catalog.alwaysSay.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {showTables ? (
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
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Tap a card to expand speakable lines below — stay on this screen.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {liveCards.map((card) => (
              <LiveCardChip
                key={card.id}
                card={card}
                selected={selectedCardId === card.id}
                onSelect={() => setSelectedCardId((cur) => (cur === card.id ? null : card.id))}
              />
            ))}
          </div>
          {liveCards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cards for this step.</p>
          ) : null}

          {bundle ? (
            <div
              id="sd-live-bundle"
              className="scroll-mt-28 space-y-3 rounded-lg border border-violet-300 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-0 flex-1 rounded-md border border-violet-400 bg-violet-50 px-3 py-2.5">
                  <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">
                    Live pin · {bundle.card.kind}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-violet-950">
                    {bundle.card.label}
                    {bundle.card.priority ? <span className="ml-1 text-amber-600">★</span> : null}
                  </p>
                  <p className="mt-0.5 text-sm text-violet-950">{bundle.card.subtitle}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs text-violet-800 underline-offset-2 hover:underline"
                  onClick={() => setSelectedCardId(null)}
                >
                  Close
                </button>
              </div>
              <ul className="space-y-2">
                {bundle.speakLines.map((line) => (
                  <li key={line.label} className="rounded-md border border-violet-100 bg-violet-50/40 px-2.5 py-2">
                    <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">{line.label}</p>
                    <p className="mt-0.5 text-sm leading-snug text-neutral-900">{line.text}</p>
                  </li>
                ))}
              </ul>
              <PanelScriptLinks links={bundle.panelLinks} onOpen={onOpenPanelScript} title="Related panel answers" />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

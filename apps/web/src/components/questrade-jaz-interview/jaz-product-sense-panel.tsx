"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  productSenseCheatSheet,
  type CheatSheetSection,
  type CheatSheetTable,
} from "@/lib/questrade-jaz-interview/product-sense-cheat-sheet";
import {
  PRODUCT_SENSE_JOURNEY_STEPS,
  QUESTBANK_CUSTOMER_FUNNEL,
  funnelIdToProblemStage,
  type JourneyProblemStageId,
  type ProductSenseJourneyStepId,
} from "@/lib/questrade-jaz-interview/product-sense-journey";
import type { ProductSenseSearchNavigate } from "@/lib/questrade-jaz-interview/product-sense-search";
import {
  BANKING_USER_SEGMENT_CHIPS,
  GENERIC_USER_SEGMENT_CHIPS,
  PRODUCT_SENSE_SEGMENT_STORAGE_KEY,
  type UserSegmentChip,
} from "@/lib/questrade-jaz-interview/product-sense-user-segments";
import { JourneyProblemMap, type SelectedProblem } from "@/components/questrade-jaz-interview/jaz-journey-problem-map";
import { UserSegmentChips } from "@/components/questrade-jaz-interview/jaz-user-segment-chips";
import { cn } from "@/lib/utils";

export type ProductSensePanelHandle = {
  applySearchHit: (hit: ProductSenseSearchNavigate) => void;
};

function HighlightStars({ text }: { text: string }) {
  const parts = text.split(/(★|\u2605)/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "★" || part === "\u2605" ? (
          <span key={`${text}-${i}`} className="text-amber-600" aria-label="high priority">
            ★
          </span>
        ) : (
          <span key={`${text}-${i}`}>{part}</span>
        )
      )}
    </>
  );
}

function CheatTable({ table, compact }: { table: CheatSheetTable; compact?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-md border border-violet-100">
      <table className={cn("w-full min-w-[20rem] text-left", compact ? "text-xs" : "text-sm")}>
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
          {table.rows.map((row) => (
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
}: {
  section: CheatSheetSection;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section id={`ps-${section.id}`} className="scroll-mt-28 border-b border-violet-100 pb-4">
      <button type="button" className="flex w-full items-center gap-2 py-3 text-left" onClick={onToggle}>
        {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        <h2 className="text-base font-semibold text-violet-950">{section.title}</h2>
      </button>
      {open && (
        <div className="space-y-4 pl-6">
          {section.prose?.map((p) => (
            <p key={p.slice(0, 48)} className="text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
          {section.table ? <CheatTable table={section.table} compact={section.id === "problems"} /> : null}
          {section.tables?.map((t) => (
            <div key={t.id}>
              <h3 className="mb-2 text-sm font-medium text-violet-900">{t.title}</h3>
              <CheatTable table={{ columns: t.columns, rows: t.rows }} compact />
            </div>
          ))}
          {section.callout ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{section.callout}</p>
          ) : null}
          {section.footnotes?.map((note) => (
            <p key={note.slice(0, 48)} className="text-sm leading-relaxed text-muted-foreground">
              <HighlightStars text={note} />
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

function InterviewChecklist({
  activeStep,
  onSelect,
}: {
  activeStep: ProductSenseJourneyStepId;
  onSelect: (id: ProductSenseJourneyStepId) => void;
}) {
  return (
    <div
      className="rounded-md border border-violet-100 bg-white px-2 py-2"
      role="tablist"
      aria-label="Product sense interview checklist"
    >
      <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
        Interview checklist
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {PRODUCT_SENSE_JOURNEY_STEPS.map((step, index) => {
          const selected = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                selected
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-900 hover:bg-violet-100"
              )}
              onClick={() => onSelect(step.id)}
            >
              {index + 1}. {step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestbankFunnel({
  focusProblemStage,
  onFunnelSelect,
  compact,
}: {
  focusProblemStage: JourneyProblemStageId | null;
  onFunnelSelect: (funnelId: (typeof QUESTBANK_CUSTOMER_FUNNEL)[number]["id"]) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-lg border border-neutral-200 bg-neutral-50/80", compact ? "mt-2 p-2" : "mt-2 p-3")}>
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Questbank funnel
      </p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">
        Filters journey problems — stays on Problem step (does not jump to User/Measure).
      </p>
      <div className="mt-2 overflow-x-auto pb-0.5">
        <div className="grid min-w-[32rem] grid-cols-5 gap-1.5">
          {QUESTBANK_CUSTOMER_FUNNEL.map((stage) => {
            const problemStage = funnelIdToProblemStage(stage.id);
            const linked = focusProblemStage === problemStage;
            return (
              <button
                key={stage.id}
                type="button"
                title={stage.metricHint}
                className={cn(
                  "flex w-full flex-col items-center justify-center rounded-md border px-1.5 py-2 text-center transition-colors",
                  compact ? "min-h-[2.75rem]" : "min-h-[4.25rem]",
                  linked
                    ? "border-violet-500 bg-violet-100 text-violet-950"
                    : "border-neutral-200 bg-white text-neutral-800 hover:bg-violet-50"
                )}
                onClick={() => onFunnelSelect(stage.id)}
              >
                <span className="block text-[11px] font-semibold leading-tight">{stage.label}</span>
                {!compact ? (
                  <span className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted-foreground">
                    {stage.metricHint}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type JazProductSensePanelProps = {
  onOpenPanelScript?: (questionId: string) => void;
};

export const JazProductSensePanel = forwardRef<ProductSensePanelHandle, JazProductSensePanelProps>(
  function JazProductSensePanel({ onOpenPanelScript }, ref) {
  const { useFor, introNote, interviewTip, sections } = productSenseCheatSheet;
  const [activeStep, setActiveStep] = useState<ProductSenseJourneyStepId>("problem");
  const [selectedProblem, setSelectedProblem] = useState<SelectedProblem | null>(null);
  const [showAllSections, setShowAllSections] = useState(false);
  const [problemsTableView, setProblemsTableView] = useState(false);
  const [focusProblemStage, setFocusProblemStage] = useState<JourneyProblemStageId | null>(null);
  const [controlledStageId, setControlledStageId] = useState<JourneyProblemStageId | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ problems: true });
  const [pinnedSegmentId, setPinnedSegmentId] = useState<string | null>(null);

  const allSegmentChips = useMemo(
    () => [...BANKING_USER_SEGMENT_CHIPS, ...GENERIC_USER_SEGMENT_CHIPS],
    []
  );
  const pinnedSegment = useMemo(
    () => allSegmentChips.find((c) => c.id === pinnedSegmentId) ?? null,
    [allSegmentChips, pinnedSegmentId]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(PRODUCT_SENSE_SEGMENT_STORAGE_KEY);
    if (saved) setPinnedSegmentId(saved);
  }, []);

  const pinSegment = useCallback((chip: UserSegmentChip | null) => {
    const id = chip?.id ?? null;
    setPinnedSegmentId(id);
    if (id) sessionStorage.setItem(PRODUCT_SENSE_SEGMENT_STORAGE_KEY, id);
    else sessionStorage.removeItem(PRODUCT_SENSE_SEGMENT_STORAGE_KEY);
  }, []);

  const liveBundleOpen =
    Boolean(selectedProblem) && activeStep === "problem" && !showAllSections && !problemsTableView;

  const stepMeta = useMemo(
    () => PRODUCT_SENSE_JOURNEY_STEPS.find((s) => s.id === activeStep)!,
    [activeStep]
  );

  const sectionsById = useMemo(() => Object.fromEntries(sections.map((s) => [s.id, s])), [sections]);

  const problemRows = useMemo(() => sectionsById.problems?.table?.rows ?? [], [sectionsById]);

  const visibleSectionIds = useMemo(() => {
    if (showAllSections) return sections.map((s) => s.id);
    return stepMeta.sectionIds;
  }, [showAllSections, stepMeta.sectionIds, sections]);

  const applySearchHit = useCallback(
    (hit: ProductSenseSearchNavigate) => {
      setShowAllSections(false);
      setProblemsTableView(false);
      if (hit.stageId) {
        setFocusProblemStage(hit.stageId);
        setControlledStageId(hit.stageId);
      }
      if (hit.kind === "stage" && hit.stageId) {
        setActiveStep("problem");
        setSelectedProblem(null);
        return;
      }
      if (hit.sectionId === "solutions") {
        setActiveStep("solutions");
        setOpenSections((c) => ({ ...c, solutions: true }));
        return;
      }
      if (hit.sectionId === "metrics") {
        setActiveStep("measure");
        setOpenSections((c) => ({ ...c, metrics: true, experiments: true }));
        return;
      }
      if (hit.category && hit.problem && hit.intervention) {
        setActiveStep("problem");
        setSelectedProblem({
          category: hit.category,
          problem: hit.problem,
          intervention: hit.intervention,
          priority: hit.priority ?? /★|\u2605/.test(hit.category),
        });
      }
    },
    []
  );

  useImperativeHandle(ref, () => ({ applySearchHit }), [applySearchHit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProblem) {
        setSelectedProblem(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProblem]);

  const goToStep = useCallback((id: ProductSenseJourneyStepId) => {
    setActiveStep(id);
    if (id !== "problem") {
      setFocusProblemStage(null);
      setControlledStageId(null);
      setSelectedProblem(null);
    }
    const next = PRODUCT_SENSE_JOURNEY_STEPS.find((s) => s.id === id);
    if (next?.sectionIds.length) {
      setOpenSections((cur) => {
        const merged = { ...cur };
        for (const sid of next.sectionIds) merged[sid] = true;
        return merged;
      });
    }
    window.requestAnimationFrame(() => {
      const first = next?.sectionIds[0];
      if (first) document.getElementById(`ps-${first}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleFunnelSelect = useCallback(
    (fid: (typeof QUESTBANK_CUSTOMER_FUNNEL)[number]["id"]) => {
      const problemStage = funnelIdToProblemStage(fid);
      setActiveStep("problem");
      setFocusProblemStage(problemStage);
      setControlledStageId(problemStage);
      setShowAllSections(false);
      setProblemsTableView(false);
      if (liveBundleOpen) setSelectedProblem(null);
    },
    [liveBundleOpen]
  );

  const categoryLabel = selectedProblem
    ? selectedProblem.category.replace(/\s*[\u2605★]\s*/g, "").trim()
  : "";

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 md:px-8">
      {!liveBundleOpen ? (
        <>
          <p className="text-xs font-medium tracking-wide text-violet-800 uppercase">Live reference · Product sense</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{productSenseCheatSheet.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{useFor}</p>
        </>
      ) : (
        <p className="text-xs font-medium tracking-wide text-violet-800 uppercase">Live bundle · Product sense</p>
      )}

      <div className="sticky top-0 z-10 -mx-2 mt-4 space-y-0 bg-white/95 px-2 py-2 backdrop-blur">
        {liveBundleOpen ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                Problem
              </span>
              <span className="text-sm font-semibold text-violet-950">
                {categoryLabel}
                {selectedProblem?.priority ? <span className="ml-1 text-amber-600">★</span> : null}
              </span>
              <button
                type="button"
                className="ml-auto text-xs text-violet-800 underline-offset-2 hover:underline"
                onClick={() => setSelectedProblem(null)}
              >
                ← Problems
              </button>
            </div>
            <InterviewChecklist activeStep={activeStep} onSelect={goToStep} />
            <QuestbankFunnel focusProblemStage={focusProblemStage} onFunnelSelect={handleFunnelSelect} compact />
          </div>
        ) : (
          <>
            <QuestbankFunnel focusProblemStage={focusProblemStage} onFunnelSelect={handleFunnelSelect} />
            <InterviewChecklist activeStep={activeStep} onSelect={goToStep} />
          </>
        )}
        {pinnedSegment ? (
          <p className="mt-2 rounded-md border border-violet-200 bg-violet-50 px-2 py-1.5 text-xs text-violet-950">
            <span className="font-semibold">Pinned user:</span> {pinnedSegment.label}
            <button
              type="button"
              className="ml-2 text-violet-800 underline-offset-2 hover:underline"
              onClick={() => goToStep("user")}
            >
              Change
            </button>
          </p>
        ) : null}
      </div>

      {!liveBundleOpen ? (
        <div className="mt-4 rounded-md border border-violet-200 bg-violet-50 px-3 py-2.5">
          <p className="text-[11px] font-semibold tracking-wide text-violet-900 uppercase">What to say now</p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-violet-950">{stepMeta.livePrompt}</p>
        </div>
      ) : null}

      {stepMeta.showIntro && !liveBundleOpen && (
        <p className="mt-4 text-sm leading-relaxed text-neutral-800">{introNote}</p>
      )}

      {stepMeta.showSegments && !liveBundleOpen ? (
        <div className="mt-4 rounded-md border border-violet-100 bg-violet-50/50 px-3 py-3">
          {interviewTip ? <p className="mb-3 text-sm font-medium text-violet-950">{interviewTip}</p> : null}
          <UserSegmentChips pinnedId={pinnedSegmentId} onPin={pinSegment} />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        {!liveBundleOpen ? (
          <p className="text-sm font-medium text-violet-950">Reference for this step</p>
        ) : (
          <p className="text-sm font-medium text-violet-950">Bundle + prioritize + test</p>
        )}
        <div className="flex flex-wrap gap-3">
          {activeStep === "problem" && !showAllSections && !liveBundleOpen ? (
            <button
              type="button"
              className="text-xs text-violet-800 underline-offset-2 hover:underline"
              onClick={() => setProblemsTableView((v) => !v)}
            >
              {problemsTableView ? "Journey map view" : "Table view (A)"}
            </button>
          ) : null}
          <button
            type="button"
            className="text-xs text-violet-800 underline-offset-2 hover:underline"
            onClick={() => {
              setShowAllSections((v) => !v);
              if (!showAllSections) setSelectedProblem(null);
            }}
          >
            {showAllSections ? "Step view only" : "Show full cheat sheet (A–E)"}
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-1" id="ps-problems">
        {showAllSections
          ? sections.map((section) => (
              <SectionBlock
                key={section.id}
                section={section}
                open={openSections[section.id] ?? false}
                onToggle={() => setOpenSections((c) => ({ ...c, [section.id]: !c[section.id] }))}
              />
            ))
          : activeStep === "problem" && !problemsTableView ? (
              <JourneyProblemMap
                problemRows={problemRows}
                sections={sections}
                focusStageId={focusProblemStage}
                onFocusStage={(id) => {
                  setFocusProblemStage(id);
                  setControlledStageId(id);
                }}
                controlledStageId={controlledStageId}
                selectedProblem={selectedProblem}
                onSelectProblem={setSelectedProblem}
                liveBundleOpen={liveBundleOpen}
                onOpenPanelScript={onOpenPanelScript}
              />
            ) : visibleSectionIds.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">
                No tables for this step — use the prompt above, then advance the flow.
              </p>
            ) : (
              visibleSectionIds.map((id) => {
                const section = sectionsById[id];
                if (!section) return null;
                if (id === "problems" && problemsTableView && section.table) {
                  return (
                    <div key={section.id} className="py-2">
                      <CheatTable table={section.table} compact />
                    </div>
                  );
                }
                return (
                  <SectionBlock
                    key={section.id}
                    section={section}
                    open={openSections[section.id] ?? true}
                    onToggle={() => setOpenSections((c) => ({ ...c, [section.id]: !c[section.id] }))}
                  />
                );
              })
            )}
      </div>
    </div>
  );
  }
);

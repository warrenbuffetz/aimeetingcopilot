"use client";

import { useEffect, useMemo, useState } from "react";
import type { CheatSheetSection } from "@/lib/questrade-jaz-interview/product-sense-cheat-sheet";
import { getProblemBundle } from "@/lib/questrade-jaz-interview/product-sense-problem-bundle";
import {
  buildJourneyProblemCards,
  type JourneyProblemCard,
  type JourneyProblemStageId,
} from "@/lib/questrade-jaz-interview/product-sense-journey";
import { ProblemBundlePanel } from "@/components/questrade-jaz-interview/jaz-problem-bundle-panel";
import { PanelScriptLinks } from "@/components/questrade-jaz-interview/jaz-panel-script-links";
import { getPanelLinksForJourneyStage } from "@/lib/questrade-jaz-interview/product-sense-panel-links";
import { cn } from "@/lib/utils";

function ProblemChip({
  card,
  selected,
  onSelect,
}: {
  card: JourneyProblemCard;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-md border bg-white p-2 text-left transition-colors",
        selected ? "border-violet-500 ring-2 ring-violet-200" : "border-violet-100 hover:border-violet-300",
        card.priority && !selected ? "ring-1 ring-amber-200/80" : null,
        card.priority ? "border-amber-300" : null
      )}
    >
      <p className="text-xs font-semibold text-violet-950">
        {card.category.replace(/\s*★\s*/g, "").replace(/\u2605/g, "")}
        {card.priority ? <span className="ml-1 text-amber-600">★</span> : null}
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-neutral-800">{card.problem}</p>
      <p className="mt-1 text-[10px] text-violet-800">Tap for solutions, metrics & guardrails</p>
    </button>
  );
}

export type SelectedProblem = Pick<JourneyProblemCard, "category" | "problem" | "intervention" | "priority">;

export function JourneyProblemMap({
  problemRows,
  sections,
  focusStageId,
  onFocusStage,
  selectedProblem,
  onSelectProblem,
  liveBundleOpen,
  controlledStageId,
  onOpenPanelScript,
}: {
  problemRows: string[][];
  sections: CheatSheetSection[];
  focusStageId?: JourneyProblemStageId | null;
  onFocusStage?: (id: JourneyProblemStageId) => void;
  selectedProblem: SelectedProblem | null;
  onSelectProblem: (problem: SelectedProblem | null) => void;
  liveBundleOpen?: boolean;
  controlledStageId?: JourneyProblemStageId | null;
  onOpenPanelScript?: (questionId: string) => void;
}) {
  const { stages, cardsByStage } = useMemo(() => buildJourneyProblemCards(problemRows), [problemRows]);
  const [selectedStage, setSelectedStage] = useState<JourneyProblemStageId>(stages[0]!.id);
  const activeStage = controlledStageId ?? focusStageId ?? selectedStage;

  useEffect(() => {
    if (controlledStageId) setSelectedStage(controlledStageId);
  }, [controlledStageId]);

  const bundle = useMemo(() => {
    if (!selectedProblem) return null;
    return getProblemBundle(
      selectedProblem.category,
      selectedProblem.problem,
      selectedProblem.intervention,
      sections
    );
  }, [selectedProblem, sections]);

  function pickStage(id: JourneyProblemStageId) {
    setSelectedStage(id);
    onFocusStage?.(id);
    onSelectProblem(null);
  }

  function pickCard(card: JourneyProblemCard) {
    const next: SelectedProblem = {
      category: card.category,
      problem: card.problem,
      intervention: card.intervention,
      priority: card.priority,
    };
    const same =
      selectedProblem?.category === next.category && selectedProblem?.problem === next.problem;
    onSelectProblem(same ? null : next);
  }

  const activeCards = cardsByStage[activeStage] ?? [];
  const activeMeta = stages.find((s) => s.id === activeStage)!;

  if (bundle) {
    return (
      <ProblemBundlePanel
        bundle={bundle}
        sections={sections}
        liveMode={liveBundleOpen}
        onBack={() => onSelectProblem(null)}
        onOpenPanelScript={onOpenPanelScript}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Start with where the customer is stuck, then pick the problem — you get solutions, metrics, and guardrails in
        one place.
      </p>

      <div className="relative overflow-x-auto pb-1">
        <div className="flex min-w-[36rem] gap-0 border-b border-violet-200">
          {stages.map((stage, index) => {
            const isActive = activeStage === stage.id;
            const count = cardsByStage[stage.id].length;
            const hasPriority = cardsByStage[stage.id].some((c) => c.priority);
            return (
              <div key={stage.id} className="relative flex flex-1 flex-col items-stretch">
                <button
                  type="button"
                  className={cn(
                    "group flex flex-col items-center px-1 pb-3 pt-1 text-center transition-colors",
                    isActive ? "text-violet-950" : "text-muted-foreground hover:text-violet-900"
                  )}
                  onClick={() => pickStage(stage.id)}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      isActive ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-800 group-hover:bg-violet-200"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="mt-1 text-[11px] font-semibold leading-tight">{stage.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {count} {hasPriority ? "· ★" : ""}
                  </span>
                </button>
                {isActive ? (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-violet-600" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-violet-200 bg-violet-50/40 px-3 py-3">
        <p className="text-sm font-semibold text-violet-950">{activeMeta.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{activeMeta.journeyMoment}</p>
        <div className="mt-2">
          <PanelScriptLinks
            links={getPanelLinksForJourneyStage(activeStage)}
            onOpen={onOpenPanelScript}
            title="Panel answers for this stage"
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {activeCards.map((card) => (
          <ProblemChip
            key={`${activeStage}-${card.category}-${card.problem.slice(0, 24)}`}
            card={card}
            selected={selectedProblem?.category === card.category && selectedProblem.problem === card.problem}
            onSelect={() => pickCard(card)}
          />
        ))}
      </div>

      {activeCards.length === 0 ? (
        <p className="text-sm text-muted-foreground">No mapped problems for this stage.</p>
      ) : null}
    </div>
  );
}

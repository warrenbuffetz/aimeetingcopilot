"use client";

import type { CheatSheetSection } from "@/lib/questrade-jaz-interview/product-sense-cheat-sheet";
import {
  getExperimentPatternForBundle,
  getPrioritizeRowsForBundle,
  type ProblemBundle,
} from "@/lib/questrade-jaz-interview/product-sense-problem-bundle";
import {
  getPanelLinksForMetricsDiscussion,
  getPanelLinksForProblemCategory,
  mergePanelLinks,
} from "@/lib/questrade-jaz-interview/product-sense-panel-links";
import { PanelScriptLinks } from "@/components/questrade-jaz-interview/jaz-panel-script-links";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

function LivePinStrip({ bundle }: { bundle: ProblemBundle }) {
  const topSolution = bundle.solutions[0];
  const topMetric = bundle.metrics[0];
  const guardrail =
    topMetric?.guardrails.split(",")[0]?.trim() ?? bundle.universalGuardrails[0]?.dimension ?? "—";

  return (
    <div className="grid gap-2 text-[11px] leading-snug sm:grid-cols-2">
      <p>
        <span className="font-semibold text-violet-900">Intervention:</span> {bundle.intervention}
      </p>
      <p>
        <span className="font-semibold text-violet-900">Lever:</span>{" "}
        {topSolution ? `${topSolution.lever}` : "—"}
      </p>
      <p>
        <span className="font-semibold text-violet-900">Primary:</span>{" "}
        {topMetric ? `${topMetric.objective} — ${topMetric.primary}` : "—"}
      </p>
      <p>
        <span className="font-semibold text-amber-900">Guardrail:</span> {guardrail}
      </p>
    </div>
  );
}

export function ProblemBundlePanel({
  bundle,
  sections,
  onBack,
  liveMode,
  onOpenPanelScript,
  className,
}: {
  bundle: ProblemBundle;
  sections: CheatSheetSection[];
  onBack?: () => void;
  liveMode?: boolean;
  onOpenPanelScript?: (questionId: string) => void;
  className?: string;
}) {
  const prioritize = useMemo(
    () => getPrioritizeRowsForBundle(bundle.category, sections),
    [bundle.category, sections]
  );
  const experiment = useMemo(
    () => getExperimentPatternForBundle(bundle.category, bundle.problem, bundle, sections),
    [bundle, sections]
  );
  const panelLinks = useMemo(
    () => mergePanelLinks(getPanelLinksForProblemCategory(bundle.category), getPanelLinksForMetricsDiscussion()),
    [bundle.category]
  );

  return (
    <div className={cn("space-y-4 rounded-lg border border-violet-300 bg-white p-4 shadow-sm", className)}>
      {onBack ? (
        <button type="button" className="text-xs text-violet-800 hover:underline" onClick={onBack}>
          ← Back to journey problems
        </button>
      ) : null}

      {liveMode ? (
        <div className="rounded-md border border-violet-400 bg-violet-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">Live pin</p>
          <LivePinStrip bundle={bundle} />
        </div>
      ) : null}

      <header className={liveMode ? "sr-only" : undefined}>
        <p className="text-[11px] font-semibold tracking-wide text-violet-800 uppercase">Problem bundle</p>
        <h3 className="mt-1 text-lg font-semibold text-violet-950">
          {bundle.category.replace(/\s*★\s*/g, "").replace(/\u2605/g, "")}
          {bundle.priority ? <span className="ml-1 text-amber-600">★</span> : null}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-900">{bundle.problem}</p>
        <p className="mt-2 rounded-md bg-violet-50 px-2.5 py-2 text-sm text-violet-950">
          <span className="font-medium">Intervention direction:</span> {bundle.intervention}
        </p>
      </header>

      <PanelScriptLinks links={panelLinks} onOpen={onOpenPanelScript} />

      {liveMode ? (
        <div className="border-b border-violet-100 pb-2">
          <h3 className="text-base font-semibold text-violet-950">
            {bundle.category.replace(/\s*[\u2605★]\s*/g, "").trim()}
            {bundle.priority ? <span className="ml-1 text-amber-600">★</span> : null}
          </h3>
          <p className="mt-1 text-sm text-neutral-800">{bundle.problem}</p>
        </div>
      ) : null}

      <section>
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Solutions to explore</h4>
        <ul className="mt-2 space-y-2">
          {bundle.solutions.map((s) => (
            <li key={s.lever} className="rounded-md border border-violet-100 bg-violet-50/40 px-2.5 py-2">
              <p className="text-sm font-medium text-violet-950">{s.lever}</p>
              <p className="mt-0.5 text-xs leading-snug text-neutral-700">{s.examples}</p>
            </li>
          ))}
        </ul>
        {bundle.solutions.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">No mapped levers — check full cheat sheet C.</p>
        ) : null}
      </section>

      <section>
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Success metrics</h4>
        <div className="mt-2 space-y-2">
          {bundle.metrics.map((m) => (
            <div key={m.objective} className="rounded-md border border-neutral-200 px-2.5 py-2 text-xs">
              <p className="font-semibold text-neutral-900">{m.objective}</p>
              <p className="mt-1">
                <span className="text-muted-foreground">Primary:</span> {m.primary}
              </p>
              <p className="mt-0.5">
                <span className="text-muted-foreground">Leading:</span> {m.leading}
              </p>
              <p className="mt-0.5 text-amber-950">
                <span className="font-medium text-amber-900">Guardrails:</span> {m.guardrails}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Universal guardrails</h4>
        <ul className="mt-2 space-y-1.5 text-xs text-neutral-800">
          {bundle.universalGuardrails.map((g) => (
            <li key={g.dimension} className="rounded border border-neutral-100 px-2 py-1.5">
              <span className="font-medium">{g.dimension}:</span> {g.guardrails}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3">
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Prioritize (D) — trade-offs to mention
        </h4>
        <ul className="mt-2 space-y-1.5 text-xs">
          {prioritize.map((row) => (
            <li key={row.dimension} className="flex gap-2">
              <span className="shrink-0 font-semibold text-violet-950">{row.dimension}</span>
              <span className="text-neutral-700">{row.question}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-3">
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Test (E) — one experiment</h4>
        <dl className="mt-2 space-y-1.5 text-xs">
          <div>
            <dt className="font-semibold text-violet-950">Hypothesis</dt>
            <dd className="text-neutral-800">{experiment.hypothesis}</dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-950">Smallest test</dt>
            <dd className="text-neutral-800">{experiment.intervention}</dd>
          </div>
          <div>
            <dt className="font-semibold text-violet-950">Success</dt>
            <dd className="text-neutral-800">
              {experiment.successMeasure}
              {experiment.primaryMetricLabel ? (
                <span className="text-muted-foreground"> · aligns with {experiment.primaryMetricLabel}</span>
              ) : null}
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-[10px] leading-snug text-muted-foreground">{experiment.checklist}</p>
      </section>
    </div>
  );
}

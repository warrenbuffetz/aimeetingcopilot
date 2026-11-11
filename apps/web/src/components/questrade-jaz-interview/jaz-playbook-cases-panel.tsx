"use client";

import { useEffect, useMemo, useState } from "react";
import {
  casesForCategory,
  playbookCategories,
  playbookCasesData,
  primerLiveData,
  type PlaybookCase,
  type PlaybookLiveType,
} from "@/lib/questrade-jaz-interview/playbook-cases";
import {
  CASE_SEARCH_SUGGESTIONS,
  LIVE_CASE_TRIGGERS,
  panelLinksForCase,
} from "@/lib/questrade-jaz-interview/playbook-live-nav";
import { relatedCasesByTrigger, searchPlaybookCases } from "@/lib/questrade-jaz-interview/playbook-search";
import {
  getSpeakingScriptSlots,
  supportsSpeakingScript,
} from "@/lib/questrade-jaz-interview/playbook-speaking-script";
import { SpeakingScriptPanel } from "@/components/questrade-jaz-interview/jaz-speaking-script-panel";
import { cn } from "@/lib/utils";

const LIVE_FILTERS: { id: PlaybookLiveType | "all" | "primer"; label: string }[] = [
  { id: "priority", label: "Priority 12" },
  { id: "product-sense", label: "Product sense" },
  { id: "diagnostic", label: "Diagnostic" },
  { id: "technical", label: "System/tech" },
  { id: "strategy", label: "Strategy" },
  { id: "primer", label: "Primer" },
  { id: "all", label: "All cases" },
];

function CaseCard({
  item,
  selected,
  onSelect,
}: {
  item: PlaybookCase;
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
        item.priority ? "border-amber-300" : null
      )}
    >
      <p className="text-[10px] font-semibold tracking-wide text-violet-700 uppercase">
        {item.id}
        {item.priority ? <span className="ml-1 text-amber-600">★</span> : null}
      </p>
      <p className="mt-0.5 text-xs font-semibold leading-snug text-violet-950">{item.title}</p>
      <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{item.clarify || item.shortAnswer}</p>
    </button>
  );
}

function CaseComponentsView({ item }: { item: PlaybookCase }) {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-violet-400 bg-violet-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">Spoken answer (compact)</p>
        <p className="mt-1 text-[15px] leading-7 text-neutral-900">{item.spokenAnswer}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {item.clarify ? (
          <div className="rounded-md border border-violet-100 bg-violet-50/40 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase text-violet-800">Clarify</p>
            <p className="mt-0.5 text-xs leading-snug text-neutral-900">{item.clarify}</p>
          </div>
        ) : null}
        {item.hypothesis ? (
          <div className="rounded-md border border-violet-100 bg-violet-50/40 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase text-violet-800">Hypothesis</p>
            <p className="mt-0.5 text-xs leading-snug text-neutral-900">{item.hypothesis}</p>
          </div>
        ) : null}
        {item.optionA ? (
          <div className="rounded-md border border-neutral-200 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Option A</p>
            <p className="mt-0.5 text-xs leading-snug text-neutral-900">{item.optionA}</p>
          </div>
        ) : null}
        {item.optionB ? (
          <div className="rounded-md border border-neutral-200 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Option B</p>
            <p className="mt-0.5 text-xs leading-snug text-neutral-900">{item.optionB}</p>
          </div>
        ) : null}
      </div>

      {item.choose ? (
        <div className="rounded-md border border-amber-200 bg-amber-50/50 px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase text-amber-900">Choose</p>
          <p className="mt-0.5 text-xs leading-snug text-amber-950">{item.choose}</p>
        </div>
      ) : null}

      {item.seniorReasoning ? (
        <div className="rounded-md border border-neutral-200 px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase text-muted-foreground">Senior reasoning</p>
          <p className="mt-0.5 text-xs leading-snug text-neutral-900">{item.seniorReasoning}</p>
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-3">
        {item.metric ? (
          <div className="rounded-md border border-violet-100 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase text-violet-800">Metric</p>
            <p className="mt-0.5 text-xs leading-snug">{item.metric}</p>
          </div>
        ) : null}
        {item.guardrail ? (
          <div className="rounded-md border border-amber-100 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase text-amber-900">Guardrail</p>
            <p className="mt-0.5 text-xs leading-snug">{item.guardrail}</p>
          </div>
        ) : null}
        {item.dependency ? (
          <div className="rounded-md border border-neutral-200 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Dependency</p>
            <p className="mt-0.5 text-xs leading-snug">{item.dependency}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CaseBundle({
  item,
  onClose,
  onOpenCheatSheet,
  onOpenPanel,
}: {
  item: PlaybookCase;
  onClose: () => void;
  onOpenCheatSheet?: (hint: string) => void;
  onOpenPanel?: (questionId: string) => void;
}) {
  const panelLinks = panelLinksForCase(item.id);
  const canSpeak = supportsSpeakingScript(item);
  const speakSlots = canSpeak ? getSpeakingScriptSlots(item) : null;
  const [mode, setMode] = useState<"speak" | "components">(canSpeak ? "speak" : "components");

  return (
    <div id="playbook-case-bundle" className="scroll-mt-28 space-y-3 rounded-lg border border-violet-300 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">
            {item.id} · {item.categoryLabel}
          </p>
          <h3 className="mt-1 text-base font-semibold text-violet-950">{item.title}</h3>
        </div>
        <button type="button" className="text-xs text-violet-800 underline-offset-2 hover:underline" onClick={onClose}>
          Close
        </button>
      </div>

      {canSpeak && speakSlots ? (
        <div className="flex rounded-md border border-violet-200 bg-violet-50/40 p-0.5 text-[11px]">
          <button
            type="button"
            className={cn(
              "flex-1 rounded px-2 py-1.5 font-semibold",
              mode === "speak" ? "bg-white text-violet-950 shadow-sm" : "text-violet-800 hover:bg-white/60"
            )}
            onClick={() => setMode("speak")}
          >
            Speak
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded px-2 py-1.5 font-semibold",
              mode === "components" ? "bg-white text-violet-950 shadow-sm" : "text-violet-800 hover:bg-white/60"
            )}
            onClick={() => setMode("components")}
          >
            Components
          </button>
        </div>
      ) : null}

      {canSpeak && speakSlots && mode === "speak" ? (
        <SpeakingScriptPanel slots={speakSlots} caseId={item.id} />
      ) : (
        <CaseComponentsView item={item} />
      )}

      {(panelLinks.length > 0 && onOpenPanel) || onOpenCheatSheet ? (
        <div className="rounded-md border border-violet-200 bg-violet-50/50 px-2.5 py-2">
          <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">Jump to</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {onOpenPanel
              ? panelLinks.map((link) =>
                  link.questionId ? (
                    <button
                      key={link.curatedKey}
                      type="button"
                      className="rounded-full border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-950 hover:bg-violet-100"
                      onClick={() => onOpenPanel(link.questionId!)}
                    >
                      Panel {link.curatedKey}
                    </button>
                  ) : null
                )
              : null}
            {onOpenCheatSheet ? (
              <button
                type="button"
                className="rounded-full border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-950 hover:bg-violet-100"
                onClick={() => onOpenCheatSheet(item.cheatSheetHint)}
              >
                {item.cheatSheetHint === "product-sense"
                  ? "Product sheet"
                  : item.cheatSheetHint === "system-design"
                    ? "System sheet"
                    : item.cheatSheetHint === "diagnostic"
                      ? "Diagnostic sheet"
                      : "Technical sheet"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PrimerView({ onOpenCase }: { onOpenCase: (id: string) => void }) {
  const [activeTrigger, setActiveTrigger] = useState<string | null>(primerLiveData.navMatrix[0]?.trigger ?? null);
  const related = useMemo(
    () => (activeTrigger ? relatedCasesByTrigger(activeTrigger) : []),
    [activeTrigger]
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Key distinctions</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {primerLiveData.distinctions.map((d) => (
            <div key={d.label} className="rounded-md border border-violet-100 bg-violet-50/40 px-2.5 py-2">
              <p className="text-xs font-semibold text-violet-950">{d.label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{d.question}</p>
              <p className="mt-1 text-xs leading-snug text-neutral-900">{d.distinction}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Trigger → first move</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {primerLiveData.navMatrix.map((t) => (
            <button
              key={t.trigger}
              type="button"
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                activeTrigger === t.trigger
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-violet-200 bg-white text-violet-950 hover:bg-violet-50"
              )}
              onClick={() => setActiveTrigger(t.trigger)}
            >
              {t.trigger}
            </button>
          ))}
        </div>
        {activeTrigger ? (
          <div className="mt-2 rounded-md border border-violet-200 bg-white px-3 py-2.5 text-xs">
            {(() => {
              const t = primerLiveData.navMatrix.find((x) => x.trigger === activeTrigger)!;
              return (
                <div className="space-y-1.5">
                  <p>
                    <span className="font-semibold text-violet-900">Root:</span> {t.rootProblem}
                  </p>
                  <p>
                    <span className="font-semibold text-violet-900">First move:</span> {t.intervention}
                  </p>
                  <p>
                    <span className="font-semibold text-violet-900">Outcome:</span> {t.outcome}
                  </p>
                  <p>
                    <span className="font-semibold text-amber-900">Guardrail:</span> {t.guardrail}
                  </p>
                </div>
              );
            })()}
          </div>
        ) : null}
      </div>

      {related.length > 0 ? (
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Related prepared answers</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {related.map((item) => (
              <CaseCard key={item.id} item={item} selected={false} onSelect={() => onOpenCase(item.id)} />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Spoken takeaways</p>
        <div className="mt-2 space-y-2">
          {primerLiveData.parts
            .filter((p) => p.takeaway)
            .map((p) => (
              <div key={p.id} className="rounded-md border border-neutral-200 px-2.5 py-2">
                <p className="text-[11px] font-semibold text-violet-950">{p.title}</p>
                <p className="mt-1 text-xs leading-snug text-neutral-800">{p.takeaway}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export function JazPlaybookCasesPanel({
  focusCaseId,
  onOpenCheatSheet,
  onOpenPanel,
}: {
  focusCaseId?: string | null;
  onOpenCheatSheet?: (hint: string) => void;
  onOpenPanel?: (questionId: string) => void;
}) {
  const [filter, setFilter] = useState<PlaybookLiveType | "all" | "primer">("priority");
  const [categoryId, setCategoryId] = useState<string>("priority");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localQuery, setLocalQuery] = useState("");
  const [browseOpen, setBrowseOpen] = useState(false);

  const openCase = (id: string) => {
    const item = playbookCasesData.questions.find((q) => q.id === id);
    if (!item) return;
    setLocalQuery("");
    setFilter(item.priority ? "priority" : item.liveType);
    setCategoryId(item.priority ? "priority" : item.categoryId);
    setSelectedId(item.id);
    setBrowseOpen(false);
  };

  useEffect(() => {
    if (!focusCaseId) return;
    openCase(focusCaseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focusCaseId drives external open
  }, [focusCaseId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    window.requestAnimationFrame(() => {
      document.getElementById("playbook-case-bundle")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [selectedId]);

  const searchHits = useMemo(() => {
    if (localQuery.trim().length < 2) return [];
    return searchPlaybookCases(localQuery).filter((h) => h.caseId);
  }, [localQuery]);

  const searchCases = useMemo(() => {
    const ids = [...new Set(searchHits.map((h) => h.caseId!).filter(Boolean))];
    return ids
      .map((id) => playbookCasesData.questions.find((q) => q.id === id))
      .filter((q): q is PlaybookCase => Boolean(q));
  }, [searchHits]);

  const searching = localQuery.trim().length >= 2;

  const visibleCases = useMemo(() => {
    if (filter === "primer") return [];
    if (filter === "priority") return casesForCategory("priority");
    if (filter === "all") return playbookCasesData.questions.filter((q) => !q.priority);
    if (filter === "product-sense") {
      return playbookCasesData.questions.filter(
        (q) => !q.priority && ["accounts-product-sense", "activation-growth", "cards-payments", "investments-savings"].includes(q.categoryId)
      );
    }
    return playbookCasesData.questions.filter((q) => !q.priority && q.liveType === filter);
  }, [filter]);

  const categoryChips = useMemo(() => {
    if (filter !== "product-sense") return [];
    return playbookCategories.filter((c) =>
      ["accounts-product-sense", "activation-growth", "cards-payments", "investments-savings"].includes(c.id)
    );
  }, [filter]);

  const listCases = useMemo(() => {
    if (filter !== "product-sense") return visibleCases;
    if (!categoryId || categoryId === "priority") return visibleCases;
    return visibleCases.filter((q) => q.categoryId === categoryId);
  }, [filter, categoryId, visibleCases]);

  const selected = listCases.find((q) => q.id === selectedId) ?? playbookCasesData.questions.find((q) => q.id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 md:px-8">
      <p className="text-xs font-medium tracking-wide text-violet-800 uppercase">Live reference · Cases</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{playbookCasesData.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{playbookCasesData.useFor}</p>
      <p className="mt-1 text-[11px] text-amber-900">
        Practice answers from the Everyday Banking playbook — hypothetical, not confirmed interview prompts.
      </p>

      <div className="sticky top-0 z-10 -mx-2 mt-4 space-y-2 bg-white/95 px-2 py-2 backdrop-blur">
        <label className="sr-only" htmlFor="cases-live-search">
          Search prepared cases
        </label>
        <input
          id="cases-live-search"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            if (e.target.value.trim().length >= 2) setSelectedId(null);
          }}
          placeholder="What did they ask? e.g. pending, balance, primary bank…"
          className="h-10 w-full rounded-md border border-violet-300 bg-white px-3 text-sm shadow-sm outline-none ring-violet-200 focus:ring-2"
          autoComplete="off"
        />

        <div>
          <p className="mb-1 text-[10px] font-semibold tracking-wide text-violet-800 uppercase">Interviewer language</p>
          <div className="flex flex-wrap gap-1.5">
            {LIVE_CASE_TRIGGERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-950 hover:border-violet-400 hover:bg-violet-50"
                onClick={() => openCase(t.primaryCaseId)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {CASE_SEARCH_SUGGESTIONS.filter(
              (s) => !LIVE_CASE_TRIGGERS.some((t) => t.label.toLowerCase() === s.toLowerCase())
            ).map((s) => (
              <button
                key={s}
                type="button"
                className="rounded-md border border-violet-100 bg-violet-50/60 px-2 py-0.5 text-[10px] font-medium text-violet-900 hover:bg-violet-100"
                onClick={() => setLocalQuery(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            className="text-[11px] font-medium text-violet-800 underline-offset-2 hover:underline"
            onClick={() => setBrowseOpen((o) => !o)}
          >
            {browseOpen ? "Hide browse filters" : "Browse by type"}
          </button>
          {browseOpen ? (
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {LIVE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      filter === f.id && !searching
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-violet-200 bg-white text-violet-950 hover:bg-violet-50"
                    )}
                    onClick={() => {
                      setLocalQuery("");
                      setFilter(f.id);
                      setSelectedId(null);
                      if (f.id === "priority") setCategoryId("priority");
                      if (f.id === "product-sense") setCategoryId("accounts-product-sense");
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {categoryChips.length > 0 && !searching ? (
                <div className="flex flex-wrap gap-1.5">
                  {categoryChips.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={cn(
                        "rounded-md border px-2 py-1 text-[10px] font-medium",
                        categoryId === c.id
                          ? "border-violet-400 bg-violet-100 text-violet-950"
                          : "border-violet-100 bg-white text-violet-900 hover:bg-violet-50"
                      )}
                      onClick={() => {
                        setCategoryId(c.id);
                        setSelectedId(null);
                      }}
                    >
                      {c.label} ({c.count})
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        {searching ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {searchCases.length} matches for “{localQuery.trim()}”
            </p>
            {searchCases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No cases — try a trigger chip above.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {searchCases.map((item) => (
                  <CaseCard
                    key={item.id}
                    item={item}
                    selected={selectedId === item.id}
                    onSelect={() => setSelectedId((cur) => (cur === item.id ? null : item.id))}
                  />
                ))}
              </div>
            )}
            {selected ? (
              <CaseBundle
                key={selected.id}
                item={selected}
                onClose={() => setSelectedId(null)}
                onOpenCheatSheet={onOpenCheatSheet}
                onOpenPanel={onOpenPanel}
              />
            ) : null}
          </div>
        ) : filter === "primer" ? (
          <PrimerView onOpenCase={openCase} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {listCases.length} prepared answers — tap a trigger above, or expand below.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {listCases.map((item) => (
                <CaseCard
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => setSelectedId((cur) => (cur === item.id ? null : item.id))}
                />
              ))}
            </div>
            {selected ? (
              <CaseBundle
                key={selected.id}
                item={selected}
                onClose={() => setSelectedId(null)}
                onOpenCheatSheet={onOpenCheatSheet}
                onOpenPanel={onOpenPanel}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

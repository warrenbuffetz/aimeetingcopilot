"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EXPERIENCE_MODULES,
  INTERVIEW_ROUND_LABELS,
  LIBRARY_SECTION_LABELS,
  LIBRARY_SECTION_ORDER,
  buildProductExperienceTree,
  intentLabel,
  moduleIdsForConcept,
  searchLibrary,
  type ConceptSpan,
  type EnrichedQaRow,
  type FollowUpSuggestion,
  type InterviewRound,
  type InterviewSessionContext,
  type LibrarySection,
  type QuestionIntent,
} from "@interview-copilot/shared";
import { AnswerPreviewCard } from "@/components/live/answer-preview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { ArrowLeft, Search } from "lucide-react";

type NavigatorTab = "next" | "experiences" | "all";

export type QuestionMapFocus = {
  title: string;
  moduleIds?: string[];
  intent?: QuestionIntent;
  /** Narrow map rows via library search (browse-only). */
  searchQuery?: string;
};

export function focusFromConceptSpan(span: ConceptSpan, catalog: EnrichedQaRow[]): QuestionMapFocus {
  const moduleIds = span.moduleId
    ? [span.moduleId]
    : moduleIdsForConcept(span.label, catalog);
  return { title: span.label, moduleIds: moduleIds.length ? moduleIds : undefined };
}

export function focusForWholeQuestion(question: string, _catalog: EnrichedQaRow[]): QuestionMapFocus {
  const trimmed = question.trim();
  return { title: trimmed.length > 72 ? `${trimmed.slice(0, 72)}…` : trimmed, searchQuery: trimmed };
}

function filterCatalogForMap(catalog: EnrichedQaRow[], focus: QuestionMapFocus): EnrichedQaRow[] {
  let rows = catalog;
  if (focus.moduleIds?.length) {
    const ids = new Set(focus.moduleIds);
    rows = rows.filter((r) => ids.has(r.navigator.experienceModuleId));
  }
  if (focus.intent) {
    rows = rows.filter((r) => r.navigator.intent === focus.intent);
  }
  if (focus.searchQuery && focus.searchQuery.length >= 3) {
    const hits = searchLibrary(catalog, focus.searchQuery, 48);
    const hitIds = new Set(hits.map((h) => h.rowId));
    rows = rows.filter((r) => hitIds.has(r.id));
  }
  return rows;
}

type Props = {
  className?: string;
  catalog: EnrichedQaRow[];
  context: InterviewSessionContext;
  nextSuggestions: FollowUpSuggestion[];
  pinnedQuestion: string | null;
  mapFocus: QuestionMapFocus | null;
  onMapFocusChange: (focus: QuestionMapFocus | null) => void;
  onOpenInMainPanel: (row: EnrichedQaRow, opts?: { fromBrowse?: boolean }) => void;
  onPin: (row: EnrichedQaRow) => void;
  onSetExperience: (moduleId: string | null, label?: string) => void;
  onSetInterviewRound: (round: InterviewRound | null) => void;
  onClearContext: () => void;
  onSearchOpen: () => void;
  practiceFooter: React.ReactNode;
};

function ActiveExperienceCard({
  context,
  onSetExperience,
  onClearContext,
}: {
  context: InterviewSessionContext;
  onSetExperience: (moduleId: string | null, label?: string) => void;
  onClearContext: () => void;
}) {
  const activeId = context.manualExperienceOverrideId ?? context.activeExperienceModuleId;
  return (
    <section className="rounded-md border border-border/70 bg-muted/5 px-2 py-2">
      <p className="text-[10px] font-medium uppercase text-muted-foreground">Active experience</p>
      <p className="text-sm font-medium leading-tight">
        {context.activeExperienceLabel ?? "—"}
        {context.manualExperienceOverrideId && (
          <span className="ml-1 text-[10px] font-normal text-amber-400">(manual)</span>
        )}
      </p>
      {context.activeIntent && (
        <p className="text-[10px] text-muted-foreground">Intent: {intentLabel(context.activeIntent)}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        <select
          className="h-7 max-w-full rounded border border-border bg-background px-1 text-[10px]"
          value={activeId ?? ""}
          onChange={(e) => {
            const id = e.target.value || null;
            const mod = id ? EXPERIENCE_MODULES[id] : null;
            onSetExperience(id, mod?.label ?? undefined);
          }}
        >
          <option value="">Auto (from conversation)</option>
          {Object.values(EXPERIENCE_MODULES)
            .filter((m) => m.id !== "unclassified-review")
            .map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
        </select>
        <Button type="button" size="sm" variant="outline" className="h-7 text-[10px]" onClick={onClearContext}>
          Clear context
        </Button>
      </div>
    </section>
  );
}

export function InterviewNavigator({
  className,
  catalog,
  context,
  nextSuggestions,
  pinnedQuestion,
  mapFocus,
  onMapFocusChange,
  onOpenInMainPanel,
  onPin,
  onSetExperience,
  onSetInterviewRound,
  onClearContext,
  onSearchOpen,
  practiceFooter,
}: Props) {
  const [tab, setTab] = useState<NavigatorTab>("next");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [browseQuery, setBrowseQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<LibrarySection | "all">("all");
  const [mapStack, setMapStack] = useState<QuestionMapFocus[]>([]);

  const activeMapFocus = mapStack.length > 0 ? mapStack[mapStack.length - 1] : mapFocus;

  const mapFocusKey = mapFocus
    ? `${mapFocus.title}|${mapFocus.searchQuery ?? ""}|${mapFocus.moduleIds?.join(",") ?? ""}|${mapFocus.intent ?? ""}`
    : "";
  const prevMapFocusKeyRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (prevMapFocusKeyRef.current === undefined) {
      prevMapFocusKeyRef.current = mapFocusKey;
      return;
    }
    if (prevMapFocusKeyRef.current !== mapFocusKey) {
      prevMapFocusKeyRef.current = mapFocusKey;
      setMapStack([]);
    }
  }, [mapFocusKey]);

  const experienceTree = useMemo(() => buildProductExperienceTree(catalog), [catalog]);
  const mapTree = useMemo(
    () => buildProductExperienceTree(activeMapFocus ? filterCatalogForMap(catalog, activeMapFocus) : []),
    [activeMapFocus, catalog]
  );
  const searchResults = useMemo(
    () => (browseQuery.length >= 2 ? searchLibrary(catalog, browseQuery, 20) : []),
    [catalog, browseQuery]
  );

  const bySection = useMemo(() => {
    const map = new Map<LibrarySection, EnrichedQaRow[]>();
    for (const s of LIBRARY_SECTION_ORDER) map.set(s, []);
    for (const row of catalog) {
      map.get(row.navigator.librarySection)?.push(row);
    }
    return map;
  }, [catalog]);

  const reviewQueue = useMemo(
    () => catalog.filter((r) => r.navigator.reviewStatus === "needs_review"),
    [catalog]
  );

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function drillMap(focus: QuestionMapFocus) {
    setMapStack((s) => {
      const base = s.length > 0 ? s : mapFocus ? [mapFocus] : [];
      return [...base, focus];
    });
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Interview Navigator
            </span>
            <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={onSearchOpen}>
              <Search className="h-3.5 w-3.5" />
              ⌘K
            </Button>
          </div>

          {activeMapFocus ? (
            <div className="border-b border-border px-2 py-2">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-[10px]"
                  onClick={() => {
                    if (mapStack.length > 1) {
                      setMapStack((s) => s.slice(0, -1));
                    } else {
                      setMapStack([]);
                      onMapFocusChange(null);
                    }
                  }}
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-[10px]"
                  onClick={() => {
                    setMapStack([]);
                    onMapFocusChange(null);
                  }}
                >
                  Clear
                </Button>
              </div>
              <p className={cn("mt-1 text-[10px] font-medium uppercase", liveSemantic.labelDetected)}>
                Question map
              </p>
              <p className={cn("text-sm font-medium leading-tight", liveSemantic.textAnswer)}>{activeMapFocus.title}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Browse only — does not change live context.
              </p>
            </div>
          ) : (
            <div className="flex border-b border-border px-2 pt-1">
              {(
                [
                  ["next", "Next"],
                  ["experiences", "Experiences"],
                  ["all", "All Answers"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "flex-1 border-b-2 px-1 py-1.5 text-[10px] font-medium uppercase tracking-wide",
                    tab === id
                      ? id === "next"
                        ? liveSemantic.navTabNextActive
                        : "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground/80"
                  )}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3 p-2">
          {!activeMapFocus && (
          <ActiveExperienceCard
            context={context}
            onSetExperience={onSetExperience}
            onClearContext={onClearContext}
          />
          )}
          {!activeMapFocus && (
          <section className="mx-2 mb-2 rounded-md border border-border/70 bg-muted/5 px-2 py-2">
            <p className="text-[10px] font-medium uppercase text-muted-foreground">Interview round (editorial)</p>
            <select
              className="mt-1 h-7 w-full rounded border border-border bg-background px-1 text-[10px]"
              value={context.activeInterviewRound ?? ""}
              onChange={(e) => {
                const v = e.target.value as InterviewRound | "";
                onSetInterviewRound(v ? v : null);
              }}
            >
              <option value="">No round filter</option>
              {(Object.entries(INTERVIEW_ROUND_LABELS) as [InterviewRound, string][]).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </section>
          )}

            {activeMapFocus && (
              <section className="space-y-2">
                {mapTree.length === 0 && (
                  <p className="text-xs text-muted-foreground">No prepared answers match this topic.</p>
                )}
                {mapTree.map((co) => (
                  <details key={co.company} className="rounded-md border border-border/60" open>
                    <summary className="cursor-pointer px-2 py-1.5 text-xs font-medium">{co.company}</summary>
                    <div className="space-y-1 border-t border-border/50 px-1 py-1">
                      {co.modules.map((mod) => (
                        <details key={mod.moduleId} className="rounded border border-border/40">
                          <summary className="flex cursor-pointer items-center justify-between gap-1 px-2 py-1 text-[11px] text-muted-foreground">
                            <span>{mod.label}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-6 px-1.5 text-[9px]"
                              onClick={(e) => {
                                e.preventDefault();
                                drillMap({ title: mod.label, moduleIds: [mod.moduleId] });
                              }}
                            >
                              Focus
                            </Button>
                          </summary>
                          <div className="space-y-1 px-1 pb-1">
                            {mod.intents.map((ig) => (
                              <details key={ig.intent} className="rounded border border-border/30 bg-muted/5">
                                <summary className="cursor-pointer px-2 py-1 text-[10px] font-medium">
                                  {ig.intentLabel} ({ig.rows.length})
                                </summary>
                                <ul className="space-y-1 p-1">
                                  {ig.rows.map((row) => (
                                    <li key={row.id}>
                                      <AnswerPreviewCard
                                        source={row}
                                        catalog={catalog}
                                        semanticAccent="library"
                                        expanded={Boolean(expanded[row.id])}
                                        onToggle={() => toggleExpanded(row.id)}
                                        onOpenMain={() => onOpenInMainPanel(row, { fromBrowse: true })}
                                        onPin={() => onPin(row)}
                                        showShortFirst
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                ))}
              </section>
            )}

            {!activeMapFocus && tab === "next" && (
              <section>
                <h3 className={cn("mb-1 text-[10px] font-medium uppercase tracking-wide", liveSemantic.labelSuggested)}>
                  Likely next questions
                </h3>
                <div className="space-y-1.5">
                  {nextSuggestions.map((s) => (
                    <AnswerPreviewCard
                      key={s.rowId}
                      source={s}
                      catalog={catalog}
                      semanticAccent="suggested"
                      expanded={Boolean(expanded[s.rowId])}
                      onToggle={() => toggleExpanded(s.rowId)}
                      onOpenMain={() => {
                        const row = catalog.find((r) => r.id === s.rowId);
                        if (row) onOpenInMainPanel(row);
                      }}
                      onPin={() => {
                        const row = catalog.find((r) => r.id === s.rowId);
                        if (row) onPin(row);
                      }}
                    />
                  ))}
                  {nextSuggestions.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Start a topic or load an answer to see follow-ups.
                    </p>
                  )}
                </div>
              </section>
            )}

            {!activeMapFocus && tab === "experiences" && (
              <section className="space-y-2">
                <p className="text-[10px] text-muted-foreground">
                  Browse only — does not change live interview context.
                </p>
                {experienceTree.map((co) => (
                  <details key={co.company} className="rounded-md border border-border/60" open>
                    <summary className="cursor-pointer px-2 py-1.5 text-xs font-medium">{co.company}</summary>
                    <div className="space-y-1 border-t border-border/50 px-1 py-1">
                      {co.modules.map((mod) => (
                        <details key={mod.moduleId} className="rounded border border-border/40">
                          <summary className="cursor-pointer px-2 py-1 text-[11px] text-muted-foreground">
                            {mod.label}
                          </summary>
                          <div className="space-y-1 px-1 pb-1">
                            {mod.intents.map((ig) => (
                              <details key={ig.intent} className="rounded border border-border/30 bg-muted/5">
                                <summary className="cursor-pointer px-2 py-1 text-[10px] font-medium">
                                  {ig.intentLabel} ({ig.rows.length})
                                </summary>
                                <ul className="space-y-1 p-1">
                                  {ig.rows.map((row) => (
                                    <li key={row.id}>
                                      <AnswerPreviewCard
                                        source={row}
                                        catalog={catalog}
                                        semanticAccent="library"
                                        expanded={Boolean(expanded[row.id])}
                                        onToggle={() => toggleExpanded(row.id)}
                                        onOpenMain={() => onOpenInMainPanel(row, { fromBrowse: true })}
                                        onPin={() => onPin(row)}
                                        showShortFirst
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                ))}
              </section>
            )}

            {!activeMapFocus && tab === "all" && (
              <section>
                <Input
                  value={browseQuery}
                  onChange={(e) => setBrowseQuery(e.target.value)}
                  placeholder="Search questions, tags, phrasings…"
                  className="mb-2 h-8 text-xs"
                />
                <select
                  className="mb-2 h-8 w-full rounded border border-border bg-background px-2 text-[10px]"
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value as LibrarySection | "all")}
                >
                  <option value="all">All sections</option>
                  {LIBRARY_SECTION_ORDER.map((s) => (
                    <option key={s} value={s}>{LIBRARY_SECTION_LABELS[s]}</option>
                  ))}
                </select>

                {reviewQueue.length > 0 && (
                  <details className="mb-2 rounded-md border border-amber-500/40 bg-amber-500/5">
                    <summary className="cursor-pointer px-2 py-1.5 text-[11px] font-medium text-amber-100/90">
                      Review queue ({reviewQueue.length})
                    </summary>
                    <ul className="space-y-1 p-1">
                      {reviewQueue.map((row) => (
                        <li key={row.id}>
                          <AnswerPreviewCard
                            source={row}
                            catalog={catalog}
                            semanticAccent="library"
                            expanded={Boolean(expanded[row.id])}
                            onToggle={() => toggleExpanded(row.id)}
                            onOpenMain={() => onOpenInMainPanel(row, { fromBrowse: true })}
                            onPin={() => onPin(row)}
                          />
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                <div className="space-y-1.5">
                  {(browseQuery.length >= 2
                    ? searchResults.map((hit) => catalog.find((r) => r.id === hit.rowId)).filter(Boolean)
                    : sectionFilter === "all"
                      ? catalog
                      : bySection.get(sectionFilter) ?? []
                  ).map((row) =>
                    row ? (
                      <AnswerPreviewCard
                        key={row.id}
                        source={row}
                        catalog={catalog}
                        semanticAccent="library"
                        expanded={Boolean(expanded[row.id])}
                        onToggle={() => toggleExpanded(row.id)}
                        onOpenMain={() => onOpenInMainPanel(row, { fromBrowse: true })}
                        onPin={() => onPin(row)}
                        showShortFirst
                      />
                    ) : null
                  )}
                </div>
              </section>
            )}
          </div>

          {pinnedQuestion && (
            <div className="border-t border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[10px] text-amber-100/90">
              Pinned: {pinnedQuestion.slice(0, 80)}
              {pinnedQuestion.length > 80 ? "…" : ""}
            </div>
          )}

          <div className="border-t border-border">{practiceFooter}</div>
        </div>
      </ScrollArea>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFitVisibleItemCount } from "@/hooks/use-fit-visible-item-count";
import {
  EXPERIENCE_MODULES,
  experienceModulesForProfile,
  INTERVIEW_ROUND_LABELS,
  LIBRARY_SECTION_LABELS,
  librarySectionsForProfile,
  type InterviewProfileKey,
  buildProductExperienceTree,
  countRowsInExperienceTree,
  filterCatalogForBrowse,
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
import { StoryMapPanel } from "@/components/live/story-map-panel";
import { AnswerPreviewCard } from "@/components/live/answer-preview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { liveSemantic } from "@/lib/live-semantic";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronDown, RotateCcw, Search } from "lucide-react";
import { PanelResizeHandle } from "@/components/live/panel-resize-handle";
import { useVerticalResize } from "@/hooks/use-vertical-resize";
import { clamp } from "@/hooks/use-horizontal-resize";
import { usePersistedNumber } from "@/hooks/use-persisted-state";

type NavigatorTab = "next" | "experiences" | "map" | "all";

const NAV_TAB_STORAGE_KEY = "ic-live-navigator-tab";

function loadNavTab(): NavigatorTab {
  if (typeof window === "undefined") return "next";
  const v = sessionStorage.getItem(NAV_TAB_STORAGE_KEY);
  if (v === "experiences" || v === "map" || v === "all" || v === "next") return v;
  return "next";
}

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
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

type Props = {
  className?: string;
  catalog: EnrichedQaRow[];
  interviewProfile: InterviewProfileKey;
  context: InterviewSessionContext;
  topInterviewQuestions: FollowUpSuggestion[];
  pinnedQuestion: string | null;
  mapFocus: QuestionMapFocus | null;
  onMapFocusChange: (focus: QuestionMapFocus | null) => void;
  onOpenInMainPanel: (row: EnrichedQaRow, opts?: { fromBrowse?: boolean }) => void;
  onPin: (row: EnrichedQaRow) => void;
  onSetExperience: (moduleId: string | null, label?: string) => void;
  onSetInterviewRound: (round: InterviewRound | null) => void;
  onClearContext: () => void;
  onStartFresh: () => void;
  onSearchOpen: () => void;
  mainPanelPreparedId?: string | null;
  practiceFooter: React.ReactNode;
};

const PRACTICE_PANEL_MIN = 48;
const PRACTICE_PANEL_MAX = 420;
const PRACTICE_PANEL_DEFAULT = 152;

function ActiveExperienceCard({
  context,
  catalog,
  interviewProfile,
  onSetExperience,
  onClearContext,
}: {
  context: InterviewSessionContext;
  catalog: EnrichedQaRow[];
  interviewProfile: InterviewProfileKey;
  onSetExperience: (moduleId: string | null, label?: string) => void;
  onClearContext: () => void;
}) {
  const profileModules = useMemo(
    () => experienceModulesForProfile(interviewProfile),
    [interviewProfile]
  );
  const activeId = context.manualExperienceOverrideId ?? context.activeExperienceModuleId;
  const activeSelectValue =
    activeId && profileModules.some((m) => m.id === activeId) ? activeId : "";
  const round = context.activeInterviewRound ?? null;
  const autoCount = useMemo(
    () => filterCatalogForBrowse(catalog, { interviewRound: round }).length,
    [catalog, round]
  );
  const moduleCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of profileModules) {
      map.set(
        m.id,
        filterCatalogForBrowse(catalog, { experienceModuleId: m.id, interviewRound: round }).length
      );
    }
    return map;
  }, [catalog, round, profileModules]);
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
          value={activeSelectValue}
          onChange={(e) => {
            const id = e.target.value || null;
            const mod = id ? EXPERIENCE_MODULES[id] : null;
            onSetExperience(id, mod?.label ?? undefined);
          }}
        >
          <option value="">Auto (from conversation) ({autoCount})</option>
          {profileModules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} ({moduleCounts.get(m.id) ?? 0})
              </option>
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
  interviewProfile,
  context,
  topInterviewQuestions,
  pinnedQuestion,
  mapFocus,
  onMapFocusChange,
  onOpenInMainPanel,
  onPin,
  onSetExperience,
  onSetInterviewRound,
  onClearContext,
  onStartFresh,
  onSearchOpen,
  mainPanelPreparedId = null,
  practiceFooter,
}: Props) {
  const [tab, setTab] = useState<NavigatorTab>("next");

  useEffect(() => {
    setTab(loadNavTab());
  }, []);

  useEffect(() => {
    sessionStorage.setItem(NAV_TAB_STORAGE_KEY, tab);
  }, [tab]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [browseQuery, setBrowseQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<LibrarySection | "all">("all");
  const librarySections = useMemo(
    () => librarySectionsForProfile(interviewProfile),
    [interviewProfile]
  );

  useEffect(() => {
    if (sectionFilter !== "all" && !librarySections.includes(sectionFilter)) {
      setSectionFilter("all");
    }
  }, [librarySections, sectionFilter]);
  const [mapStack, setMapStack] = useState<QuestionMapFocus[]>([]);
  const [topExpanded, setTopExpanded] = useState(false);

  useEffect(() => {
    setTopExpanded(false);
  }, [context.activeInterviewRound]);
  const [hideAskedTop, setHideAskedTop] = useState(false);
  const topListScrollRef = useRef<HTMLDivElement>(null);
  const topRowSampleRef = useRef<HTMLDivElement>(null);

  const [practicePanelHeight, setPracticePanelHeight] = usePersistedNumber(
    "ic-live-practice-debug-height",
    PRACTICE_PANEL_DEFAULT
  );
  const [practiceCollapsed, setPracticeCollapsed] = useState(false);

  const practiceResize = useVerticalResize((dy) => {
    setPracticeCollapsed(false);
    setPracticePanelHeight((h) => clamp(h - dy, PRACTICE_PANEL_MIN, PRACTICE_PANEL_MAX));
  });

  useEffect(() => {
    if (!mainPanelPreparedId) return;
    setExpanded((prev) => (prev[mainPanelPreparedId] ? prev : { ...prev, [mainPanelPreparedId]: true }));
  }, [mainPanelPreparedId]);

  const activeMapFocus = mapStack.length > 0 ? mapStack[mapStack.length - 1] : mapFocus;

  const topFiltered = useMemo(() => {
    if (hideAskedTop) {
      return topInterviewQuestions.filter((s) => !context.askedQuestionIds.includes(s.rowId));
    }
    return topInterviewQuestions;
  }, [hideAskedTop, topInterviewQuestions, context.askedQuestionIds]);

  const topFitCount = useFitVisibleItemCount(topListScrollRef, topRowSampleRef, {
    enabled: tab === "next" && !activeMapFocus && !topExpanded && topFiltered.length > 0,
    itemCount: topFiltered.length,
  });

  const anyTopCardExpanded = useMemo(
    () => topFiltered.some((s) => expanded[s.rowId]),
    [topFiltered, expanded]
  );

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

  const browseExperienceId =
    context.manualExperienceOverrideId ?? context.activeExperienceModuleId ?? null;
  const browseRound = context.activeInterviewRound ?? null;
  const browseFiltersActive = Boolean(browseExperienceId || browseRound);

  const filteredBrowseCatalog = useMemo(
    () =>
      filterCatalogForBrowse(catalog, {
        experienceModuleId: browseExperienceId,
        interviewRound: browseRound,
      }),
    [catalog, browseExperienceId, browseRound]
  );

  const browsableTotalCount = useMemo(
    () => filterCatalogForBrowse(catalog, {}).length,
    [catalog]
  );

  const roundBrowseCounts = useMemo(() => {
    const entries = Object.entries(INTERVIEW_ROUND_LABELS) as [InterviewRound, string][];
    const noRound = filterCatalogForBrowse(catalog, { experienceModuleId: browseExperienceId }).length;
    const byRound = new Map<InterviewRound, number>();
    for (const [id] of entries) {
      byRound.set(
        id,
        filterCatalogForBrowse(catalog, {
          experienceModuleId: browseExperienceId,
          interviewRound: id,
        }).length
      );
    }
    return { noRound, byRound };
  }, [catalog, browseExperienceId]);

  const experienceTree = useMemo(
    () => buildProductExperienceTree(filteredBrowseCatalog),
    [filteredBrowseCatalog]
  );
  const experienceOtherRows = useMemo(
    () =>
      filteredBrowseCatalog.filter((r) => r.navigator.librarySection !== "product_experience"),
    [filteredBrowseCatalog]
  );
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
    for (const s of librarySections) map.set(s, []);
    for (const row of filteredBrowseCatalog) {
      map.get(row.navigator.librarySection)?.push(row);
    }
    return map;
  }, [filteredBrowseCatalog, librarySections]);

  const reviewQueue = useMemo(
    () => filteredBrowseCatalog.filter((r) => r.navigator.reviewStatus === "needs_review"),
    [filteredBrowseCatalog]
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

  const practiceHeight = practiceCollapsed ? PRACTICE_PANEL_MIN : practicePanelHeight;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-2 py-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Interview Navigator
            </span>
            <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={onSearchOpen}>
              <Search className="h-3.5 w-3.5" />
              ⌘K
            </Button>
          </div>

          {activeMapFocus ? (
            <div className="shrink-0 border-b border-border px-2 py-2">
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
            <div className="flex shrink-0 border-b border-border px-2 pt-1">
              {(
                [
                  ["next", "Next"],
                  ["experiences", "Experiences"],
                  ["map", "Map"],
                  ["all", "All Answers"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "flex-1 border-b-2 px-0.5 py-1.5 text-[9px] font-medium uppercase tracking-wide sm:px-1 sm:text-[10px]",
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

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-2">
          {!activeMapFocus && (
          <div className="shrink-0 space-y-3">
          {tab !== "next" && tab !== "map" && (
            <ActiveExperienceCard
              context={context}
              catalog={catalog}
              interviewProfile={interviewProfile}
              onSetExperience={onSetExperience}
              onClearContext={onClearContext}
            />
          )}
          <section className="rounded-md border border-border/70 bg-muted/5 px-2 py-2">
            <p className="text-[10px] font-medium uppercase text-muted-foreground">
              Interview round {tab === "map" ? "(highlights only)" : "(editorial)"}
            </p>
            <select
              className="mt-1 h-7 w-full rounded border border-border bg-background px-1 text-[10px]"
              value={context.activeInterviewRound ?? ""}
              onChange={(e) => {
                const v = e.target.value as InterviewRound | "";
                onSetInterviewRound(v ? v : null);
              }}
            >
              <option value="">
                No round filter ({roundBrowseCounts.noRound})
              </option>
              {(Object.entries(INTERVIEW_ROUND_LABELS) as [InterviewRound, string][]).map(([id, label]) => (
                <option key={id} value={id}>
                  {label} ({roundBrowseCounts.byRound.get(id) ?? 0})
                </option>
              ))}
            </select>
          </section>
          </div>
          )}

            {activeMapFocus && (
              <section className="min-h-0 flex-1 space-y-2 overflow-y-auto">
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
              <section className="flex min-h-0 flex-1 flex-col">
                <div className="mb-1 flex shrink-0 flex-wrap items-center justify-between gap-2">
                  <h3 className={cn("text-[10px] font-medium uppercase tracking-wide", liveSemantic.labelSuggested)}>
                    Top interview questions
                  </h3>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-6 gap-1 px-2 text-[9px]"
                      title="Clear transcript, asked tracking, and match history for a real interview"
                      onClick={onStartFresh}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Start fresh
                    </Button>
                    <label className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <input
                        type="checkbox"
                        className="h-3 w-3 rounded border-border"
                        checked={hideAskedTop}
                        onChange={(e) => setHideAskedTop(e.target.checked)}
                      />
                      Hide asked
                    </label>
                  </div>
                </div>
                <p className="mb-2 shrink-0 text-[10px] leading-snug text-muted-foreground">
                  Full ranked list for this round ({topInterviewQuestions.length}) — stable while you interview.
                </p>
                <div
                  ref={topListScrollRef}
                  className={cn(
                    "min-h-0 flex-1 space-y-1.5 pr-0.5",
                    topExpanded || anyTopCardExpanded ? "overflow-y-auto" : "overflow-hidden"
                  )}
                >
                  {(() => {
                    const visible = topExpanded ? topFiltered : topFiltered.slice(0, topFitCount);
                    return visible.map((s, index) => {
                      const asked = context.askedQuestionIds.includes(s.rowId);
                      return (
                        <div
                          key={s.rowId}
                          ref={index === 0 ? topRowSampleRef : undefined}
                          className={cn(asked && "opacity-55")}
                          title={asked ? "Marked asked when a prepared answer was matched" : undefined}
                        >
                          <AnswerPreviewCard
                            source={s}
                            catalog={catalog}
                            semanticAccent="suggested"
                            expanded={Boolean(expanded[s.rowId])}
                            onToggle={() => toggleExpanded(s.rowId)}
                            onOpenMain={() => {
                              const row = catalog.find((r) => r.id === s.rowId);
                              if (row) {
                                setExpanded((prev) => ({ ...prev, [s.rowId]: true }));
                                onOpenInMainPanel(row, { fromBrowse: true });
                              }
                            }}
                            onPin={() => {
                              const row = catalog.find((r) => r.id === s.rowId);
                              if (row) onPin(row);
                            }}
                            showShortFirst
                            showExpandChevron
                            activeInMainPanel={mainPanelPreparedId === s.rowId}
                          />
                          {asked && (
                            <p className="px-1 text-[9px] uppercase tracking-wide text-muted-foreground">Asked</p>
                          )}
                        </div>
                      );
                    });
                  })()}
                  {topFiltered.length === 0 && topInterviewQuestions.length > 0 && (
                    <p className="text-xs text-muted-foreground">All top questions are hidden (Hide asked).</p>
                  )}
                  {topInterviewQuestions.length === 0 && (
                    <p className="text-xs text-muted-foreground">No prepared questions for this profile.</p>
                  )}
                </div>
                {topFiltered.length > 0 && (topExpanded || topFiltered.length > topFitCount) && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-7 w-full shrink-0 text-[10px]"
                    onClick={() => setTopExpanded((v) => !v)}
                  >
                    {topExpanded
                      ? "Show fewer"
                      : `Show ${topFiltered.length - topFitCount} more`}
                  </Button>
                )}
              </section>
            )}

            {!activeMapFocus && tab === "experiences" && (
              <section className="min-h-0 flex-1 space-y-2 overflow-y-auto">
                <p className="text-[10px] leading-snug text-muted-foreground">
                  {browseFiltersActive
                    ? `Showing ${filteredBrowseCatalog.length} of ${browsableTotalCount} prepared answers for this experience and round. Active experience also biases live matching.`
                    : "Product experience tree — pin Active experience or Interview round to narrow the library."}
                </p>
                {experienceTree.length === 0 && experienceOtherRows.length === 0 && (
                  <p className="text-xs text-muted-foreground">No prepared answers match these filters.</p>
                )}
                {experienceTree.map((co) => (
                  <details key={co.company} className="rounded-md border border-border/60" open>
                    <summary className="cursor-pointer px-2 py-1.5 text-xs font-medium">
                      {co.company} ({countRowsInExperienceTree([co])})
                    </summary>
                    <div className="space-y-1 border-t border-border/50 px-1 py-1">
                      {co.modules.map((mod) => {
                        const modCount = mod.intents.reduce((n, ig) => n + ig.rows.length, 0);
                        return (
                        <details key={mod.moduleId} className="rounded border border-border/40">
                          <summary className="cursor-pointer px-2 py-1 text-[11px] text-muted-foreground">
                            {mod.label} ({modCount})
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
                        );
                      })}
                    </div>
                  </details>
                ))}
                {experienceOtherRows.length > 0 && (
                  <details className="rounded-md border border-border/60" open>
                    <summary className="cursor-pointer px-2 py-1.5 text-xs font-medium">
                      Other library sections ({experienceOtherRows.length})
                    </summary>
                    <ul className="space-y-1 border-t border-border/50 p-1">
                      {experienceOtherRows.map((row) => (
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
                )}
              </section>
            )}

            {!activeMapFocus && tab === "map" && (
              <StoryMapPanel
                catalog={catalog}
                interviewProfile={interviewProfile}
                highlightRound={context.activeInterviewRound}
                expanded={expanded}
                onToggleExpanded={(id) => toggleExpanded(id)}
                onOpenInMainPanel={onOpenInMainPanel}
                onPin={onPin}
                mainPanelPreparedId={mainPanelPreparedId}
              />
            )}

            {!activeMapFocus && tab === "all" && (
              <section className="min-h-0 flex-1 overflow-y-auto">
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
                  <option value="all">All sections ({filteredBrowseCatalog.length})</option>
                  {librarySections.map((s) => {
                    const n = bySection.get(s)?.length ?? 0;
                    return (
                      <option key={s} value={s} disabled={n === 0}>
                        {LIBRARY_SECTION_LABELS[s]} ({n})
                      </option>
                    );
                  })}
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
                    ? searchResults
                        .map((hit) => filteredBrowseCatalog.find((r) => r.id === hit.rowId))
                        .filter(Boolean)
                    : sectionFilter === "all"
                      ? filteredBrowseCatalog
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
            <div className="shrink-0 border-t border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[10px] text-amber-100/90">
              Pinned: {pinnedQuestion.slice(0, 80)}
              {pinnedQuestion.length > 80 ? "…" : ""}
            </div>
          )}
      </div>

      <PanelResizeHandle
        orientation="horizontal"
        label="Resize practice and debug panel"
        onPointerDown={practiceResize.onPointerDown}
        className="border-t border-border/80"
      />
      <div
        className="flex shrink-0 flex-col overflow-hidden border-t border-border bg-muted/5"
        style={{ height: practiceHeight }}
      >
        <button
          type="button"
          className="flex w-full shrink-0 items-center gap-1.5 px-2 py-1.5 text-left hover:bg-muted/30"
          onClick={() => setPracticeCollapsed((c) => !c)}
          aria-expanded={!practiceCollapsed}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              !practiceCollapsed && "rotate-180"
            )}
            aria-hidden
          />
          <span className="text-xs font-medium text-muted-foreground">Practice &amp; debug</span>
        </button>
        {!practiceCollapsed && (
          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">{practiceFooter}</div>
        )}
      </div>
    </div>
  );
}

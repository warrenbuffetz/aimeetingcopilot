"use client";

import { useMemo, useState } from "react";
import {
  EXPERIENCE_MODULES,
  LIBRARY_SECTION_LABELS,
  LIBRARY_SECTION_ORDER,
  buildProductExperienceTree,
  intentLabel,
  searchLibrary,
  type EnrichedQaRow,
  type FollowUpSuggestion,
  type InterviewSessionContext,
  type LibrarySection,
} from "@interview-copilot/shared";
import { AnswerPreviewCard } from "@/components/live/answer-preview-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type NavigatorTab = "next" | "experiences" | "all";

type Props = {
  className?: string;
  catalog: EnrichedQaRow[];
  context: InterviewSessionContext;
  nextSuggestions: FollowUpSuggestion[];
  pinnedQuestion: string | null;
  onOpenInMainPanel: (row: EnrichedQaRow, opts?: { fromBrowse?: boolean }) => void;
  onPin: (row: EnrichedQaRow) => void;
  onSetExperience: (moduleId: string | null, label?: string) => void;
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
  onOpenInMainPanel,
  onPin,
  onSetExperience,
  onClearContext,
  onSearchOpen,
  practiceFooter,
}: Props) {
  const [tab, setTab] = useState<NavigatorTab>("next");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [browseQuery, setBrowseQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<LibrarySection | "all">("all");

  const experienceTree = useMemo(() => buildProductExperienceTree(catalog), [catalog]);
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
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground/80"
                )}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-3 p-2">
            <ActiveExperienceCard
              context={context}
              onSetExperience={onSetExperience}
              onClearContext={onClearContext}
            />

            {tab === "next" && (
              <section>
                <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Likely next questions
                </h3>
                <div className="space-y-1.5">
                  {nextSuggestions.map((s) => (
                    <AnswerPreviewCard
                      key={s.rowId}
                      source={s}
                      catalog={catalog}
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

            {tab === "experiences" && (
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

            {tab === "all" && (
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

"use client";

import { useMemo, useState } from "react";
import {
  EXPERIENCE_MODULES,
  LIBRARY_CATEGORY_LABELS,
  intentLabel,
  moduleCatalog,
  suggestFollowUps,
  type EnrichedQaRow,
  type FollowUpSuggestion,
  type InterviewSessionContext,
  type LibraryCategory,
} from "@interview-copilot/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScriptText } from "@/components/live/script-text";
import { cn } from "@/lib/utils";
import { ChevronDown, Copy, Pin, Search } from "lucide-react";
import { toast } from "sonner";

type Props = {
  className?: string;
  catalog: EnrichedQaRow[];
  context: InterviewSessionContext;
  suggestions: FollowUpSuggestion[];
  pinnedQuestion: string | null;
  onOpenInMainPanel: (row: EnrichedQaRow) => void;
  onPin: (row: EnrichedQaRow) => void;
  onSetExperience: (moduleId: string | null, label?: string) => void;
  onClearContext: () => void;
  onSearchOpen: () => void;
  practiceFooter: React.ReactNode;
};

/** Answer body when a navigator row is expanded — improves contrast on dark UI. */
const expandedAnswerCopyClass =
  "rounded-md border border-border/60 bg-muted/45 px-2.5 py-2 text-[11px] leading-relaxed text-foreground/95";

function groupBrowse(catalog: EnrichedQaRow[]) {
  const tree = new Map<LibraryCategory, Map<string, EnrichedQaRow[]>>();
  for (const row of catalog) {
    const cat = row.navigator.libraryCategory;
    if (!tree.has(cat)) tree.set(cat, new Map());
    const mod = tree.get(cat)!;
    const mid = row.navigator.experienceModuleId;
    if (!mod.has(mid)) mod.set(mid, []);
    mod.get(mid)!.push(row);
  }
  return tree;
}

function FollowUpCard({
  item,
  expanded,
  onToggle,
  onOpenMain,
  onPin,
}: {
  item: FollowUpSuggestion;
  expanded: boolean;
  onToggle: () => void;
  onOpenMain: () => void;
  onPin: () => void;
}) {
  return (
    <div className="rounded-md border border-border/80 bg-muted/10">
      <button
        type="button"
        className="flex w-full items-start gap-1 px-2 py-1.5 text-left"
        onClick={onToggle}
      >
        <ChevronDown className={cn("mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform", expanded && "rotate-180")} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-snug">{item.question}</p>
          <p className="text-[10px] text-muted-foreground">
            {item.experienceLabel} · {intentLabel(item.intent)}
          </p>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border/60 px-2 pb-2 pt-1">
          <p className="text-[10px] text-muted-foreground">{item.reason}</p>
          <ScriptText
            text={item.answer}
            className={cn("mt-1.5 max-h-32 overflow-y-auto", expandedAnswerCopyClass)}
          />
          <div className="mt-2 flex flex-wrap gap-1">
            <Button type="button" size="sm" variant="secondary" className="h-7 text-xs" onClick={onOpenMain}>
              Open in main panel
            </Button>
            <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={onPin}>
              <Pin className="h-3 w-3" />
              Pin
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => {
                void navigator.clipboard.writeText(item.answer);
                toast.success("Copied");
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function InterviewNavigator({
  className,
  catalog,
  context,
  suggestions,
  pinnedQuestion,
  onOpenInMainPanel,
  onPin,
  onSetExperience,
  onClearContext,
  onSearchOpen,
  practiceFooter,
}: Props) {
  const [expandedSuggest, setExpandedSuggest] = useState<Record<string, boolean>>({});
  const [browseQuery, setBrowseQuery] = useState("");
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [showAllModule, setShowAllModule] = useState(false);

  const browseTree = useMemo(() => groupBrowse(catalog), [catalog]);
  const moduleSuggestions = useMemo(() => {
    if (!showAllModule || !context.activeExperienceModuleId) return suggestions;
    return suggestFollowUps(catalog, context, { limit: 12, includeAllModule: true });
  }, [catalog, context, showAllModule, suggestions]);

  const activeId = context.manualExperienceOverrideId ?? context.activeExperienceModuleId;

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

          <div className="space-y-3 p-2">
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
                {Object.values(EXPERIENCE_MODULES).map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <Button type="button" size="sm" variant="outline" className="h-7 text-[10px]" onClick={onClearContext}>
                Clear context
              </Button>
            </div>
          </section>

          <section>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Suggested follow-ups
              </h3>
              {context.activeExperienceModuleId && (
                <button
                  type="button"
                  className="text-[10px] text-primary underline-offset-2 hover:underline"
                  onClick={() => setShowAllModule((v) => !v)}
                >
                  {showAllModule ? "Top ranked" : "Show all related"}
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              {moduleSuggestions.map((s) => (
                <FollowUpCard
                  key={s.rowId}
                  item={s}
                  expanded={Boolean(expandedSuggest[s.rowId])}
                  onToggle={() =>
                    setExpandedSuggest((prev) => ({ ...prev, [s.rowId]: !prev[s.rowId] }))
                  }
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
              {moduleSuggestions.length === 0 && (
                <p className="text-xs text-muted-foreground">Start a topic or load an answer to see suggestions.</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Browse answer library
            </h3>
            <Input
              value={browseQuery}
              onChange={(e) => setBrowseQuery(e.target.value)}
              placeholder="Filter…"
              className="mb-2 h-8 text-xs"
            />
            <div className="space-y-2">
              {[...browseTree.entries()].map(([cat, modules]) => (
                <details key={cat} className="rounded-md border border-border/60" open>
                  <summary className="cursor-pointer px-2 py-1.5 text-xs font-medium">
                    {LIBRARY_CATEGORY_LABELS[cat]}
                  </summary>
                  <div className="space-y-1 border-t border-border/50 px-1 py-1">
                    {[...modules.entries()].map(([modId, rows]) => {
                      const label = EXPERIENCE_MODULES[modId]?.label ?? rows[0]?.navigator.experienceLabel ?? modId;
                      const filtered = rows.filter(
                        (r) =>
                          !browseQuery ||
                          r.question.toLowerCase().includes(browseQuery.toLowerCase()) ||
                          r.answer.toLowerCase().includes(browseQuery.toLowerCase())
                      );
                      if (filtered.length === 0) return null;
                      const open = openModules[modId] ?? false;
                      return (
                        <details
                          key={modId}
                          open={open}
                          onToggle={(e) => {
                            const el = e.currentTarget;
                            setOpenModules((prev) => ({ ...prev, [modId]: el.open }));
                          }}
                        >
                          <summary className="cursor-pointer px-2 py-1 text-[11px] text-muted-foreground">
                            {label} ({filtered.length})
                          </summary>
                          <ul className="space-y-1 pb-1 pl-1">
                            {moduleCatalog(filtered, modId).map((row) => (
                              <li key={row.id}>
                                <details className="rounded border border-border/40 bg-background/50 open:border-border/70 open:bg-muted/20">
                                  <summary className="cursor-pointer px-2 py-1 text-[11px] leading-snug">
                                    <span className="text-[10px] text-muted-foreground">{intentLabel(row.navigator.intent)} · </span>
                                    {row.question}
                                  </summary>
                                  <div className="border-t border-border/40 px-2 py-1.5">
                                    <ScriptText
                                      text={row.answer}
                                      className={cn("max-h-28 overflow-y-auto", expandedAnswerCopyClass)}
                                    />
                                    <div className="mt-1.5 flex gap-1">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        className="h-6 text-[10px]"
                                        onClick={() => onOpenInMainPanel(row)}
                                      >
                                        Open in main
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 text-[10px]"
                                        onClick={() => onPin(row)}
                                      >
                                        Pin
                                      </Button>
                                    </div>
                                  </div>
                                </details>
                              </li>
                            ))}
                          </ul>
                        </details>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </section>
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

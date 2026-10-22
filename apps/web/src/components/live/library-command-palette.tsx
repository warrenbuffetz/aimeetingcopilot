"use client";

import { useEffect, useMemo, useState } from "react";
import { searchLibrary, type EnrichedQaRow } from "@interview-copilot/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: EnrichedQaRow[];
  onSelect: (row: EnrichedQaRow) => void;
};

export function LibraryCommandPalette({ open, onOpenChange, catalog, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchLibrary(catalog, query, 14), [catalog, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function choose(row: EnrichedQaRow) {
    onSelect(row);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-2 p-0" showCloseButton>
        <DialogHeader className="border-b border-border px-3 py-2">
          <DialogTitle className="text-sm">Search library</DialogTitle>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Interac, direct deposit, P&L…"
            className="mt-2 h-9"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Enter" && results[activeIndex]) {
                e.preventDefault();
                const row = catalog.find((r) => r.id === results[activeIndex].rowId);
                if (row) choose(row);
              }
            }}
          />
        </DialogHeader>
        <ul className="max-h-[min(50vh,360px)] overflow-y-auto px-1 pb-2">
          {results.map((r, i) => (
            <li key={r.rowId}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-md px-2 py-2 text-left text-sm",
                  i === activeIndex && "bg-muted"
                )}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  const row = catalog.find((x) => x.id === r.rowId);
                  if (row) choose(row);
                }}
              >
                <div className="text-[10px] text-muted-foreground">{r.experienceLabel}</div>
                <div className="font-medium leading-snug">{r.question}</div>
              </button>
            </li>
          ))}
          {query.length >= 2 && results.length === 0 && (
            <li className="px-2 py-4 text-center text-xs text-muted-foreground">No matches</li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function useLibraryCommandPalette(onSelect: (row: EnrichedQaRow) => void, catalog: EnrichedQaRow[]) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        const t = e.target as HTMLElement;
        if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return {
    paletteOpen: open,
    setPaletteOpen: setOpen,
    palette: (
      <LibraryCommandPalette open={open} onOpenChange={setOpen} catalog={catalog} onSelect={onSelect} />
    ),
  };
}

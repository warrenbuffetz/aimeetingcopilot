"use client";

import { Search } from "lucide-react";
import { bristolStoryEmployerGroups, bristolStoryMaps, type BristolStoryMap } from "@/lib/bristol-focused/story-maps";
import { searchBristolStoryMaps } from "@/lib/bristol-focused/story-map-search";
import { cn } from "@/lib/utils";

type Props = {
  selectedId: string;
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
};

export function BristolStoryMapSidebar({ selectedId, query, onQueryChange, onSelect }: Props) {
  const filtered = query.trim().length >= 2 ? searchBristolStoryMaps(bristolStoryMaps, query) : bristolStoryMaps;
  const visibleIds = new Set(filtered.map((story) => story.id));

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f4fb] text-neutral-900">
      <div className="shrink-0 border-b border-violet-100 p-3">
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-violet-800 uppercase">Choose an experience</p>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search: Interac, Neo, GA4…"
            className="h-9 w-full rounded-md border border-violet-100 bg-white pr-2 pl-8 text-sm text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            aria-label="Search experience maps"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
        {bristolStoryEmployerGroups.map((group) => {
          const items = group.storyIds
            .map((id) => bristolStoryMaps.find((story) => story.id === id))
            .filter((story): story is BristolStoryMap => Boolean(story && visibleIds.has(story.id)));
          if (!items.length) return null;
          return (
            <div key={group.id} className="mb-3">
              <p className="px-2 pb-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{group.label}</p>
              {items.map((story) => {
                const selected = story.id === selectedId;
                return (
                  <button
                    key={story.id}
                    type="button"
                    className={cn(
                      "mb-0.5 flex w-full flex-col rounded-md px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
                      selected ? "bg-violet-200 font-medium text-violet-950" : "hover:bg-white/80"
                    )}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => onSelect(story.id)}
                  >
                    <span className="text-[13px] leading-5">{story.title}</span>
                    <span className="text-[11px] text-muted-foreground">{story.status}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <p className="shrink-0 border-t border-violet-100 px-3 py-2 text-[11px] leading-4 text-muted-foreground">
        Interview retrieval rule: scan the workflow and metrics, then improvise in your own words.
      </p>
    </div>
  );
}

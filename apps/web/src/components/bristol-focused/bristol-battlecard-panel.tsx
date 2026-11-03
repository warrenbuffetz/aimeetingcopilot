"use client";

import type { BristolBattlecard } from "@/lib/bristol-focused/dataset";

export function BristolBattlecardPanel({ card }: { card: BristolBattlecard }) {
  return (
    <div className="w-full max-w-4xl px-5 py-5 md:px-8">
      <h1 className="text-xl font-semibold tracking-tight">{card.title}</h1>
      <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {card.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2.5"
          >
            <h2 className="text-[11px] font-bold tracking-wide text-amber-900 uppercase">{section.heading}</h2>
            <ul className="mt-1.5 space-y-1 text-[13px] leading-snug">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="text-foreground">
                  {bullet}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

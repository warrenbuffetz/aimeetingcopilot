"use client";

import type { ProductSensePanelLink } from "@/lib/questrade-jaz-interview/product-sense-panel-links";

export function PanelScriptLinks({
  links,
  onOpen,
  title = "Prepared panel answers",
}: {
  links: ProductSensePanelLink[];
  onOpen?: (questionId: string) => void;
  title?: string;
}) {
  if (links.length === 0) return null;
  if (!onOpen) return null;

  return (
    <div className="rounded-md border border-violet-200 bg-violet-50/50 px-2.5 py-2">
      <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">{title}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {links.map((link) => (
          <li key={link.curatedKey}>
            <button
              type="button"
              className="rounded-full border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-950 hover:bg-violet-100"
              onClick={() => onOpen(link.questionId)}
            >
              {link.curatedKey} · {link.shortLabel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

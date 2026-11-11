"use client";

import { useMemo, useState } from "react";
import {
  SPEAK_SECTIONS,
  buildReadAloudScript,
  choiceLabel,
  type SpeakingScriptSlots,
} from "@/lib/questrade-jaz-interview/playbook-speaking-script";
import { cn } from "@/lib/utils";

function SlotText({ children }: { children: string }) {
  return (
    <span className="rounded-sm bg-emerald-50 px-1 py-0.5 font-medium text-emerald-950 ring-1 ring-emerald-200/80">
      {children}
    </span>
  );
}

function Stem({ children }: { children: string }) {
  return <span className="text-neutral-800">{children} </span>;
}

export function SpeakingScriptPanel({
  slots: initialSlots,
  caseId,
}: {
  slots: SpeakingScriptSlots;
  caseId: string;
}) {
  const [includeIntro, setIncludeIntro] = useState(initialSlots.includeThinkingIntro);
  const [startWith, setStartWith] = useState<"A" | "B">(initialSlots.startWith);
  const [showReadAloud, setShowReadAloud] = useState(false);

  const slots = useMemo<SpeakingScriptSlots>(
    () => ({ ...initialSlots, includeThinkingIntro: includeIntro, startWith }),
    [initialSlots, includeIntro, startWith]
  );

  const readAloud = useMemo(() => buildReadAloudScript(slots), [slots]);
  const choice = choiceLabel(slots);

  return (
    <div className="space-y-4" key={caseId}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold tracking-wide text-violet-800 uppercase">
          Fill the speaking script · prefilled for this case
        </p>
        <button
          type="button"
          className="rounded-md bg-emerald-800 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-900"
          onClick={() => setShowReadAloud((o) => !o)}
        >
          {showReadAloud ? "Hide read aloud" : "Read my script →"}
        </button>
      </div>

      {showReadAloud ? (
        <div className="rounded-md border border-emerald-300 bg-emerald-50/60 px-3 py-3">
          <p className="text-[10px] font-semibold tracking-wide text-emerald-900 uppercase">Read aloud</p>
          <div className="mt-2 space-y-3 text-[15px] leading-7 text-neutral-900">
            {readAloud.split("\n\n").map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
      ) : null}

      {SPEAK_SECTIONS.map((section) => (
        <section key={section.id} className="border-t border-violet-100 pt-3 first:border-t-0 first:pt-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <h4 className="text-sm font-semibold text-violet-950">{section.title}</h4>
            {section.optional ? (
              <span className="text-[10px] font-medium text-muted-foreground">Optional</span>
            ) : null}
          </div>
          {section.guidance ? (
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{section.guidance}</p>
          ) : null}

          {section.id === "intro" ? (
            <label className="mt-2 flex items-center gap-2 text-xs text-neutral-800">
              <input
                type="checkbox"
                checked={includeIntro}
                onChange={(e) => setIncludeIntro(e.target.checked)}
                className="rounded border-violet-300"
              />
              Include in Read aloud
            </label>
          ) : null}

          {section.id === "choice" ? (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-medium text-violet-900">Start with</span>
              {(["A", "B"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name={`start-${caseId}`}
                    checked={startWith === opt}
                    onChange={() => setStartWith(opt)}
                  />
                  Option {opt}
                </label>
              ))}
            </div>
          ) : null}

          <div className="mt-2 space-y-2 text-sm leading-relaxed">
            {section.id === "closing" ? (
              <>
                <p>
                  <Stem>So I&apos;d start with</Stem>
                  <SlotText>{choice}</SlotText>
                  <Stem> because </Stem>
                  <SlotText>{slots.choiceWhy}</SlotText>
                  <Stem>. I&apos;d keep going if customers could </Stem>
                  <SlotText>{slots.successIf}</SlotText>
                  <Stem>.</Stem>
                </p>
                <p>
                  <Stem>I&apos;d change direction if</Stem>
                  <SlotText>{slots.changeMindIf}</SlotText>
                  <Stem>.</Stem>
                </p>
              </>
            ) : (
              section.lines.map((line, idx) => {
                if (line.dynamic === "choice") {
                  return (
                    <p key={`${section.id}-${idx}`}>
                      {line.stem ? <Stem>{line.stem}</Stem> : null}
                      <SlotText>{choice}</SlotText>
                    </p>
                  );
                }
                if (!line.slotKey) return null;
                const value = String(slots[line.slotKey] ?? "");
                if (!value) return null;
                return (
                  <p key={`${section.id}-${line.slotKey}`}>
                    {line.stem ? <Stem>{line.stem}</Stem> : null}
                    <SlotText>{value}</SlotText>
                    {line.slotKey === "assumptionDetail" ||
                    line.slotKey === "customerTryingTo" ||
                    line.slotKey === "todayTheyHaveTo" ||
                    line.slotKey === "focusBecause" ||
                    line.slotKey === "optionAHelpsWhen" ||
                    line.slotKey === "choiceWhy" ||
                    line.slotKey === "customerWalkthrough" ||
                    line.slotKey === "tradeoff" ||
                    line.slotKey === "successIf" ||
                    line.slotKey === "earlySign" ||
                    line.slotKey === "concernIf" ||
                    line.slotKey === "verifyCompare" ||
                    line.slotKey === "changeMindIf" ||
                    line.slotKey === "optionA" ||
                    line.slotKey === "optionB" ||
                    line.slotKey === "focusPart" ? (
                      <span className="text-neutral-800">.</span>
                    ) : null}
                  </p>
                );
              })
            )}
          </div>
        </section>
      ))}

      <p className={cn("text-[10px] text-muted-foreground")}>
        Green highlights are this case&apos;s unique answers inside the shared speaking stems. Switch to Components to
        inspect clarify / options / metrics as cards.
      </p>
    </div>
  );
}

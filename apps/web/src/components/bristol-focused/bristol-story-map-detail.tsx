"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { measurementCopyText, type BristolStoryMap } from "@/lib/bristol-focused/story-maps";
import {
  bristolRoleStacks,
  jazRoleStacks,
  STACK_CATEGORIES,
  stackVerificationLabel,
  toolsByCategoryForStory,
  type JazRoleStack,
  type StackVerification,
} from "@/lib/bristol-focused/tech-stack";
import { cn } from "@/lib/utils";

type Props = {
  story: BristolStoryMap;
  prep: boolean;
  backLabel?: string | null;
  onBack?: () => void;
};

function illustrativeEvidence(story: BristolStoryMap): boolean {
  return story.id === "hbc-app" || /illustrative/i.test(story.evidence);
}

function statusTone(status: string): string {
  if (/delayed|not launch/i.test(status)) return "bg-amber-100 text-amber-950 ring-1 ring-amber-200";
  if (/launch/i.test(status)) return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200";
  return "bg-slate-100 text-slate-800 ring-1 ring-slate-200";
}

function verificationBadgeClass(v: StackVerification): string {
  switch (v) {
    case "firsthand":
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80";
    case "organization_context":
      return "bg-sky-100 text-sky-900 ring-1 ring-sky-200/80";
    default:
      return "bg-amber-50 text-amber-950 ring-1 ring-amber-200/80";
  }
}

const CATEGORY_SURFACE: Record<string, string> = {
  "Product analytics / funnels": "border-l-sky-500 bg-sky-50/90",
  "Experimentation / testing": "border-l-violet-500 bg-violet-50/80",
  "Reporting and source of truth": "border-l-indigo-500 bg-indigo-50/80",
  "Product and technical platforms": "border-l-teal-600 bg-teal-50/80",
};

function MapSection({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "slate" | "amber" | "violet" | "sky" | "ink";
  children: ReactNode;
}) {
  const toneClasses = {
    slate: "border-l-slate-500 bg-slate-50/90 [&>summary]:text-slate-900 [&>summary:hover]:bg-slate-100/80",
    amber: "border-l-amber-500 bg-amber-50/40 [&>summary]:text-amber-950 [&>summary:hover]:bg-amber-100/60",
    violet: "border-l-violet-600 bg-violet-50/50 [&>summary]:text-violet-950 [&>summary:hover]:bg-violet-100/70",
    sky: "border-l-sky-500 bg-sky-50/60 [&>summary]:text-sky-950 [&>summary:hover]:bg-sky-100/70",
    ink: "border-l-[#221b3a] bg-[#221b3a] text-white [&>summary]:text-white [&>summary:hover]:bg-[#2d2450]",
  }[tone];

  return (
    <details
      className={cn(
        "group mt-2 overflow-hidden rounded-lg border border-black/5 border-l-4 shadow-sm",
        toneClasses
      )}
    >
      <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider opacity-60 group-open:rotate-90 transition-transform">▸</span>
          {title}
        </span>
      </summary>
      <div className={cn("border-t border-black/5 px-3 py-3", tone === "ink" ? "text-violet-50" : "text-neutral-800")}>
        {children}
      </div>
    </details>
  );
}

export function BristolStoryMapDetail({ story, prep, backLabel, onBack }: Props) {
  const [copied, setCopied] = useState(false);
  const toolsByCategory = toolsByCategoryForStory(story.id);

  async function copyMeasurement() {
    try {
      await navigator.clipboard.writeText(measurementCopyText(story));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const journeySteps = story.journey.slice(0, 5);

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-[#f0edf8] text-neutral-950">
      <div className="w-full max-w-4xl px-4 py-4 md:px-6 md:py-5">
        {backLabel && onBack && (
          <Button type="button" variant="outline" size="sm" className="mb-3 h-8 gap-1.5 border-violet-200 bg-white" onClick={onBack}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {backLabel}
          </Button>
        )}

        <p className="text-xs font-semibold tracking-wide text-violet-700 uppercase">{story.company}</p>
        <div className="mt-1 flex flex-wrap items-start gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-balance text-neutral-950 md:text-2xl">{story.title}</h1>
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", statusTone(story.status))}>{story.status}</span>
        </div>
        <p className="mt-2 text-sm font-medium text-violet-900/70">{story.domain}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-rose-100 bg-rose-50/80 p-3 ring-1 ring-rose-100/80">
            <p className="text-[10px] font-bold tracking-wide text-rose-800 uppercase">Customer + problem</p>
            <p className="mt-1 text-sm leading-6 text-neutral-900">{story.user}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-800">{story.problem}</p>
          </div>
          <div className="rounded-lg border border-teal-100 bg-teal-50/70 p-3 ring-1 ring-teal-100/80">
            <p className="text-[10px] font-bold tracking-wide text-teal-900 uppercase">Chosen intervention</p>
            <p className="mt-1 text-sm leading-6 text-neutral-900">{story.decision}</p>
          </div>
        </div>

        <section className="mt-4 rounded-xl border border-violet-100 bg-white/70 p-3 shadow-sm" aria-label="Workflow">
          <p className="mb-2 text-[11px] font-bold tracking-wide text-violet-800 uppercase">End-to-end workflow</p>
          <ol className="flex flex-wrap gap-2">
            {journeySteps.map(([label, detail], index) => (
              <li
                key={`${label}-${index}`}
                className="min-w-[9rem] max-w-full flex-1 rounded-lg border border-violet-200/80 bg-gradient-to-b from-violet-50 to-white px-3 py-2"
              >
                <p className="text-[10px] font-bold text-violet-900">
                  <span className="mr-1 text-violet-500">{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </p>
                <p className="mt-1 text-xs leading-5 text-neutral-700">{detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-3" aria-label="Metrics">
          <div className="rounded-lg border border-violet-300 bg-violet-100/90 p-3 shadow-sm">
            <p className="text-[10px] font-bold tracking-wide text-violet-900 uppercase">Proposed North Star</p>
            <p className="mt-1 text-sm leading-6 font-semibold text-violet-950">{story.north}</p>
            <p className="mt-2 text-xs leading-5 text-violet-900/85">{story.northWhy}</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50/90 p-3">
            <p className="text-[10px] font-bold tracking-wide text-sky-900 uppercase">Leading / diagnostic</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-neutral-800">
              {story.leading.slice(0, 5).map((item) => (
                <li key={item} className="flex gap-1.5">
                  <span className="text-sky-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50/80 p-3">
            <p className="text-[10px] font-bold tracking-wide text-orange-900 uppercase">Guardrails</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-neutral-800">
              {story.guardrails.slice(0, 5).map((item) => (
                <li key={item} className="flex gap-1.5">
                  <span className="text-orange-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {story.observed.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {story.observed.map((item) => (
              <span
                key={item}
                className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-950 ring-1 ring-emerald-200"
              >
                Observed: {item}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 border-violet-200 bg-white text-violet-950 hover:bg-violet-50"
            onClick={() => void copyMeasurement()}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy how we measured this"}
          </Button>
        </div>

        <MapSection title="Decision, evidence and alternatives" tone="slate">
          <div className="space-y-3 text-sm leading-6 text-neutral-800">
            <p className="text-neutral-900">{story.hook}</p>
            <p className="rounded-md border border-slate-200 bg-white/80 px-2.5 py-2">
              <span className="font-semibold text-slate-900">Evidence: </span>
              {story.evidence}
              {illustrativeEvidence(story) && (
                <span className="mt-2 block rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-900">
                  Illustrative discovery — say it is hypothetical unless you verified it.
                </span>
              )}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Alternative considered: </span>
              {story.alternative}
            </p>
          </div>
        </MapSection>

        <MapSection title="Ownership, systems and accuracy" tone="amber">
          <div className="space-y-3 text-sm leading-6 text-neutral-900">
            <p>{story.ownership}</p>
            <p className="rounded-md border border-amber-300 bg-amber-100/80 px-3 py-2 font-medium text-amber-950">{story.watchout}</p>
          </div>
        </MapSection>

        <MapSection title={`Tools & systems (this role)`} tone="violet">
          <dl className="space-y-4">
            {STACK_CATEGORIES.map((category) => {
              const tools = toolsByCategory.get(category) ?? [];
              if (!tools.length) return null;
              return (
                <div
                  key={category}
                  className={cn("rounded-md border-l-4 px-2.5 py-2", CATEGORY_SURFACE[category] ?? "border-l-gray-400 bg-white")}
                >
                  <dt className="text-[10px] font-bold tracking-wide text-neutral-800 uppercase">{category}</dt>
                  <dd className="mt-2 space-y-2">
                    {tools.map((tool) => (
                      <div key={tool.name} className="rounded-md border border-white/60 bg-white/70 px-2.5 py-2 shadow-sm">
                        <p className="text-sm font-semibold text-neutral-900">
                          {tool.name}
                          <span
                            className={cn(
                              "ml-2 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                              verificationBadgeClass(tool.verification)
                            )}
                          >
                            {stackVerificationLabel(tool.verification)}
                          </span>
                        </p>
                        <p className="mt-1 text-xs leading-5 text-neutral-700">{tool.application}</p>
                      </div>
                    ))}
                  </dd>
                </div>
              );
            })}
          </dl>
        </MapSection>

        <MapSection title={`Likely interviewer pivots (${story.questions.length})`} tone="sky">
          <ul className="flex flex-wrap gap-2">
            {story.questions.map((question) => (
              <li
                key={question}
                className="rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-medium text-sky-950 shadow-sm"
              >
                {question}
              </li>
            ))}
          </ul>
        </MapSection>

        <MapSection title="30-second mental answer" tone="ink">
          <p className="text-[15px] leading-7 text-violet-50">{story.answer}</p>
        </MapSection>

        {prep && (
          <details className="mt-2 overflow-hidden rounded-lg border border-dashed border-violet-300 bg-violet-50/80 px-3 py-2 shadow-sm">
            <summary className="cursor-pointer list-none py-1 text-sm font-semibold text-violet-950 marker:content-none [&::-webkit-details-marker]:hidden">
              Prep: tools across roles (comparison)
            </summary>
            <div className="mt-3 overflow-x-auto rounded-md border border-violet-100 bg-white p-2">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-violet-100 bg-violet-50">
                    <th className="py-1.5 pr-2 font-semibold text-violet-950">Role</th>
                    {STACK_CATEGORIES.map((category) => (
                      <th key={category} className="py-1.5 pr-2 font-semibold text-violet-950">
                        {category}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(bristolRoleStacks ?? jazRoleStacks).map((role: JazRoleStack) => (
                    <tr key={role.id} className="border-b border-violet-50 align-top even:bg-violet-50/40">
                      <td className="py-2 pr-2 font-medium text-neutral-900">{role.company}</td>
                      {STACK_CATEGORIES.map((category) => {
                        const names = role.tools.filter((t) => t.category === category).map((t) => t.name);
                        return (
                          <td key={category} className="py-2 pr-2 text-neutral-700">
                            {names.length ? names.join("; ") : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

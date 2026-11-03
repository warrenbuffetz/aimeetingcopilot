"use client";

import type { BristolQuestion } from "@/lib/bristol-focused/dataset";

function AnswerParagraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-4 text-[15px] leading-7">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wide text-amber-900 uppercase">{title}</h3>
      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function BristolScenarioPanel({ question }: { question: BristolQuestion }) {
  const s = question.scenario;
  if (!s) return null;
  const povLine = s.quickDecision ?? s.initialPovPrompt ?? "Lead with a clear recommendation.";

  return (
    <div className="mt-4 space-y-4">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
        Live scenario — preparation hypothesis, not a confirmed Bristol question. Illustrative data is labeled.
      </p>
      <div>
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Original question</h3>
        <p className="mt-1 text-[15px] leading-7">{s.originalQuestion}</p>
      </div>
      {s.illustrativeData && (
        <p className="text-sm leading-6 text-muted-foreground">{s.illustrativeData}</p>
      )}
      <div className="rounded-md border border-amber-200 bg-white px-3 py-2">
        <h3 className="text-xs font-semibold text-amber-900">~10s initial POV</h3>
        <p className="mt-1 text-sm leading-6">{povLine}</p>
      </div>
      <div>
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">~45–75s structured response</h3>
        <div className="mt-2">
          <AnswerParagraphs text={question.answer} />
        </div>
        {s.structuredGuide && (
          <p className="mt-2 text-xs text-muted-foreground">Framework: {s.structuredGuide}</p>
        )}
      </div>
      <div className="rounded-md border border-red-200 bg-red-50/80 px-3 py-2">
        <h3 className="text-xs font-semibold text-red-900">Unexpected twist (after your first response)</h3>
        <p className="mt-1 text-sm leading-6 text-red-950">{s.unexpectedTwist}</p>
      </div>
      {s.responseToTwist && (
        <details className="rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2">
          <summary className="cursor-pointer text-xs font-semibold text-amber-950">
            Suggested twist response (practice — not a live script)
          </summary>
          <p className="mt-2 text-sm leading-6 text-amber-950">{s.responseToTwist}</p>
        </details>
      )}
      <ListBlock title="Follow-up probes" items={s.followUpProbes} />
      <ListBlock title="What is being assessed" items={s.assessedSkills} />
      <ListBlock title="Answer framework (guide, not script)" items={s.answerFramework} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">Primary metric</h3>
          <p className="mt-1 text-sm">{s.primaryMetric}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground">Guardrails</h3>
          <ul className="mt-1 list-disc pl-4 text-sm">
            {(s.guardrailMetrics ?? []).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
      <ListBlock title="Common mistakes" items={s.commonMistakes} />
    </div>
  );
}

export function BristolIndustryReferencePanel({ question }: { question: BristolQuestion }) {
  const ref = question.industryReference;
  if (!ref) return null;
  return (
    <div className="mt-4 space-y-4 text-sm leading-6">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">{ref.disclaimer}</p>
      {ref.painPoints.map((p) => (
        <section key={p.id} className="rounded-lg border border-border px-3 py-2">
          <h3 className="font-semibold">
            {p.id}. {p.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">Segments: {p.segments.join(", ")}</p>
          <p className="mt-2">{p.evidence}</p>
          <p className="mt-2 text-muted-foreground">{p.commercialConsequence}</p>
          <p className="mt-2">
            <span className="font-medium">OpenTable today:</span> {p.opentableCapabilities}
          </p>
          <p className="mt-2">
            <span className="font-medium">Underserved:</span> {p.underserved}
          </p>
          <p className="mt-2 text-xs">Metrics: {p.metrics.join("; ")}</p>
          <p className="mt-2 text-xs text-muted-foreground">{p.tradeoffs}</p>
        </section>
      ))}
      <div>
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">Proposed priority ranking</h3>
        <ol className="mt-2 list-decimal pl-5">
          {ref.proposedPriorityRanking.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </div>
      {ref.sourcesToVerify?.length ? (
        <p className="text-xs text-muted-foreground">Verify: {ref.sourcesToVerify.join("; ")}</p>
      ) : null}
      <div>
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">Your spoken summary</h3>
        <div className="mt-2">
          <AnswerParagraphs text={question.answer} />
        </div>
      </div>
    </div>
  );
}

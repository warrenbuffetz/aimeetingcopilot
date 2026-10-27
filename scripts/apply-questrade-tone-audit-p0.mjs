#!/usr/bin/env node
/**
 * Pass 1: Questrade tone audit P0 fixes (13 rows).
 *
 *   node scripts/apply-questrade-tone-audit-p0.mjs --dry-run
 *   node scripts/apply-questrade-tone-audit-p0.mjs --apply
 *   node scripts/apply-questrade-tone-audit-p0.mjs --apply --embed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const apply = process.argv.includes("--apply");
const dryRun = !apply || process.argv.includes("--dry-run");
const runEmbed = process.argv.includes("--embed");

const BUILD_BUY_CLEAN =
  "I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept.";

const DAU_CLEAN =
  "I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective.";

const WHY_NOT_DONE_CLEAN =
  "That's a fair challenge, and I wouldn't assume the team has overlooked something. There could be a technical dependency, regulatory constraint, cost issue or research that points in another direction. I'd want to understand the history before advocating for the idea. In a case interview, I'm making a hypothesis from limited information, not claiming I know the internal roadmap better than the team. What I can demonstrate is how I'd frame the opportunity, what evidence I'd gather, and what trade-offs would cause me to change my recommendation. Being willing to update the plan when new information comes in is part of the job.";

const DB88_ANSWER =
  "I had a library of prepared interview answers, but the same question can be asked in dozens of ways. Searching by exact words wasn't good enough.\n\nSo I explored a small embedding model through Supabase. It turns each question into a numerical representation of its meaning, then retrieves prepared answers whose questions have similar meanings. I combine that with the conversation topic, because 'How did you measure that?' could mean RBC, HBC or Arc'teryx depending on what we were just discussing.\n\nI deliberately chose retrieval over generating a new answer each time. It keeps the response tied to material I've reviewed and lets me manage cost and reliability.";

const DB88_SPOKEN =
  "The basic problem was that I had a library of prepared answers, but interviewers can ask the same question in very different ways. Keyword search was too brittle. So I used a lightweight embedding approach through Supabase to search for similar meaning, then added the current conversation topic as a second signal. For example, 'How did you measure that?' needs a different answer depending on whether we've been discussing RBC payments or Arc'teryx membership. I deliberately retrieve a reviewed answer rather than have AI write something new on the fly. That gives me more control over accuracy, cost and what the product actually shows.";

const C8D4_ANSWER =
  "When I was improving the copilot matcher, I built a fixed set of realistic interview prompts — paraphrases, short follow-ups, employer switches and deliberately off-topic questions — and compared keyword matching against the embedding-assisted approach.\n\nFor each case I noted which prepared answer should surface. I cared most about top-one accuracy, whether the right answer appeared in the top three, latency and wrong-context matches. I also checked whether manually reanalyzing a missed transcript could recover the right answer.\n\nI wouldn't quote a formal percentage lift without a rigorous benchmark, but the hybrid approach clearly beat keywords on the cases that mattered in practice. If context logic didn't help, I'd tune it or simplify rather than assume embeddings are automatically better.";

const AI_ANSWER =
  "I use AI regularly, but I separate what I actually use today from what I'm exploring and what would stay hypothetical in a regulated bank.\n\nToday I use ChatGPT and Claude for structuring research, drafting interview guides and stress-testing product assumptions. I use Cursor for prototyping — including Bench, where I've experimented with computer vision for rep counting and human video verification. Those help me go from hypothesis to something testable faster than static mocks alone.\n\nI'm also exploring summarizing customer feedback themes, generating experiment variants to review, and AI-assisted code search for unfamiliar payment or core-banking integrations — always with human review before anything customer-facing.\n\nI would not claim as deployed automated Slack bots, unsupervised customer messaging, or agent actions on money movement without explicit consent, least-privilege scopes, read-only defaults, draft-vs-execute separation and human approval. At Questrade-scale banking, I'd treat AI outputs as inputs to judgment, not authoritative financial facts.\n\nI don't see AI replacing product ownership. It shortens the loop between a question and an evidence-backed answer — with validation, especially for data, compliance and customer impact.";

const AI_SPOKEN =
  "I use AI mainly to shorten the time from an idea to something I can test. For research, I use tools like ChatGPT and Claude to organize information, challenge assumptions and draft starting points that I review myself. I've also been using Cursor to build working prototypes, including Bench, where I've been experimenting with computer vision and video-based rep verification. More recently I've explored semantic search for my interview copilot, where the challenge is finding the right prepared answer even when someone phrases a question differently. What's been useful is being able to test an interaction rather than spend a week describing it in slides. I still validate the outputs and keep the product decisions with me, especially when the data or customer impact is sensitive.";

const TEMENOS_SPOKEN =
  "I'd keep Temenos as the source of truth for financial records and build a clear product layer on top of it. The customer shouldn't need to understand the core bank to see an accurate balance or track a transfer. I'd work with engineering to define stable interfaces for accounts, balances, transaction states and payment initiation, with clear ownership of each. The main risk is accidentally creating a second ledger in the product layer or showing a status that doesn't match the financial reality. So before launching new journeys, I'd want a shared definition of pending, posted and available, plus traceable identifiers, reconciliation and a plan for failures. I'd keep the first integration contracts focused on capabilities we'd actually reuse. That's a familiar product challenge from payments and membership integrations: you want flexibility at the customer layer without obscuring who owns the underlying truth.";

const AERO_SPOKEN =
  "The reported 40% improvement was in the co-brand card acquisition funnel. I'd be precise about what that conversion event meant, because clicking through to an issuer, starting an application and completing one are different things. We worked on the digital experience that helped members understand the offer and move toward applying, and I would separate that funnel result from the much broader 427% year-over-year acquisition growth. That growth involved more than one product change. If we were discussing attribution, I'd go back to the original conversion definition, audience and comparison period rather than imply that the full acquisition gain came from a single test.";

const HBC_MEAS_SPOKEN =
  "The reported improvement was a 15% relative lift in application completions. The customer problem was people starting the HBC Mastercard application and dropping out before submission. So I separate a completed application from an approval, which Neo owned, and from someone actually using the card afterward. I'd also distinguish an observed improvement from proof that one change caused all of it. That depends on how the original comparison was set up and whether the audience and offer mix were comparable. The completion lift is the result we reported; approvals and ongoing card use are different downstream outcomes.";

const INVESTORS_SPOKEN =
  "I'd start with existing Questrade investors who already move money regularly between their bank and investment accounts. They have an established relationship with Questrade and a practical reason to try everyday banking. The first question is what's stopping them: is it the value proposition, the hassle of moving payroll and bills, or trust in a newer account? I'd validate that with behaviour data and customer conversations. My first product bet would be a guided switching journey that makes the steps and their status clear, rather than paying everyone a large sign-up bonus. I'd test it with one segment, then measure first payroll deposits, repeated deposits and ongoing transaction activity—not just accounts opened. I'd also watch payment failures and support contacts. If customers fund the account once and then move back to their old bank, we haven't solved the primary-banking problem. The goal would be to give them a useful reason to start and enough confidence to stay.";

const AF5_ANSWER =
  "For the lifecycle incentive work, the comparison was set up as a holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.\n\nWe kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout. I'd confirm the exact cohort design and those figures against the original analysis before treating them as interview-ready facts.\n\nFor the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.\n\nI'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.";

const AF5_SPOKEN =
  "For the lifecycle incentive work, we used a holdout within an eligible cardholder population to compare targeted incentives against customers who didn't receive the new treatment in the same period. We tracked active-cardholder rates, spend and incentive cost over a defined window. I'd verify the exact design and the reported four-point and five-percent lifts against the original analysis before stating them under skeptical questioning. I'd also keep the 500,000-plus portfolio figure separate from the test audience, and treat the 10% LTV figure as a modeled forecast—not realized profit. The Neo application work was a different intervention with different metrics.";

const C88_SPOKEN =
  "At Aeroplan I proposed testing a clearer co-brand offer summary instead of simply pushing Apply higher on the page. The trade-off was fewer clicks versus better-qualified applicants. In the focused test, offer-page click-through fell slightly while bank-side application starts per visitor rose from 10% to 14%—a 40% relative lift—with steady completion among starters. That convinced me we were improving real funnel progression, not just clicks. I keep that experiment separate from the broader 427% year-over-year acquisition growth, which had multiple contributors.";

const PATCHES = {
  "93f1f35c-cd54-49c3-8d6d-6a95d262fd4b": {
    metaOnly: true,
    metaPatch: (m) => ({
      ...m,
      reviewNotes:
        "Tone audit P0: canonical base $185–205K. Superseded duplicate total-comp row fbb01b9e (inactive) used $175–195K base / $205–230K total — do not cite in interviews.",
      toneAuditP0: "comp_consistency_documented",
    }),
  },
  "009d20a6-a8cf-458a-a7ea-9ef696c693e0": {
    answer: BUILD_BUY_CLEAN,
    syncSpokenFromAnswer: true,
    syncFollowUpsFromAnswer: true,
    reembed: true,
  },
  "f7e403b2-26b8-4da4-83c1-ea58c2e3371b": {
    answer: DAU_CLEAN,
    syncSpokenFromAnswer: true,
    syncFollowUpsFromAnswer: true,
    reembed: true,
  },
  "8150bb81-67d5-48dc-82e0-b8bf223984f0": {
    answer: WHY_NOT_DONE_CLEAN,
    syncSpokenFromAnswer: true,
    syncFollowUpsFromAnswer: true,
    reembed: true,
  },
  "db88df8e-3a36-4cc6-8b84-4fb24e2136c3": {
    answer: DB88_ANSWER,
    spokenAnswer: DB88_SPOKEN,
    syncFollowUpsFromAnswer: true,
    reembed: true,
  },
  "c8d4a611-d174-48b1-911c-e2db8f3acc3e": {
    answer: C8D4_ANSWER,
    reembed: true,
  },
  "7c079cf5-b153-435d-a4b3-e83ad3139a2b": {
    answer: AI_ANSWER,
    spokenAnswer: AI_SPOKEN,
    reembed: true,
  },
  "a8fe6bd5-ecc2-4c0f-95d5-63bb51f0c20c": {
    spokenAnswer: TEMENOS_SPOKEN,
    metaPatch: (m) => ({ ...m, toneAuditP0: "spoken_variant_added" }),
  },
  "6844c2e7-03c5-434e-b64c-ca9febec68dd": {
    spokenAnswer: INVESTORS_SPOKEN,
    metaPatch: (m) => ({ ...m, toneAuditP0: "spoken_variant_added" }),
  },
  "0e33272e-0d91-49a8-8d6d-e74881372454": {
    spokenAnswer: AERO_SPOKEN,
    metaPatch: (m) => ({
      ...m,
      shortAnswer: shortFrom(AERO_SPOKEN, 320),
      toneAuditP0: "spoken_polish",
    }),
  },
  "722da43e-9883-44ce-800c-97a0aafbc694": {
    spokenAnswer: HBC_MEAS_SPOKEN,
    metaPatch: (m) => ({
      ...m,
      shortAnswer: shortFrom(HBC_MEAS_SPOKEN, 320),
      toneAuditP0: "spoken_polish",
    }),
  },
  "af5bd3a4-1b6f-4f1c-a319-15475be31b5d": {
    answer: AF5_ANSWER,
    spokenAnswer: AF5_SPOKEN,
    evidenceStatus: "unverified_detail",
    metaPatch: (m) => ({
      ...m,
      evidenceStatus: "unverified_detail",
      reviewStatus: "needs_review",
      reviewNotes:
        "Tone audit P0: reconcile holdout design and reported 4pp / 5% lifts with original HBC lifecycle analysis before autobiographical certainty.",
      toneAuditP0: "factual_soften",
    }),
    reembed: true,
  },
  "c88f487e-e0d1-44c0-ab54-60f1e19fe79d": {
    spokenAnswer: C88_SPOKEN,
    metaPatch: (m) => ({
      ...m,
      reviewStatus: "needs_review",
      reviewNotes:
        "Tone audit P0: verify 10%→14% test design, audience and event definitions against original Aeroplan reporting before high-stakes interviews.",
      toneAuditP0: "factual_review_queue",
    }),
  },
};

function shortFrom(text, max = 320) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function loadEnv() {
  const path = resolve(root, "apps/web/.env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function syncSeedAnswer(question, answer) {
  const seedPath = resolve(root, "data/seed/questrade-interview-full.json");
  if (!existsSync(seedPath)) return false;
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  const row = seed.preparedQa?.find((r) => r.question?.trim() === question?.trim());
  if (!row) return false;
  row.answer = answer;
  writeFileSync(seedPath, JSON.stringify(seed, null, 2));
  return true;
}

function syncMetaByQuestion(question, patch) {
  const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
  if (!existsSync(metaPath)) return;
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  const key = question.trim();
  meta[key] = { ...(meta[key] ?? {}), ...patch };
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));
}

async function fetchRow(id) {
  const { data, error } = await admin.from("prepared_qa").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

async function main() {
  const report = {
    at: new Date().toISOString(),
    mode: dryRun ? "dry-run" : "apply",
    actions: [],
    embedIds: [],
    missing: [],
  };

  for (const [id, patch] of Object.entries(PATCHES)) {
    const row = await fetchRow(id);
    if (!row) {
      report.missing.push(id);
      continue;
    }

    const meta = { ...(row.navigator_meta ?? {}) };
    if (patch.spokenAnswer) {
      meta.spokenAnswer = patch.spokenAnswer;
      if (!patch.metaPatch) meta.shortAnswer = shortFrom(patch.spokenAnswer, 320);
    } else if (patch.syncSpokenFromAnswer && patch.answer) {
      meta.spokenAnswer = patch.answer;
      meta.shortAnswer = shortFrom(patch.answer, 320);
    }
    if (patch.evidenceStatus) meta.evidenceStatus = patch.evidenceStatus;
    if (patch.metaPatch) Object.assign(meta, patch.metaPatch(meta));

    const update = { navigator_meta: meta, updated_at: new Date().toISOString() };
    if (patch.answer) update.answer = patch.answer;

    if (patch.syncFollowUpsFromAnswer && patch.answer) {
      const fus = Array.isArray(row.follow_ups) ? row.follow_ups : [];
      if (fus.length) {
        update.follow_ups = fus.map((fu) => ({ ...fu, answer: patch.answer }));
      }
    }

    report.actions.push({
      id,
      question: row.question,
      fields: Object.keys(update).filter((k) => k !== "updated_at"),
      reembed: Boolean(patch.reembed),
    });
    if (patch.reembed) report.embedIds.push(id);

    if (!dryRun) {
      const { error } = await admin.from("prepared_qa").update(update).eq("id", id);
      if (error) throw error;
      if (patch.answer) syncSeedAnswer(row.question, patch.answer);
      syncMetaByQuestion(row.question, meta);
    }
  }

  const outDir = resolve(root, "data/review");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "questrade-tone-audit-p0-apply-report.json"), JSON.stringify(report, null, 2));

  if (runEmbed && !dryRun && report.embedIds.length) {
    const unique = [...new Set(report.embedIds)];
    await new Promise((resolvePromise, reject) => {
      const child = spawn("node", [resolve(root, "scripts/embed-qa-gte.mjs")], {
        env: { ...process.env, EMBED_QA_IDS: unique.join(",") },
        stdio: "inherit",
      });
      child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`embed exited ${code}`))));
    });
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

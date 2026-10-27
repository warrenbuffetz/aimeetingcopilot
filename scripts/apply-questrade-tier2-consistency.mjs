#!/usr/bin/env node
/**
 * Apply approved Tier 2 Questrade consistency decisions (measurement archive, Arc'teryx body, talking points).
 *
 *   node scripts/apply-questrade-tier2-consistency.mjs --dry-run
 *   node scripts/apply-questrade-tier2-consistency.mjs --apply
 *   node scripts/apply-questrade-tier2-consistency.mjs --apply --embed
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

const IDS = {
  AERO_PRIMARY: "0e33272e-0d91-49a8-8d6d-e74881372454",
  AERO_ARCHIVE: "8f93a4d4-6570-4ae8-8e29-ff5f1c6218b4",
  HBC_PRIMARY: "722da43e-9883-44ce-800c-97a0aafbc694",
  HBC_ARCHIVE: "3218b561-2159-442e-a3aa-074756f877c0",
  ARC_LIVE_PLANNED: "1c3f6b10-2b62-4807-bffd-ef21beef30d7",
  MISTAKE_Q3: "c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f",
  HBC_ATTRIBUTION_FU: "2af89a04-ab52-40bd-928d-96a3122fffd1",
  DIDNT_GO: "15aa03e2-46af-4d60-9d73-90ed342c6ccc",
  WEAKNESS: "39a0bcf9-7d01-4cde-8da4-4ff893da44b3",
  SPERRO_CURRENT: "1fd9478b-7396-4778-bc00-e62aee52de52",
};

const ARC_LIVE_ANSWER = `I'd separate the Sperro SV launch from the broader membership platform, because they're related initiatives but not the same release.

For Sperro SV, we supported the September launch with a smaller set of customer benefits, including three years of unlimited out-of-warranty repairs, exclusive community experiences and the opportunity to win a Global Academy experience.

That allowed us to deliver something meaningful without waiting for the full membership infrastructure.

The broader membership initiative is a much larger build. We've secured about $5.2 million in approved funding, defined the MVP and worked through the platform architecture and integrations.

So I wouldn't present that full membership experience as already launched, or claim adoption and commercial outcomes we haven't measured.

The distinction is that Sperro SV gave us a focused benefits release, while the broader membership program remains a separate platform initiative.`;

const AERO_SUPPLEMENTAL = [
  {
    label: "Relative vs percentage points",
    content:
      "The reported 40% improvement is a relative lift in funnel conversion, not a 40-percentage-point increase. I would anchor any deeper answer to the original reporting definition for the numerator and denominator.",
    importKey: "tier2-aeroplan-relative-lift",
  },
  {
    label: "Measurement boundaries",
    content:
      "Offer engagement, application starts, submissions, issuer approvals and activations are different events. I would not equate a funnel conversion improvement with approved or activated cardholders without the downstream data.",
    importKey: "tier2-aeroplan-funnel-boundaries",
  },
  {
    label: "Separate from 427% growth",
    content:
      "The 427% year-over-year acquisition growth had multiple contributors. I would explain the product funnel result on its own terms rather than implying it fully explains the broader growth number.",
    importKey: "tier2-aeroplan-427-separate",
  },
  {
    label: "No unverified experiment precision",
    content:
      "I would not present illustrative sample sizes, test windows or cohort splits as verified history unless I can confirm them from the original analysis.",
    importKey: "tier2-aeroplan-no-illustrative-experiment",
  },
];

const HBC_SUPPLEMENTAL = [
  {
    label: "Relative vs percentage points",
    content:
      "The 15% improvement in application completions is a relative lift, not a 15-percentage-point increase. Percentage points are the direct difference between two rates.",
    importKey: "tier2-hbc-relative-lift",
  },
  {
    label: "Submission vs approval",
    content:
      "Application submission is different from Neo underwriting approval and from first card activation. I would keep those outcomes separate when discussing commercial impact.",
    importKey: "tier2-hbc-submission-vs-approval",
  },
  {
    label: "Attribution caution",
    content:
      "A before-and-after funnel comparison and a randomized test support different strength of claims. I would match the claim to the design we can actually defend.",
    importKey: "tier2-hbc-attribution",
  },
  {
    label: "No illustrative cohort numbers",
    content:
      "I would not state specific arm sizes, assignment mechanics or completion windows as historical facts unless confirmed in the original reporting.",
    importKey: "tier2-hbc-no-illustrative-cohort",
  },
];

const DIDNT_GO_SUPPLEMENTAL = [
  {
    label: "Sperro SV scope trade-off",
    content:
      "For Sperro SV we carved out a smaller benefits release to support a fixed September launch rather than forcing the full membership platform. That protected the customer promise while reducing technology and operational dependencies.",
    importKey: "tier2-didnt-go-sperro-scope",
  },
];

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

function mergeAlt(existing, add) {
  const set = new Set(existing ?? []);
  for (const a of add) if (a?.trim()) set.add(a.trim());
  return [...set];
}

function shortFromAnswer(text, max = 320) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function syncMetaByQuestion(question, patch) {
  const metaPath = resolve(root, "data/migration/navigator-meta-by-question.json");
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

async function updateRow(id, patch) {
  if (dryRun) return;
  const { error } = await admin
    .from("prepared_qa")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

async function archiveRow(id, supersededById, reason) {
  const row = await fetchRow(id);
  if (!row) return { id, skipped: "not_found" };
  const meta = {
    ...(row.navigator_meta ?? {}),
    revisionStatus: "superseded",
    retrievalExcluded: true,
    inactiveReason: reason,
    supersededByPreparedQaId: supersededById,
    archivedAt: new Date().toISOString(),
    tier2ConsistencyArchive: true,
  };
  await updateRow(id, { navigator_meta: meta });
  if (!dryRun) {
    await admin.from("prepared_qa_embeddings").delete().eq("prepared_qa_id", id);
  }
  return { id, question: row.question, supersededById };
}

async function main() {
  const report = {
    at: new Date().toISOString(),
    apply: apply && !dryRun,
    actions: [],
    embedIds: [],
  };

  const aeroPrimary = await fetchRow(IDS.AERO_PRIMARY);
  const aeroArchive = await fetchRow(IDS.AERO_ARCHIVE);
  if (aeroPrimary && aeroArchive) {
    const meta = {
      ...(aeroPrimary.navigator_meta ?? {}),
      supplementalTalkingPoints: AERO_SUPPLEMENTAL,
      reviewStatus: "needs_review",
      reviewNotes:
        "Tier 2: cautious primary retained. Exact funnel numerator/denominator still require verification. Illustrative 8k experiment archived.",
      altPhrasings: mergeAlt(aeroPrimary.navigator_meta?.altPhrasings, [
        aeroArchive.question,
        "How exactly did you measure Aeroplan's 40% conversion improvement?",
      ]),
    };
    await updateRow(IDS.AERO_PRIMARY, {
      navigator_meta: meta,
      is_preferred: true,
      is_authoritative: true,
    });
    syncMetaByQuestion(aeroPrimary.question, meta);
    report.actions.push({ type: "primary_patch", id: IDS.AERO_PRIMARY });
    report.actions.push(await archiveRow(IDS.AERO_ARCHIVE, IDS.AERO_PRIMARY, "illustrative_measurement_archived"));
  }

  const hbcPrimary = await fetchRow(IDS.HBC_PRIMARY);
  const hbcArchive = await fetchRow(IDS.HBC_ARCHIVE);
  if (hbcPrimary && hbcArchive) {
    const meta = {
      ...(hbcPrimary.navigator_meta ?? {}),
      supplementalTalkingPoints: HBC_SUPPLEMENTAL,
      reviewStatus: "needs_review",
      altPhrasings: mergeAlt(hbcPrimary.navigator_meta?.altPhrasings, [hbcArchive.question]),
    };
    await updateRow(IDS.HBC_PRIMARY, {
      navigator_meta: meta,
      is_preferred: true,
      is_authoritative: true,
    });
    syncMetaByQuestion(hbcPrimary.question, meta);
    report.actions.push({ type: "primary_patch", id: IDS.HBC_PRIMARY });
    report.actions.push(await archiveRow(IDS.HBC_ARCHIVE, IDS.HBC_PRIMARY, "illustrative_measurement_archived"));

    const hbcFu = await fetchRow(IDS.HBC_ATTRIBUTION_FU);
    if (hbcFu) {
      const fuMeta = {
        ...(hbcFu.navigator_meta ?? {}),
        topicTags: (hbcFu.navigator_meta?.topicTags ?? []).map((t) =>
          typeof t === "string" ? t.replace("parent:3218b561-2159-442e-a3aa-074756f877c0", `parent:${IDS.HBC_PRIMARY}`) : t
        ),
      };
      await updateRow(IDS.HBC_ATTRIBUTION_FU, { navigator_meta: fuMeta });
      report.actions.push({ type: "hbc_attribution_parent_repoint", id: IDS.HBC_ATTRIBUTION_FU });
    }
  }

  const arc = await fetchRow(IDS.ARC_LIVE_PLANNED);
  if (arc) {
    const meta = {
      ...(arc.navigator_meta ?? {}),
      spokenAnswer: ARC_LIVE_ANSWER,
      shortAnswer: shortFromAnswer(ARC_LIVE_ANSWER),
      reviewStatus: "needs_review",
      reviewNotes:
        "Tier 2 current-employment rehearsal wording. Confirm exact Sperro SV benefit fulfilment and your involvement before expanding. $5.2M is approved funding, not realized ROI.",
      arcStatusCorrectionNote:
        "Updated 2026-10-27 tier2: Sperro SV benefits release vs full platform; verify fulfilment details.",
    };
    await updateRow(IDS.ARC_LIVE_PLANNED, {
      answer: ARC_LIVE_ANSWER,
      navigator_meta: meta,
    });
    syncMetaByQuestion(arc.question, meta);
    report.embedIds.push(IDS.ARC_LIVE_PLANNED);
    report.actions.push({ type: "arc_body_replace", id: IDS.ARC_LIVE_PLANNED });
  }

  const didntGo = await fetchRow(IDS.DIDNT_GO);
  if (didntGo) {
    const meta = {
      ...(didntGo.navigator_meta ?? {}),
      supplementalTalkingPoints: DIDNT_GO_SUPPLEMENTAL,
      relatedQuestionIds: mergeAlt(didntGo.navigator_meta?.relatedQuestionIds, [IDS.SPERRO_CURRENT]),
    };
    await updateRow(IDS.DIDNT_GO, { navigator_meta: meta });
    report.actions.push({ type: "didnt_go_supplemental", id: IDS.DIDNT_GO });
  }

  const mistake = await fetchRow(IDS.MISTAKE_Q3);
  if (mistake) {
    report.actions.push({
      type: "mistake_unchanged",
      id: IDS.MISTAKE_Q3,
      evidenceStatus: mistake.navigator_meta?.evidenceStatus,
    });
  }

  mkdirSync(resolve(root, "data/migration"), { recursive: true });
  const out = resolve(root, "data/migration/questrade-tier2-consistency-apply-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  if (apply && !dryRun && runEmbed && report.embedIds.length) {
    await new Promise((resolvePromise, reject) => {
      const child = spawn("node", [resolve(root, "scripts/embed-qa-gte.mjs")], {
        env: { ...process.env, EMBED_QA_IDS: report.embedIds.join(",") },
        stdio: "inherit",
      });
      child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`embed exited ${code}`))));
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import type { JazStoryMap } from "./story-maps";
import { foldJazText } from "./search";

const EXPANSIONS: Record<string, string[]> = {
  interac: ["payout", "etransfer", "e transfer", "withdraw"],
  idempotency: ["duplicate", "twice"],
  reconciliation: ["reconcile", "ledger", "settlement"],
  cashback: ["withdraw", "payout", "rewards"],
  shopplus: ["extension", "browser"],
  neo: ["hbc", "issuer", "application"],
  hbc: ["neo", "mastercard", "conversion"],
  membership: ["arcteryx", "circular", "repair"],
  aeroplan: ["co brand", "cobrand", "acquisition"],
  ga4: ["google analytics", "analytics"],
  sql: ["tableau", "power bi", "snowflake"],
};

function scoreStory(query: string, story: JazStoryMap): number {
  const folded = foldJazText(query);
  if (!folded || folded.length < 2) return 0;
  const hay = foldJazText(
    [
      story.title,
      story.company,
      story.domain,
      story.hook,
      story.problem,
      story.decision,
      story.user,
      ...story.journey.flat(),
      ...story.leading,
      ...story.guardrails,
      ...story.questions,
    ].join(" ")
  );
  let score = 0;
  if (hay.includes(folded)) score += 120;
  const tokens = folded.split(/\s+/).filter((t) => t.length >= 2);
  for (const token of tokens) {
    if (hay.includes(token)) score += 24;
    for (const [key, aliases] of Object.entries(EXPANSIONS)) {
      if (token === key || aliases.some((a) => foldJazText(a) === token)) {
        if (hay.includes(key)) score += 40;
      }
    }
  }
  return score;
}

export function searchJazStoryMaps(stories: JazStoryMap[], query: string): JazStoryMap[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return stories;
  const scored = stories
    .map((story) => ({ story, score: scoreStory(trimmed, story) }))
    .filter((item) => item.score >= 40)
    .sort((a, b) => b.score - a.score || a.story.title.localeCompare(b.story.title));
  return scored.length ? scored.map((item) => item.story) : [];
}

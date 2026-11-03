import raw from "@/data/questrade-jaz-story-maps.json";

export type JazStoryMap = {
  id: string;
  company: string;
  title: string;
  domain: string;
  status: string;
  hook: string;
  user: string;
  problem: string;
  evidence: string;
  decision: string;
  alternative: string;
  journey: [string, string][];
  north: string;
  northWhy: string;
  leading: string[];
  guardrails: string[];
  observed: string[];
  ownership: string;
  watchout: string;
  questions: string[];
  answer: string;
};

export type JazStoryEmployerGroup = {
  id: string;
  label: string;
  storyIds: string[];
};

const EMPLOYER_GROUPS: JazStoryEmployerGroup[] = [
  { id: "rbc", label: "RBC Avion", storyIds: ["rbc-payouts", "rbc-shopplus", "rbc-select"] },
  { id: "hbc", label: "HBC / Neo", storyIds: ["hbc-app", "hbc-portfolio"] },
  { id: "arc", label: "Arc'teryx", storyIds: ["arc-membership"] },
  { id: "aeroplan", label: "Air Canada Aeroplan", storyIds: ["aeroplan-acq"] },
];

const storiesRaw = ((raw as unknown as { stories?: unknown[] }).stories ?? []) as Array<
  Omit<JazStoryMap, "journey"> & { journey?: unknown[] }
>;

export const jazStoryMaps: JazStoryMap[] = storiesRaw.map((story) => ({
  ...story,
  journey: (story.journey ?? []).map((step) =>
    Array.isArray(step) ? ([String(step[0]), String(step[1])] as [string, string]) : (["", ""] as [string, string])
  ),
  leading: [...(story.leading ?? [])],
  guardrails: [...(story.guardrails ?? [])],
  observed: [...(story.observed ?? [])],
  questions: [...(story.questions ?? [])],
}));

export const jazStoryEmployerGroups = EMPLOYER_GROUPS;

export function jazStoryById(id: string): JazStoryMap | undefined {
  return jazStoryMaps.find((story) => story.id === id);
}

export function validateJazStoryMaps(): string[] {
  const issues: string[] = [];
  if (jazStoryMaps.length !== 7) issues.push(`expected 7 stories, found ${jazStoryMaps.length}`);
  const ids = new Set(jazStoryMaps.map((s) => s.id));
  for (const group of EMPLOYER_GROUPS) {
    for (const storyId of group.storyIds) {
      if (!ids.has(storyId)) issues.push(`missing story ${storyId} for ${group.label}`);
    }
  }
  for (const story of jazStoryMaps) {
    if (!story.title?.trim()) issues.push(`${story.id} missing title`);
    if (!story.problem?.trim()) issues.push(`${story.id} missing problem`);
    if (story.journey.length < 4) issues.push(`${story.id} expected at least 4 journey steps`);
    if (!story.north?.trim()) issues.push(`${story.id} missing north star`);
  }
  return issues;
}

export function measurementCopyText(story: JazStoryMap): string {
  const lines = [
    `Proposed North Star: ${story.north}`,
    story.northWhy,
    "",
    "Leading / diagnostic signals:",
    ...story.leading.map((item) => `• ${item}`),
    "",
    "Guardrails:",
    ...story.guardrails.map((item) => `• ${item}`),
  ];
  if (story.observed.length) {
    lines.push("", "Observed / historically measured (not the same as the proposed North Star):", ...story.observed.map((item) => `• ${item}`));
  }
  if (story.watchout.trim()) lines.push("", story.watchout);
  return lines.join("\n");
}

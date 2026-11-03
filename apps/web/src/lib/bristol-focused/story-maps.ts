import raw from "@/data/bristol-focused-story-maps.json";

export type BristolStoryMap = {
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

export type BristolStoryEmployerGroup = {
  id: string;
  label: string;
  storyIds: string[];
};

const EMPLOYER_GROUPS: BristolStoryEmployerGroup[] = [
  { id: "rbc", label: "RBC Avion", storyIds: ["rbc-payouts", "rbc-shopplus", "rbc-select"] },
  { id: "hbc", label: "HBC / Neo", storyIds: ["hbc-app", "hbc-portfolio"] },
  { id: "arc", label: "Arc'teryx", storyIds: ["arc-membership"] },
  { id: "aeroplan", label: "Air Canada Aeroplan", storyIds: ["aeroplan-acq"] },
];

const storiesRaw = ((raw as unknown as { stories?: unknown[] }).stories ?? []) as Array<
  Omit<BristolStoryMap, "journey"> & { journey?: unknown[] }
>;

export const bristolStoryMaps: BristolStoryMap[] = storiesRaw.map((story) => ({
  ...story,
  journey: (story.journey ?? []).map((step) =>
    Array.isArray(step) ? ([String(step[0]), String(step[1])] as [string, string]) : (["", ""] as [string, string])
  ),
  leading: [...(story.leading ?? [])],
  guardrails: [...(story.guardrails ?? [])],
  observed: [...(story.observed ?? [])],
  questions: [...(story.questions ?? [])],
}));

export const bristolStoryEmployerGroups = EMPLOYER_GROUPS;

export function bristolStoryById(id: string): BristolStoryMap | undefined {
  return bristolStoryMaps.find((story) => story.id === id);
}

export function validateBristolStoryMaps(): string[] {
  const issues: string[] = [];
  if (bristolStoryMaps.length !== 7) issues.push(`expected 7 stories, found ${bristolStoryMaps.length}`);
  const ids = new Set(bristolStoryMaps.map((s) => s.id));
  for (const group of EMPLOYER_GROUPS) {
    for (const storyId of group.storyIds) {
      if (!ids.has(storyId)) issues.push(`missing story ${storyId} for ${group.label}`);
    }
  }
  for (const story of bristolStoryMaps) {
    if (!story.title?.trim()) issues.push(`${story.id} missing title`);
    if (!story.problem?.trim()) issues.push(`${story.id} missing problem`);
    if (story.journey.length < 4) issues.push(`${story.id} expected at least 4 journey steps`);
    if (!story.north?.trim()) issues.push(`${story.id} missing north star`);
  }
  return issues;
}

export function measurementCopyText(story: BristolStoryMap): string {
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

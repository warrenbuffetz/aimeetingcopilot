import raw from "@/data/jaz-role-technology-stack.json";
import { STORY_ID_TO_ROLE_ID } from "./map-links";

export type StackVerification = "firsthand" | "organization_context" | "candidate_unverified";

export type JazRoleTool = {
  name: string;
  category: string;
  verification: StackVerification;
  application: string;
};

export type JazRoleStack = {
  id: string;
  company: string;
  period: string;
  tools: JazRoleTool[];
};

const STACK_CATEGORIES = [
  "Product analytics / funnels",
  "Experimentation / testing",
  "Reporting and source of truth",
  "Product and technical platforms",
] as const;

const verificationLabels: Record<StackVerification, string> = {
  firsthand: "Firsthand",
  organization_context: "Org context",
  candidate_unverified: "Unverified reference",
};

export function stackVerificationLabel(v: StackVerification): string {
  return verificationLabels[v];
}

const roles = ((raw as { roles?: JazRoleStack[] }).roles ?? []) as JazRoleStack[];

export const jazRoleStacks: JazRoleStack[] = roles;
export const bristolRoleStacks = jazRoleStacks;

export function roleStackById(roleId: string): JazRoleStack | undefined {
  return jazRoleStacks.find((role) => role.id === roleId);
}

export function toolsForStoryMap(storyId: string): JazRoleTool[] {
  const roleId = STORY_ID_TO_ROLE_ID[storyId];
  if (!roleId) return [];
  return roleStackById(roleId)?.tools ?? [];
}

export function toolsByCategoryForStory(storyId: string): Map<string, JazRoleTool[]> {
  const map = new Map<string, JazRoleTool[]>();
  for (const category of STACK_CATEGORIES) map.set(category, []);
  for (const tool of toolsForStoryMap(storyId)) {
    const list = map.get(tool.category) ?? [];
    list.push(tool);
    map.set(tool.category, list);
  }
  return map;
}

export function validateJazTechStack(): string[] {
  const issues: string[] = [];
  if (jazRoleStacks.length !== 4) issues.push(`expected 4 role stacks, found ${jazRoleStacks.length}`);
  for (const role of jazRoleStacks) {
    if (!role.tools.length) issues.push(`${role.id} has no tools`);
    for (const tool of role.tools) {
      if (!STACK_CATEGORIES.includes(tool.category as (typeof STACK_CATEGORIES)[number])) {
        issues.push(`${role.id} tool ${tool.name} unexpected category`);
      }
    }
  }
  return issues;
}

export { STACK_CATEGORIES };

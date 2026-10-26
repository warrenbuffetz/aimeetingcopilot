/** Conservative STT / alias recovery for interview retrieval (display text unchanged). */

export type QueryNormalization = {
  /** Text sent to retrieval */
  query: string;
  /** Human-readable corrections applied */
  corrections: string[];
};

const ENTITY_ALIASES: { pattern: RegExp; replacement: string; label: string }[] = [
  { pattern: /\barteries\b/gi, replacement: "Arc'teryx", label: "Arteries → Arc'teryx" },
  { pattern: /\barch\s*['']?teryx\b/gi, replacement: "Arc'teryx", label: "Arch teryx → Arc'teryx" },
  { pattern: /\bark\s*teryx\b/gi, replacement: "Arc'teryx", label: "Ark teryx → Arc'teryx" },
  { pattern: /\bquest\s*trade\b/gi, replacement: "Questrade", label: "Quest trade → Questrade" },
  { pattern: /\bquest\s*bank\b/gi, replacement: "Questbank", label: "Quest bank → Questbank" },
  { pattern: /\bhudson\s*bay\b/gi, replacement: "HBC", label: "Hudson Bay → HBC" },
  { pattern: /\binteract\b/gi, replacement: "Interac", label: "Interact → Interac" },
  { pattern: /\btemenos\b/gi, replacement: "Temenos", label: "Temenos (cased)" },
];

export function normalizeInterviewQuery(raw: string): QueryNormalization {
  let query = raw.trim().replace(/\s+/g, " ");
  const corrections: string[] = [];
  for (const { pattern, replacement, label } of ENTITY_ALIASES) {
    if (pattern.test(query)) {
      query = query.replace(pattern, replacement);
      corrections.push(label);
    }
    pattern.lastIndex = 0;
  }
  return { query, corrections };
}

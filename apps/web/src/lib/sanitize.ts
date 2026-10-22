const INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior) instructions/i,
  /you are now/i,
  /system:\s*/i,
  /<\s*script/i,
];

export function sanitizeUserContent(text: string, maxLen = 50000): string {
  let t = text.replace(/\0/g, "").trim();
  if (t.length > maxLen) {
    t = t.slice(0, maxLen);
  }
  for (const p of INJECTION_PATTERNS) {
    if (p.test(t)) {
      t = t.replace(p, "[filtered]");
    }
  }
  return t;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function isLikelyQuestion(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.endsWith("?")) return true;
  const starters =
    /^(how|what|why|when|where|who|which|can you|could you|would you|tell me|describe|walk me through|give me an example)/i;
  return starters.test(t);
}

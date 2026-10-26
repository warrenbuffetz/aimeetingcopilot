const INTERVIEW_PROMPT =
  /^(how|what|why|when|where|who|which|can you|could you|would you|will you|tell me|tell us|describe|walk me through|give me an example|share|talk about|i'?d love to hear|we'?d love to hear)/i;

const INTERVIEW_PROMPT_ANYWHERE =
  /\b(tell us (a little bit )?more about|walk me through|can you (tell|expand|elaborate)|could you (tell|expand|elaborate)|what about your|expand on that|elaborate on|a little bit more about|hear about your (time|experience)|your experience (at|with)|your time at)\b/i;

const EMPLOYER_PROBE =
  /\b(at|with)\s+(rbc|hbc|hudson|arcteryx|arc'?teryx|aeroplan|questrade|questbank|arteries|archeryx)\b/i;

export function isLikelyQuestion(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t.endsWith("?")) return true;
  if (INTERVIEW_PROMPT.test(t)) return true;
  if (INTERVIEW_PROMPT_ANYWHERE.test(t)) return true;
  if (EMPLOYER_PROBE.test(t) && t.split(/\s+/).length >= 5) return true;
  return false;
}

/** Strong interview prompt — safe to auto-run retrieval without a question mark. */
export function isInterviewPrompt(text: string): boolean {
  const t = text.trim();
  if (!t || t.split(/\s+/).length < 4) return false;
  if (isLikelyQuestion(t)) return true;
  return INTERVIEW_PROMPT_ANYWHERE.test(t) || EMPLOYER_PROBE.test(t);
}

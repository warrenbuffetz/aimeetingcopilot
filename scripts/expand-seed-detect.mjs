#!/usr/bin/env node
/** Turn seed `detect` strings into followUps (same answer) for lexical matching. */
export function expandPreparedQa(qa) {
  const detect = Array.isArray(qa.detect) ? qa.detect : [];
  const aliasFollowUps = detect
    .map((d) => String(d).trim())
    .filter((d) => d.length >= 3)
    .map((question) => ({ question, answer: qa.answer }));
  const explicit = Array.isArray(qa.followUps) ? qa.followUps : [];
  const { detect: _d, ...rest } = qa;
  return { ...rest, followUps: [...explicit, ...aliasFollowUps] };
}

/** True when the buffer looks like a complete utterance (filler or statement). */
export function utteranceLooksComplete(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/[.!?]["']?\s*$/.test(t)) return true;
  return false;
}

/**
 * Merge a new STT fragment into the turn buffer.
 * Handles Whisper repeating or extending the same phrase across chunks.
 */
export function mergeTranscriptFragments(buffer: string, fragment: string): string {
  const b = buffer.trim();
  const f = fragment.trim();
  if (!f) return b;
  if (!b) return f;
  if (f === b) return b;
  if (b === f || b.endsWith(f)) return b;
  if (f.startsWith(b)) return f;
  if (b.startsWith(f)) return b;

  const bLower = b.toLowerCase();
  const fLower = f.toLowerCase();
  if (fLower.includes(bLower) && f.length > b.length) return f;
  if (bLower.includes(fLower) && b.length >= f.length) return b;

  const bWords = b.split(/\s+/);
  const fWords = f.split(/\s+/);
  const maxOverlap = Math.min(bWords.length, fWords.length, 12);
  for (let n = maxOverlap; n >= 3; n--) {
    const tail = bWords.slice(-n).join(" ").toLowerCase();
    const head = fWords.slice(0, n).join(" ").toLowerCase();
    if (tail === head) {
      return [...bWords, ...fWords.slice(n)].join(" ").trim();
    }
  }

  return `${b} ${f}`.trim();
}

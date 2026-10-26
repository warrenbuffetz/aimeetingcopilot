export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Last N lines (by newline) or wrapped logical lines ~80 chars for plain text. */
export function tailLines(text: string, maxLines: number): string {
  const t = text.trim();
  if (!t || maxLines < 1) return "";
  const byNewline = t.split(/\n+/).filter(Boolean);
  if (byNewline.length > 1) {
    return byNewline.slice(-maxLines).join("\n");
  }
  const words = t.split(/\s+/);
  const approxWordsPerLine = 14;
  const needWords = maxLines * approxWordsPerLine;
  if (words.length <= needWords) return t;
  return words.slice(-needWords).join(" ");
}

export function tailWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(-maxWords).join(" ");
}

export function excerptWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

/**
 * Split long finalized speech into display segments (~40–80 words), preferring sentence boundaries.
 */
export function segmentTranscriptForDisplay(text: string, maxWordsPerSegment = 70): string[] {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return [];
  if (countWords(trimmed) <= maxWordsPerSegment) return [trimmed];

  const segments: string[] = [];
  let rest = trimmed;

  while (rest) {
    if (countWords(rest) <= maxWordsPerSegment) {
      segments.push(rest);
      break;
    }
    const words = rest.split(/\s+/);
    let take = Math.min(maxWordsPerSegment, words.length);
    let candidate = words.slice(0, take).join(" ");

    const re = /[.!?]["']?(?=\s|$)/g;
    let lastEnd = -1;
    let m: RegExpExecArray | null;
    while ((m = re.exec(candidate))) {
      lastEnd = m.index + m[0].length;
    }
    if (lastEnd > candidate.length * 0.4) {
      candidate = candidate.slice(0, lastEnd).trim();
      take = countWords(candidate);
    }

    segments.push(candidate);
    rest = words.slice(take).join(" ").trim();
    if (segments.length > 48) {
      if (rest) segments.push(rest);
      break;
    }
  }

  return segments.filter(Boolean);
}

export function textsEquivalent(a: string, b: string): boolean {
  return a.trim().replace(/\s+/g, " ").toLowerCase() === b.trim().replace(/\s+/g, " ").toLowerCase();
}

export function lineMatchesQuestionHighlight(lineText: string, question: string | null | undefined): boolean {
  if (!question?.trim()) return false;
  const q = question.trim().replace(/\s+/g, " ").toLowerCase();
  const t = lineText.trim().replace(/\s+/g, " ").toLowerCase();
  if (t === q) return true;
  if (t.includes(q) && q.length >= 12) return true;
  if (q.includes(t) && t.length >= 12) return true;
  return false;
}

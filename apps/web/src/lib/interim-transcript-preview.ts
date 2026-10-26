/** Approximate words shown per visual line in the narrow transcript column. */
const WORDS_PER_LINE = 14;

export const LIVE_INTERIM_PREVIEW_LINES = 5;

export function tailInterimPreview(text: string, maxLines = LIVE_INTERIM_PREVIEW_LINES): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  const words = trimmed.split(/\s+/);
  const maxWords = Math.max(1, maxLines * WORDS_PER_LINE);
  if (words.length <= maxWords) return trimmed;
  return words.slice(-maxWords).join(" ");
}

export function interimPreviewIsTruncated(fullText: string, preview: string): boolean {
  const fullWords = fullText.trim().split(/\s+/).filter(Boolean).length;
  const previewWords = preview.trim().split(/\s+/).filter(Boolean).length;
  return fullWords > previewWords + 4;
}

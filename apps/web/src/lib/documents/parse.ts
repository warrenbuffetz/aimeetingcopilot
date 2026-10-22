import { sanitizeUserContent } from "@/lib/sanitize";

export function parseTextOrMarkdown(buffer: Buffer, filename: string): string {
  const text = buffer.toString("utf-8");
  if (!text.trim()) {
    throw new Error(`Empty file: ${filename}`);
  }
  return sanitizeUserContent(text);
}

export async function parsePdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  const text = result.text?.trim();
  if (!text) {
    throw new Error("Could not extract text from PDF.");
  }
  return sanitizeUserContent(text);
}

export function chunkText(text: string, chunkSize = 1200, overlap = 150): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push(text.slice(i, end).trim());
    if (end >= text.length) break;
    i = end - overlap;
  }
  return chunks.filter((c) => c.length > 40);
}

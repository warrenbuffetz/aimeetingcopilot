const PREFERRED = "audio/webm;codecs=opus";
const FALLBACKS = ["audio/webm", "audio/ogg;codecs=opus", ""];

export function pickSessionRecorderMimeType(
  isTypeSupported: (mime: string) => boolean = (m) =>
    typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)
): string {
  if (isTypeSupported(PREFERRED)) return PREFERRED;
  for (const mime of FALLBACKS) {
    if (!mime) break;
    if (isTypeSupported(mime)) return mime;
  }
  return "";
}

export function extensionForMime(mime: string): string {
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

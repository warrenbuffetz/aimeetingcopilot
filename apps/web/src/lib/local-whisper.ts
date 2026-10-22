export function getLocalWhisperBaseUrl(): string {
  return process.env.LOCAL_WHISPER_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8765";
}

export async function isLocalWhisperReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${getLocalWhisperBaseUrl()}/health`, {
      signal: AbortSignal.timeout(800),
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { ok?: boolean };
    return body.ok === true;
  } catch {
    return false;
  }
}

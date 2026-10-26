export function stitchWebSpeechLive(confirmed: string, interim: string): string {
  return [confirmed.trim(), interim.trim()].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export type WebSpeechResultSlice = {
  finals: string[];
  interim: string;
};

/**
 * Process a SpeechRecognition result event — only new finals since resultIndex,
 * and interim text for the active (non-final) hypothesis only (not session history).
 */
export function sliceWebSpeechResults(
  results: { length: number; [index: number]: { isFinal: boolean; 0?: { transcript?: string } } },
  resultIndex: number
): WebSpeechResultSlice {
  const finals: string[] = [];
  let interim = "";

  for (let i = resultIndex; i < results.length; i++) {
    const result = results[i];
    const text = (result[0]?.transcript ?? "").trim();
    if (!text) continue;
    if (result.isFinal) {
      finals.push(text);
    } else {
      interim += (interim ? " " : "") + text;
    }
  }

  return {
    finals,
    interim: interim.replace(/\s+/g, " ").trim(),
  };
}

/** All non-final hypotheses in the current recognition session (live tail). */
export function interimHypothesisFromResults(
  results: { length: number; [index: number]: { isFinal: boolean; 0?: { transcript?: string } } }
): string {
  let interim = "";
  for (let i = 0; i < results.length; i++) {
    if (!results[i].isFinal) {
      interim += results[i][0]?.transcript ?? "";
    }
  }
  return interim.replace(/\s+/g, " ").trim();
}

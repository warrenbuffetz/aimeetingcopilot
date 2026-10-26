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

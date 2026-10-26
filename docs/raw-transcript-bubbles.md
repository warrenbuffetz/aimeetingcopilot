# Raw transcript — runaway interim bubbles (fixed)

## Root cause

Web Speech `onInterim` was fed `stitchWebSpeechLive(confirmedRef, interim)` where **`confirmedRef` accumulated every final phrase for the entire session** and never reset. Each `onresult` repaint appended the **full interview history** plus the current guess into one provisional `TranscriptLine`, so the Raw column showed a single unbounded bubble.

## Interim handling (faithful STT)

| Layer | Behaviour |
|--------|-----------|
| `sliceWebSpeechResults` | New finals only from `resultIndex`; interim = non-final text in this event only |
| `ingestSpeechFragment` | Finals merge into `turnBufferRef`; silence timer finalizes one turn |
| `ingestWebSpeechInterim` | Updates one live line (`isFinal: false`); full text in state |
| `recognition.onstart` | Clears interim UI when the engine restarts (avoids stale hypothesis) |

Web Speech on `/live` no longer uses `finalizeImmediately: true` per micro-final — utterances batch until silence so **statement-style questions** and multi-segment speech classify on the **full turn**.

## Visual segmentation (display-only)

- **Live speech**: max height ~7.5rem, last ~5 logical lines (`tailLines`), **Expand live preview**; label “Live speech” + timestamp on parent row.
- **Finalized long turns**: `segmentTranscriptForDisplay` (~70 words, sentence-aware) → multiple rows with `speechGroupId` + `fullText`.
- **Groups >80 words**: collapsed excerpt, part count, **Expand full passage** / **Find answer** on full text.
- **Single long lines** (>55 words): excerpt + Expand.
- **Detected question**: cyan ring when line/`fullText` matches `currentQuestion` (classifier label, not speaker diarization).

## Lossless?

Yes relative to browser STT: full strings remain in React state (`line.text`, `fullText`, `turnBufferRef` until finalize). UI truncation is preview-only; interim is **not** auto-finalized when collapsed.

## Navigation

- `stickToBottomKey` updates on **new finalized** lines only — interim ticks do not auto-scroll.
- `useStickToBottom` unchanged: scroll up → **Jump to latest**; expand/collapse keys stable across interim updates.

## Tests

`apps/web/src/lib/__tests__/transcript-display.test.ts`, `web-speech.test.ts` — segmentation, tail, slice semantics.

## Manual checks (A–H)

Run on `/live` with Web Speech: long answer, scroll up during STT, shift-select segments → Analyze, locked answer while transcribing. Session recording is untouched.

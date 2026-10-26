# Local session recording (`/live`)

Optional browser-native interview recording. Independent of Whisper/Web Speech STT and semantic retrieval.

## Audio sources

| Mode | Capture |
|------|---------|
| Microphone only | `getUserMedia` or reuse the active STT microphone stream |
| Meeting tab | `getDisplayMedia` with tab audio (video track disabled, not saved) |
| Microphone + meeting | Web Audio mix of mic + tab into one `MediaStream` |

## Format

- Preferred MIME: `audio/webm;codecs=opus` (fallback via `MediaRecorder.isTypeSupported`)
- Bitrate: **96 kbps** (`audioBitsPerSecond`)
- Chunks: **10 s** `timeslice` + `requestData` on stop

## Limitations

- **Tab audio** requires Chromium-style “Share tab” with audio checked. Google Meet / Teams in **another browser tab** is the supported case.
- **Native desktop apps** (Meet app, Zoom client) usually do not expose audio to Chrome — use mic-only or OS-level routing.
- **Safari** has limited `getDisplayMedia` audio support; prefer Chrome or Edge for two-sided capture.
- **Refresh / close tab** before download may lose audio; `beforeunload` warns while recording. Chunks are mirrored to **IndexedDB** when available.

## Download

- Filename: `{ProfileSlug}_{YYYY-MM-DD}_{HHmm}.webm`
- `showSaveFilePicker` when supported, else `<a download>` blob URL
- No upload to Supabase, Vercel, or third parties

## Verification

Automated: `apps/web/src/lib/__tests__/session-recording.test.ts`  
Manual: start recording before a mock interview, confirm STT still runs, stop, preview, and download a playable file.

# Live interview layout — transcript vs questions

## Columns (wide desktop)

1. **Raw transcript** — full STT feed; click-to-reanalyze; speaker **unknown** on mic capture.
2. **Detected questions** — `questionHistory` only (not readback / not raw speech).
3. **Prepared answer** — unchanged behaviour (lock, pin, alternatives, follow-ups).
4. **Interview Navigator** — unchanged.

Layout uses `ResizeObserver` on the workspace (`computeLiveWorkspaceLayout`). Below ~1.4kpx workspace width, raw transcript moves to a **drawer** (header **Transcript** button, ⌘⇧T).

## Speaker separation

- **No diarization** in the current STT stack. Mic + Web Speech transcribes **all** audio the mic hears (you + room + speakers).
- **Readback** lines (`reading_displayed_answer`) appear in raw transcript only; they are **not** added to detected questions.
- **Meeting tab + Whisper** captures **remote** meeting audio digitally; still no per-speaker labels unless the STT provider adds them later.

Using **tab capture for the interviewer** and **mic only for practice** is the reliable way to separate roles for question detection; mic-only mock interviews will mix your answers with prompts.

## State

Single source of truth: `useLiveSession` (`lines`, `questionHistory`, `historySources`). No duplicate STT listeners.

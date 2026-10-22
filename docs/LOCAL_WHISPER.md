# Local Whisper on Mac (free STT)

Interview Copilot can transcribe audio with **Whisper running on your Mac** — no OpenAI STT charges.

## One-time setup

```bash
brew install ffmpeg
cd "/Users/johnlee/Documents/Cursor/ai meeting copilot"
python3 -m venv .venv-whisper
source .venv-whisper/bin/activate
pip install -r scripts/requirements-whisper.txt
```

First run downloads the model (`base.en` by default, ~150MB).

## Run Whisper (keep this terminal open)

```bash
source .venv-whisper/bin/activate   # if not already
npm run whisper:server
```

Health check: `curl http://127.0.0.1:8765/health`

Optional env:

| Variable | Default |
|----------|---------|
| `WHISPER_MODEL` | `base.en` (`tiny.en` faster, `small.en` better) |
| `WHISPER_PORT` | `8765` |
| `LOCAL_WHISPER_URL` | `http://127.0.0.1:8765` (in `apps/web/.env.local`) |

## Use in Live

1. Start `npm run dev` and `npm run whisper:server`.
2. Open **Live** → **Audio** → start **meeting tab** or **microphone**.
3. **One continuous recording** — every ~2s the browser flushes new audio to Whisper (no stop/start slices) → transcript → **local** answer matching. Turns finalize after ~2s of silence (faster when the line ends with `?`).

**Compare STT:** Live → **Audio → Web Speech (Joist demo)** uses the same browser API as the Joist invoice demo (mic only, Chrome sends audio to Google). Use it side-by-side with Whisper to see which captures your interview audio better.

## Turn detection (Live)

Speech is **buffered until ~2s silence**, then the full line is added to the **transcript**. Every substantial line is surfaced in an **amber banner** — you choose **Load answer** or **Dismiss** (no auto-promote, no filler filtering). **Unlock** clears the locked-answer state.

**Later:** streaming Whisper partials (finer silence detection) via `interimTurn` on the Live session.

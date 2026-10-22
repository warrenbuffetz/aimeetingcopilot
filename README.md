# Interview Copilot

Real-time interview assistant with **retrieval before generation**: match spoken questions to your prepared library first; generate only when retrieval is insufficient.

## Monorepo

| Package | Description |
|---------|-------------|
| `apps/web` | Next.js app (Vercel) — dashboard, library, live UI |
| `apps/desktop` | Windows Electron companion — loopback capture & overlay |
| `packages/shared` | Shared thresholds, types, question heuristics |
| `supabase/migrations` | Postgres + pgvector schema and RLS |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for diagrams and milestones.

## Prerequisites

- Node.js 20+
- Supabase project (Auth + Postgres)
- OpenAI API key
- Windows 11 for desktop loopback testing (browser capture works on supported Chromium browsers)

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Enable Email auth (or your preferred provider).
3. Run the migration SQL in `supabase/migrations/20251022000000_initial.sql` via the SQL editor or CLI.
4. Copy **Project URL** and **anon key**; keep **service role** server-only if you add admin scripts later.

## 2. Web app (local)

```bash
cd "ai meeting copilot"
npm install
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local with Supabase + OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### POC mode (no login screen)

Set `NEXT_PUBLIC_POC_MODE=true` in `apps/web/.env.local`. The app skips the login page and creates a **Supabase anonymous session** in the background (required for RLS).

POC uses a server-side demo account (no login UI). Add **`SUPABASE_SERVICE_ROLE_KEY`** to `apps/web/.env.local` (Project Settings → API). Anonymous auth is not required.

### Health check

```bash
curl http://localhost:3000/api/health
```

## 3. Vercel deployment

1. Import the repo; set root directory to `apps/web` **or** configure monorepo build:
   - Install: `npm install` (from repo root)
   - Build: `npm run build -w @interview-copilot/web`
2. Add environment variables from `apps/web/.env.example`.
3. Deploy. WebSocket/long-lived routes: use supported Vercel patterns; chunk transcription uses short POST requests today.

## 4. Windows desktop companion

```bash
npm install
npm run build -w @interview-copilot/desktop
INTERVIEW_COPILOT_URL=https://your-app.vercel.app npm run dev -w @interview-copilot/desktop
```

On Windows, build installer:

```bash
npm run pack -w @interview-copilot/desktop
```

**Permissions:** Capture starts only when you click **Start loopback capture**. Use the web app signed in to the same account. Inform meeting participants and follow applicable law and employer policies.

## Features implemented (MVP)

- Auth-gated dashboard, profiles, prepared Q&A, document import (TXT/MD/PDF), embeddings + pgvector search
- Live UI: simulation mode, manual analyze, browser `getDisplayMedia` + chunked transcription
- Retrieval pipeline: PREPARED / ADAPTED / GENERATED outcomes
- Electron shell: loopback-oriented capture UI, overlay window, open web live session

## Testing

```bash
npm run test -w @interview-copilot/web
npm run typecheck
```

### Manual acceptance (abbreviated)

1. Create Q&A → search/analyze returns verbatim answer.
2. Paraphrased question still matches (after embeddings).
3. Stop capture → meter drops, status shows stopped.
4. Simulation highlights questions and triggers analyze.
5. Second user account cannot read first user's rows (RLS).

## Privacy

- No default persistence of raw meeting audio.
- Transcript persistence is opt-in per session (schema ready; wire in settings as needed).
- OpenAI key never shipped to the browser — server routes only.

## Known limitations

- Browser system audio depends on OS/browser (often tab audio only).
- **Live → Realtime capture** uses OpenAI Realtime transcription (`gpt-4o-mini-transcribe`) over WebSocket (requires valid `OPENAI_API_KEY`).
- **Live → Desktop relay** receives audio from the Windows Electron companion on `ws://127.0.0.1:39200` (chunk transcription path).
- Electron loopback requires Windows testing; macOS dev builds the shell but loopback is Windows-focused.

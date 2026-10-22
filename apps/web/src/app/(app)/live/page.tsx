"use client";

import { useCallback, useEffect, useState } from "react";
import { useRealtimeTranscription } from "@/hooks/use-realtime-transcription";
import { useDesktopAudioRelay } from "@/hooks/use-desktop-audio-relay";
import { createClient } from "@/lib/supabase/client";
import { useLiveSession } from "@/hooks/use-live-session";
import { useBrowserAudioCapture } from "@/hooks/use-browser-audio-capture";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Copy, Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";

export default function LiveInterviewPage() {
  const [profiles, setProfiles] = useState<{ id: string; name: string }[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [manualQuestion, setManualQuestion] = useState("");
  const [showFull, setShowFull] = useState(false);
  const [pinned, setPinned] = useState<string | null>(null);

  const session = useLiveSession(profileId);
  const capture = useBrowserAudioCapture();

  const realtime = useRealtimeTranscription({
    onPartial: session.onPartialTranscript,
    onFinal: session.onFinalUtterance,
    onError: (m) => toast.error(m),
  });

  const desktopRelay = useDesktopAudioRelay(
    useCallback((blob) => void session.transcribeChunk(blob), [session.transcribeChunk])
  );

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("interview_profiles").select("id, name");
      setProfiles(data ?? []);
    })();
  }, []);

  function outcomeBadge(outcome: string | undefined) {
    if (outcome === "PREPARED") return <Badge className="bg-emerald-600/90">Prepared</Badge>;
    if (outcome === "ADAPTED") return <Badge variant="secondary">Adapted</Badge>;
    return <Badge variant="outline">Generated</Badge>;
  }

  async function copyAnswer() {
    const text = session.result?.answer;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  }

  async function startRealtimeListening() {
    await capture.startDisplay();
    const stream = capture.getStream();
    if (!stream?.getAudioTracks().length) {
      toast.error("No audio track — pick a tab/window with audio.");
      return;
    }
    session.setListening(true);
    await realtime.start(stream);
  }

  async function startBrowserChunkListening() {
    await capture.startDisplay();
    session.setListening(true);
    capture.startChunkedTranscription((blob) => void session.transcribeChunk(blob));
  }

  function connectDesktopAudio() {
    desktopRelay.connect();
    session.setListening(true);
    toast.message("Listening for Electron desktop audio relay…");
  }

  function stopAll() {
    realtime.stop();
    desktopRelay.disconnect();
    capture.stop();
    session.stopListening();
  }

  const displayAnswer = pinned ?? session.result?.answer ?? "Start listening or run simulation to detect questions.";
  const related = session.result?.matches?.slice(0, 5) ?? [];

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Live interview</h1>
          <p className="text-xs text-muted-foreground">
            Listening is explicit — inform participants and comply with local rules.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-44">
            <Select value={profileId ?? "all"} onValueChange={(v) => setProfileId(v === "all" ? null : v)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">No profile</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {session.listening && (
            <Badge variant="destructive" className="animate-pulse">Listening</Badge>
          )}
          <Button size="sm" variant="outline" onClick={() => session.setPaused(!session.paused)}>
            {session.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {session.paused ? "Resume" : "Pause"}
          </Button>
          <Button size="sm" onClick={() => session.startSimulation()} disabled={session.listening}>
            Simulate transcript
          </Button>
          <Button size="sm" variant="secondary" onClick={() => void startRealtimeListening()}>
            Realtime capture
          </Button>
          <Button size="sm" variant="outline" onClick={() => void startBrowserChunkListening()}>
            Chunk capture
          </Button>
          <Button size="sm" variant="outline" onClick={connectDesktopAudio}>
            Desktop relay
          </Button>
          <Button size="sm" variant="ghost" onClick={stopAll}>
            <Square className="h-4 w-4" /> Stop
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-12">
        {/* Left: transcript */}
        <section className="border-b border-border lg:col-span-3 lg:border-b-0 lg:border-r">
          <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
            Source: {capture.source}
            {desktopRelay.connected ? " · desktop relay" : ""}
            {realtime.status === "live" ? " · realtime ws" : ""}
            · Level: {(capture.health.level * 100).toFixed(0)}%
            {capture.health.error && <span className="text-amber-400"> · {capture.health.error}</span>}
            {desktopRelay.error && <span className="text-amber-400"> · {desktopRelay.error}</span>}
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)] p-3">
            <ul className="space-y-2 text-sm">
              {session.lines.map((line) => (
                <li
                  key={line.id}
                  className={cn(
                    "rounded-md px-2 py-1",
                    line.isQuestion && "border border-emerald-500/40 bg-emerald-500/10",
                    !line.isFinal && "opacity-60 italic"
                  )}
                >
                  {line.text}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </section>

        {/* Center: answer */}
        <section className="lg:col-span-6 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
            {session.result && outcomeBadge(session.result.outcome)}
            {session.result && (
              <span className="text-xs text-muted-foreground">
                Confidence {(session.result.confidence * 100).toFixed(0)}% · {session.result.sourceLabel}
              </span>
            )}
            <div className="ml-auto flex gap-1">
              <Button size="sm" variant="outline" disabled={!session.currentQuestion} onClick={() => session.currentQuestion && void session.analyze(session.currentQuestion)}>
                Analyze question
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowFull((v) => !v)}>
                {showFull ? "Condense" : "Full answer"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => void copyAnswer()}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPinned(session.result?.answer ?? null)}>Pin</Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <h2 className="text-sm font-medium text-muted-foreground">Detected question</h2>
            <p className="mt-1 text-lg font-medium">{session.currentQuestion ?? "—"}</p>
            {session.loading && <p className="mt-4 text-sm text-muted-foreground">Retrieving…</p>}
            <article className={cn("mt-6 whitespace-pre-wrap leading-relaxed", !showFull && "line-clamp-[12]")}>
              {displayAnswer}
            </article>
            {session.result?.talkingPoints && session.result.talkingPoints.length > 0 && (
              <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {session.result.talkingPoints.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2 border-t border-border p-3">
            <Button size="sm" variant="ghost" onClick={session.goPrev}>Previous</Button>
            <Button size="sm" variant="ghost" onClick={session.goNext}>Next</Button>
          </div>
          <div className="border-t border-border p-3">
            <Label className="text-xs">Manual analyze</Label>
            <div className="mt-1 flex gap-2">
              <Input
                value={manualQuestion}
                onChange={(e) => setManualQuestion(e.target.value)}
                placeholder="Type a question to test retrieval"
              />
              <Button onClick={() => void session.analyze(manualQuestion)} disabled={!manualQuestion}>
                Analyze
              </Button>
            </div>
          </div>
        </section>

        {/* Right: context */}
        <section className="border-t border-border lg:col-span-3 lg:border-t-0 lg:border-l">
          <div className="px-3 py-2 text-sm font-medium">Related library</div>
          <ScrollArea className="h-[calc(100vh-8rem)] p-3">
            <ul className="space-y-3 text-sm">
              {related.map((m) => (
                <li key={m.id} className="rounded-md border border-border p-2">
                  <div className="text-xs text-muted-foreground">{m.contentType} · {(m.similarity * 100).toFixed(0)}%</div>
                  <div className="font-medium">{m.title}</div>
                  <p className="mt-1 line-clamp-3 text-muted-foreground">{m.content}</p>
                </li>
              ))}
              {!related.length && <p className="text-muted-foreground">Matches appear after analysis.</p>}
            </ul>
          </ScrollArea>
        </section>
      </div>
    </div>
  );
}

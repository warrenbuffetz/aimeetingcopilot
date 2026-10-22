import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-6">
      <div className="max-w-xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <Mic className="h-3.5 w-3.5 text-emerald-400" />
          Retrieval before generation
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Interview Copilot</h1>
        <p className="mt-4 text-muted-foreground">
          Hear the question, match your prepared answers instantly, and speak with confidence. You
          control capture, consent, and what gets saved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" render={<Link href="/dashboard" />}>Open dashboard</Button>
          <Button size="lg" variant="outline" render={<Link href="/login" />}>Sign in</Button>
        </div>
      </div>
    </div>
  );
}

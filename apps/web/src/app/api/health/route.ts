import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { isLocalWhisperReachable } from "@/lib/local-whisper";

export async function GET() {
  const localWhisper = await isLocalWhisperReachable();
  return NextResponse.json({
    ok: true,
    supabase: isSupabaseConfigured(),
    localWhisper,
    matchMode: "lexical",
    timestamp: new Date().toISOString(),
  });
}

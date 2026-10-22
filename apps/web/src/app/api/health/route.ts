import { NextResponse } from "next/server";
import { isOpenAIConfigured, isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    supabase: isSupabaseConfigured(),
    openai: isOpenAIConfigured(),
    timestamp: new Date().toISOString(),
  });
}

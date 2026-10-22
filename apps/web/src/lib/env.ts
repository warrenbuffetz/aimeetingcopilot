import { z } from "zod";

function emptyToUndefined(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  return value;
}

const serverSchema = z.object({
  OPENAI_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_POC_MODE: z.string().optional(),
});

export function getClientEnv() {
  return clientSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_POC_MODE: process.env.NEXT_PUBLIC_POC_MODE,
  });
}

export function getServerEnv() {
  const client = getClientEnv();
  const server = serverSchema.parse({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  return { ...client, ...server };
}

export function isSupabaseConfigured(): boolean {
  const e = getClientEnv();
  return Boolean(e.NEXT_PUBLIC_SUPABASE_URL && e.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isOpenAIConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return Boolean(key && key.length > 0 && !key.startsWith("sk-..."));
}

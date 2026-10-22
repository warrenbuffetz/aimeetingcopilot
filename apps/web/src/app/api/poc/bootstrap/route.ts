import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, getPocDemoPassword, POC_DEMO_EMAIL } from "@/lib/supabase/admin";
import { isPocMode } from "@/lib/poc";

export async function GET() {
  if (!isPocMode()) {
    return NextResponse.json({ error: "Not in POC mode" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.auth.getUser();
  if (existing.user) {
    return NextResponse.json({ ok: true, alreadySignedIn: true });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Set SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.local to your sb_secret_… key, save the file, then restart npm run dev.",
      },
      { status: 503 }
    );
  }

  const password = getPocDemoPassword();

  const { error: createError } = await admin.auth.admin.createUser({
    email: POC_DEMO_EMAIL,
    password,
    email_confirm: true,
  });

  if (createError && !createError.message.toLowerCase().includes("already")) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: POC_DEMO_EMAIL,
    password,
  });

  if (signInError) {
    return NextResponse.json({ error: signInError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

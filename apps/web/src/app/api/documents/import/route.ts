import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { chunkText, parsePdf, parseTextOrMarkdown } from "@/lib/documents/parse";
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const profileId = form.get("profileId")?.toString() || null;
  const docType = (form.get("docType")?.toString() || "prep") as "prep" | "resume" | "job_description" | "other";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name;
  const lower = name.toLowerCase();
  let text: string;
  try {
    if (lower.endsWith(".pdf")) {
      text = await parsePdf(buffer);
    } else if (lower.endsWith(".md") || lower.endsWith(".markdown") || lower.endsWith(".txt")) {
      text = parseTextOrMarkdown(buffer, name);
    } else {
      return NextResponse.json({ error: "Supported: .txt, .md, .pdf" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Parse failed" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      profile_id: profileId,
      filename: name,
      mime_type: file.type || "application/octet-stream",
      doc_type: docType,
      extracted_text: text,
    })
    .select()
    .single();

  if (docErr) return NextResponse.json({ error: docErr.message }, { status: 500 });

  if (docType === "resume" && profileId) {
    await supabase.from("interview_profiles").update({ resume_text: text }).eq("id", profileId);
  }
  if (docType === "job_description" && profileId) {
    await supabase.from("interview_profiles").update({ job_description: text }).eq("id", profileId);
  }

  const chunks = chunkText(text);
  const rows = chunks.map((content, i) => ({
    user_id: user.id,
    document_id: doc.id,
    chunk_index: i,
    content,
  }));
  const { data: inserted, error: chunkErr } = await supabase.from("document_chunks").insert(rows).select();
  if (chunkErr) return NextResponse.json({ error: chunkErr.message }, { status: 500 });

  return NextResponse.json({ document: doc, chunks: inserted?.length ?? 0 });
}

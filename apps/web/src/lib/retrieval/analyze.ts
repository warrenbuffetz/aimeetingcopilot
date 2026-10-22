import type { SupabaseClient } from "@supabase/supabase-js";
import {
  boostSimilarity,
  MATCH_THRESHOLD_PREPARED,
  MATCH_THRESHOLD_STORY,
  MATCH_THRESHOLD_WEAK,
  type AnalyzeQuestionResult,
  type AnswerFormat,
  type RetrievalMatch,
} from "@interview-copilot/shared";
import { embedText, getOpenAI } from "@/lib/openai";
import { sanitizeUserContent } from "@/lib/sanitize";

type RpcRow = {
  id: string;
  content_type: string;
  source_id: string;
  profile_id: string | null;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
};

export async function semanticSearch(
  supabase: SupabaseClient,
  question: string,
  profileId: string | null
): Promise<RetrievalMatch[]> {
  const embedding = await embedText(question);
  const { data, error } = await supabase.rpc("match_search_embeddings", {
    query_embedding: embedding,
    match_count: 10,
    filter_profile_id: profileId,
  });
  if (error) throw error;
  const rows = (data ?? []) as RpcRow[];
  return rows.map((r) => ({
    id: r.id,
    contentType: r.content_type as RetrievalMatch["contentType"],
    sourceId: r.source_id,
    title: r.title,
    content: r.content,
    similarity: boostSimilarity(r.similarity, {
      preferred: Boolean(r.metadata?.is_preferred),
      sameProfile: profileId != null && r.profile_id === profileId,
    }),
    metadata: r.metadata,
  }));
}

async function generateAdaptedAnswer(
  question: string,
  story: RetrievalMatch,
  profile: { job_description?: string | null; resume_text?: string | null }
): Promise<{ answer: string; talkingPoints: string[] }> {
  const openai = getOpenAI();
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `You help the user answer interview questions using ONLY their verified experience story. Do not invent employers, titles, metrics, or outcomes. If the story lacks detail, say so briefly. Use conversational language. Output JSON: {"answer":"...","talkingPoints":["..."]}`,
      },
      {
        role: "user",
        content: sanitizeUserContent(
          `Question: ${question}\n\nExperience story:\n${story.content}\n\nJob context:\n${profile.job_description ?? "N/A"}\n\nResume excerpt:\n${(profile.resume_text ?? "").slice(0, 2000)}`
        ),
      },
    ],
    response_format: { type: "json_object" },
  });
  const raw = res.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw) as { answer?: string; talkingPoints?: string[] };
    return {
      answer: parsed.answer ?? "Use your prepared story and speak to the specifics above.",
      talkingPoints: parsed.talkingPoints ?? [],
    };
  } catch {
    return { answer: story.content, talkingPoints: [] };
  }
}

async function generateNewAnswer(
  question: string,
  profile: { job_description?: string | null; resume_text?: string | null },
  format: AnswerFormat
): Promise<{ answer: string; talkingPoints: string[] }> {
  const openai = getOpenAI();
  const formatHint =
    format === "bullets"
      ? "Respond with short speaking bullets."
      : format === "thirty_second"
        ? "Respond in ~30 seconds spoken (~75 words)."
        : "Respond with a full conversational answer.";
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: `You are an interview coach. Use ONLY facts from the user's resume and job description. Never invent employment history or metrics. Label gaps as general guidance. For PM questions: customer problem, trade-offs, metrics, execution. For behavioral: STAR. ${formatHint} Output JSON: {"answer":"...","talkingPoints":["..."]}`,
      },
      {
        role: "user",
        content: sanitizeUserContent(
          `Question: ${question}\n\nJob description:\n${profile.job_description ?? "N/A"}\n\nResume:\n${(profile.resume_text ?? "").slice(0, 4000)}`
        ),
      },
    ],
    response_format: { type: "json_object" },
  });
  const raw = res.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw) as { answer?: string; talkingPoints?: string[] };
    return {
      answer: parsed.answer ?? "General guidance: structure your answer with context, your approach, and a concrete example you can verify.",
      talkingPoints: parsed.talkingPoints ?? [],
    };
  } catch {
    return {
      answer: "General guidance only — add a prepared answer or experience story for a grounded response.",
      talkingPoints: [],
    };
  }
}

export async function analyzeQuestion(
  supabase: SupabaseClient,
  opts: {
    question: string;
    profileId: string | null;
    answerFormat?: AnswerFormat;
  }
): Promise<AnalyzeQuestionResult> {
  const question = sanitizeUserContent(opts.question, 2000);
  const matches = await semanticSearch(supabase, question, opts.profileId);

  let profile: { job_description?: string | null; resume_text?: string | null } = {};
  if (opts.profileId) {
    const { data } = await supabase
      .from("interview_profiles")
      .select("job_description, resume_text")
      .eq("id", opts.profileId)
      .single();
    if (data) profile = data;
  }

  const topQa = matches.find((m) => m.contentType === "prepared_qa");
  if (topQa && topQa.similarity >= MATCH_THRESHOLD_PREPARED) {
    const { data: qa } = await supabase
      .from("prepared_qa")
      .select("answer, question")
      .eq("id", topQa.sourceId)
      .single();
    const fromEmbed = topQa.content.split("\n\n").slice(1).join("\n\n");
    const verbatim = qa?.answer ?? (fromEmbed || topQa.content);
    return {
      question,
      outcome: "PREPARED",
      confidence: topQa.similarity,
      preparedQuestion: qa?.question ?? topQa.title,
      answer: verbatim,
      sourceLabel: "Your prepared answer (verbatim)",
      talkingPoints: [],
      matches,
    };
  }

  const topStory = matches.find((m) => m.contentType === "experience_story");
  if (topStory && topStory.similarity >= MATCH_THRESHOLD_STORY) {
    const { answer, talkingPoints } = await generateAdaptedAnswer(question, topStory, profile);
    return {
      question,
      outcome: "ADAPTED",
      confidence: topStory.similarity,
      answer: `Adapted from your experience: "${topStory.title}"\n\n${answer}`,
      sourceLabel: topStory.title,
      talkingPoints,
      matches,
    };
  }

  const weak = matches[0];
  if (weak && weak.similarity >= MATCH_THRESHOLD_WEAK) {
    const format = opts.answerFormat ?? "thirty_second";
    const { answer, talkingPoints } = await generateNewAnswer(question, profile, format);
    return {
      question,
      outcome: "GENERATED",
      confidence: weak.similarity,
      answer: `[General guidance — weak match to "${weak.title}"]\n\n${answer}`,
      sourceLabel: "Generated from profile context",
      talkingPoints,
      matches,
    };
  }

  const format = opts.answerFormat ?? "thirty_second";
  const { answer, talkingPoints } = await generateNewAnswer(question, profile, format);
  return {
    question,
    outcome: "GENERATED",
    confidence: matches[0]?.similarity ?? 0,
    answer,
    sourceLabel: "Generated from profile context",
    talkingPoints,
    matches,
  };
}

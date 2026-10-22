# Prompt: generate follow-ups for Interview Copilot (paste into ChatGPT / Gemini)

Copy everything below into a new chat, then attach **`questrade-interview-playbook.md`** (from `npm run export:custom-gpt`).

---

You are helping me prepare **follow-up questions and answers** for a live interview.

For each **parent question** in the attached playbook, produce **2–4 likely follow-ups** a Questrade hiring manager might ask immediately after my main answer.

Rules:

1. Use **only** facts, employers, metrics, and stories already in the playbook — do not invent new experience.
2. Each follow-up needs a **short question** (how they'd ask it) and a **spoken answer** (2–5 paragraphs, same tone as the playbook).
3. Focus on: clarifications, "why", trade-offs, metrics proof, and "what would you do differently".
4. Skip generic fluff ("Tell me more about teamwork") unless it's clearly relevant to that parent question.

Output **only** valid JSON in this shape (no markdown fences):

```json
{
  "entries": [
    {
      "matchQuestion": "Exact parent question text from playbook",
      "followUps": [
        { "question": "...", "answer": "..." }
      ]
    }
  ]
}
```

Start with Part 1 motivation questions (Tell me about yourself, Why Questrade, Why leave Arc'teryx), then continue through the rest in batches of 10 parent questions per reply.

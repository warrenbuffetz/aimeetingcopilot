# Questrade GPT review packs

Regenerate after library changes:

```bash
npm run export:questrade-library
npm run export:questrade:gpt-review
```

## Files

| File | Best for |
|------|----------|
| `questrade-gpt-review-pack.md` | Upload to ChatGPT — readable tone pass on all **active** answers |
| `questrade-gpt-review-pack.json` | Structured review, scripts, or Custom GPT with JSON knowledge |
| `exports/questrade_interview_library.json` | Full system export (embeddings metadata, relationships) |

## Suggested ChatGPT prompt (tone)

```
You are reviewing my Questrade Senior PM interview answer library for TONE only.

Rules:
- Do not invent metrics, employers, or experiments.
- Flag anything that sounds AI-smooth, overly formal, or unlike a senior PM speaking in an interview.
- Note inconsistent tense (especially Arc'teryx current-employment rehearsal).
- Respect evidenceStatus on each row; do not suggest claiming unverified_detail as fact.
- Output: table with id, question (short), issue, suggested micro-edit (optional), priority P0/P1/P2.

[Paste or attach the pack]
```

Optional: `node scripts/generate-questrade-gpt-review-pack.mjs --include-inactive` appends archived rows list.

# ChatGPT prompt — shared library & profile customization

Attach **one or more** of:

- `data/review/career-motivation-profile-alignment.md` (regenerate: `npm run generate:career-alignment`)
- Pasted rows from `imports/simplii_final_qa.json` and/or `exports/questrade_interview_library.json`
- `data/review/simplii-specific-questions-and-answers.md` for Simplii-only JD questions

---

## Copy-paste prompt

```
You are helping me organize a **shared interview answer library** across two employer profiles:

1. **Questrade** — Senior PM, Everyday Banking (Questbank / everyday banking)
2. **Simplii Financial** — Senior Product Manager (digital banking, squad-embedded PM)

## Content model (non-negotiable)

- **Default:** One shared answer for experience, leadership, behavioural, product craft, and banking cases—unless the *question itself* is employer-specific.
- **Profile-specific rows** only when the question or full answer is genuinely about *this* employer or *this* role/JD (e.g. “Why Questrade?”, “Why Simplii Financial?”, “Why qualified for Simplii chequing?”, Simplii-named JD hypotheticals).
- **Customization pattern for near-duplicates:** Prefer a **shared spoken body** + **employer-specific closing** (1–3 sentences), not two fully rewritten essays.
- **Do not invent** employers, metrics, launches, team sizes, or regulatory claims. If evidence is unclear, flag “verify before interview” and keep wording cautious.
- **Do not** merge questions that have different intent (e.g. “Why leave Arc’teryx?” vs “Why Simplii?” are related but not identical—treat as a pair with shared middle + different bookends).

## Metadata you should recommend per row

For each question pair (or single question), output a recommendation using these fields:

| Field | Values | Meaning |
|-------|--------|---------|
| `strategy` | `shared` \| `shared_body_plus_closing` \| `split_profile_exclusive` \| `simplii_only` \| `questrade_only` | How to store it |
| `profileExclusive` | `questrade` \| `simplii` \| null | Only when entire row is job-specific |
| `employerClosing.questrade` | text or empty | Closing paragraph for Questrade |
| `employerClosing.simplii` | text or empty | Closing paragraph for Simplii |
| `canonicalQuestion` | string | Shared question text if unified; else note two variants |
| `customizationLevel` | `none` \| `closing_only` \| `question_wording` \| `full_answer` | Where human edit is needed |

Import contract: answers can use `{{EMPLOYER_CLOSE}}` in the body where the closing should be substituted.

## Your tasks

1. **Classify** every row I provide:
   - Is the *question* employer-specific? (names Simplii/Questrade/Questbank or “this role” tied to one JD)
   - Are the two answers (if paired) **substantively the same** except employer framing, or **materially different**?

2. **Propose a library structure:**
   - Group: Career & motivation | Experience deep dives | Leadership | Banking cases | Logistics
   - Within each group, list **shared canonical IDs** (suggest a stable `shared-*` slug) and which profile-specific variants hang off them.

3. **For each row or pair, produce one line in a table:**

| Priority | strategy | customizationLevel | Simplii question | Questrade question | simplii externalId (if any) | Questrade UUID (if any) | What to customize | Draft employerClosing (Simplii) | Draft employerClosing (Questrade) | Risks / verify |

   - **Priority:** P0 = recruiter opener / why company / TMAY; P1 = common follow-ups; P2 = rest.
   - **What to customize:** Be specific (“replace Questbank with Simplii in Q only”; “rewrite last paragraph”; “keep 100% shared”).

4. **Deduplication plan:** Call out rows that are duplicate maintenance today and should become one shared row with closings.

5. **Do not rewrite full answers** unless I ask in a follow-up. This pass is **organization and customization map** only.

## Employer voice (for closings only)

- Questrade: everyday banking, Questbank, investing-to-banking, primary account, measured growth.
- Simplii: established digital bank, squad PM, discovery/stories/acceptance criteria, chequing/everyday banking, CIBC heritage without over-selling.

Start by summarizing how many rows fall into each `strategy` bucket, then output the table for **P0 items first**, then ask if I want P1/P2 in the same format.
```

---

## Optional follow-up prompts

**Draft closings only (after the table):**

```
For rows marked `shared_body_plus_closing`, draft only the two employerClosing paragraphs (spoken interview tone, 2–4 sentences each). I will paste the shared body separately—do not repeat it.
```

**Produce import JSON patch:**

```
For these externalIds: [list]. Output JSON fragments I can merge into imports/simplii_final_qa.json: `employerClosing`, `profileExclusive`, and `answer` with `{{EMPLOYER_CLOSE}}` where appropriate. Preserve all other fields; valid per interview_qa_import schema v1.0.0.
```

**Expand beyond career/motivation:**

```
Same rules as the shared-library prompt, but include all `product_experience` and `leadership_behavioural` rows where Simplii and Questrade share the same canonicalQuestion or sourceQuestradeRecordId. Flag any answer that mentions the wrong employer in the body (needs neutral rewrite + closing).
```

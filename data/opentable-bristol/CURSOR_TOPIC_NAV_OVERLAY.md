# Cursor task — Bristol Topics: compact keyword labels + within-section P1/P2

## Request
Apply the accompanying `bristol-topic-navigation-overlay.json` to the existing **OpenTable — Bristol (Focused)** profile only. This is a **non-destructive sidebar navigation patch** that restores the compact, keyword-first look from the original Questrade profile while refining relative question importance **within each existing Topics accordion**.

The interview is a **45-minute hiring-manager call with Bristol Lewis (Group Product Manager)**. The source ranking considers her TMS roadmap/table automation experience, strategic prioritization and analytics background, Susana's recruiter discussion, and the AI/ML-oriented job description. These are judgment-based estimates, not predictions with validated probabilities.

## Preserve, exactly
- Top navigation: **Answers**, **Experience Maps**, **Battlecard**.
- Answer sidebar: **Search**, **Recently Viewed**, **Most Likely (10)**, **Next Most Likely (12)**, **Topics**, **Experiences**, **Questions for Bristol (7)**.
- Existing **Topics** and **Experiences** subtabs; all nine Topics categories, existing accordion mechanics and current ordering of the categories.
- All **111 existing questions and reference rows**, answer bodies, IDs, citations/evidence labels, follow-ups, and cross-links. No duplicates or deletions.
- Questrade/Simplii profiles; canonical shared library/resolver; profile-specific overrides.
- The `Bristol_HM_Ranking_Patch_v2` **Most Likely top 10** and **Next Most Likely 12** membership and order; these are independent of the per-category P1/P2 ranking.
- Existing manual pins and Recently Viewed functionality.
- Existing question full titles must remain available in the answer header; do not replace canonical question text with the keyword label.

## Apply new per-question sidebar metadata
For each entry in overlay `records[]`, match on stable `questionId` (the existing `curatedKey`, *not* array index or mutable title).

- `shortLabel`: replace **only** the compact list-row text shown inside **Topics**. This must also be searchable. The full question remains unchanged everywhere else.
- `sectionTier`: render a small plain P1 / P2 label on question rows in Topics. For `REF` entries, display a neutral reference indicator such as `REF` or the existing book/reference styling, not P1/P2.
- `sectionOrder`: order questions *within their current category* by this field (P1 first, P2 second, REF last); do not move questions across categories. Preserve the category counts.
- `searchAliasesAdd`: **merge** into existing aliases/search index, case-insensitively and without duplicates. Do not replace the existing aliases.

Use separate fields such as `bristolSectionTier`, `bristolShortLabel`, `bristolSectionOrder`, and `bristolSearchAliases` as needed. **Do not overwrite** the existing numeric `priority` (`0/1/2`), `suggestedPinned`, `hiringManagerTier`, or `hiringManagerRank` fields, as these serve different purposes.

## Interpretation of section P1/P2
- **P1**: the first, most relevant items to scan *within that topic* for Bristol's hiring-manager discussion.
- **P2**: reasonable follow-ups / deeper preparation, still fully reachable.
- **REF**: reference concepts/experiment cheat sheets, not literal questions, so no likelihood score.

The **Live Product Scenarios** category is practice-oriented: P1 there means the most useful scenarios to rehearse, **not** that Bristol is likely to ask that exact hypothetical. Do not promote all category P1 questions to the global Most Likely list.

## Search behavior
Ensure the global search matches all of the following:
1. Original full question text (`title`/equivalent).
2. Compact `shortLabel`.
3. Previous aliases and the new `searchAliasesAdd`.
4. Related question follow-ups.
5. Existing answer-body search if already supported.

Normalize punctuation, casing, repeated spaces and common abbreviations when practical; **do not break the existing search behavior**. Deduplicate results by existing question ID. Prefer exact compact-label and alias matches over incidental matches in long answer bodies. Results open the same pre-existing answer record.

### Acceptance-test search strings
- `pushback` should surface **Engineering disagreement (B49)** and/or **Global AI pushback (B65)**; other relevant leadership records may also appear.
- `RBC Interac` should open **B40**, not the wrong mapped answer.
- `two servers` or `staffing` should surface **SC11**.
- `global TMS` or `localization` should surface **B61**.
- `no show` should surface no-show scenarios, economics, and experiment references.
- `north star` should surface **B28**.
- `ML vs rules` should surface **B18**.
- `RevPASH` should surface **B-R04**.
- `incrementality` should surface **IP12**, **B30**, and related records.
- `why opentable` should surface **B02**.

## UI expectations
Use the Questrade sidebar pattern shown by the user: compact keyword-first rows with an understated P1/P2 marker, fitting narrow desktop panels without constant truncation. The overlay contains labels of **28 characters or fewer**. Full titles should be available on open and optionally by hover tooltip.

Do not create additional top-level categories, a duplicate Scenario Drills section, or a separate Full Library tab. **Topics** remains the complete library index. **Experiences** remains its existing distinct index.

## Validation
1. Overlay keys resolve one-to-one to exactly 111 existing Bristol questions.
2. Category counts remain `9, 13, 13, 14, 10, 17, 15, 9, 11` in current order.
3. P1 count=35, P2 count=56, REF count=20.
4. Compact labels are unique *within each category* and at most 28 characters.
5. Most Likely=10 and Next Most Likely=12 with existing IDs/order unchanged.
6. No answer bodies, canonical mappings, existing IDs, or other employer profiles change.
7. Existing Topics and Experiences navigation, Experience Maps, Battlecard, Recently Viewed, and Questions for Bristol still work.
8. Search checks above resolve to the existing correct question IDs.
9. Run available build/tests and report exceptions. If runtime architecture differs, adapt the display layer; do not silently alter the library schema in a destructive way.

## Return
Summarize which UI files were changed, how this overlay was loaded, confirmation that content/data were preserved, and test results. Avoid unrelated refactoring.

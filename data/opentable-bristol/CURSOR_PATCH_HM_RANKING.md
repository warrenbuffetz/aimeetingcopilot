# Cursor task — Bristol sidebar ranking ONLY (v2)

## Goal
In the existing **OpenTable — Bristol (Focused)** interview profile, reduce only the currently overpopulated **Most Likely** quick-access list and add a collapsed **Next Most Likely** list. This is a narrow UI/metadata patch, **NOT** a restructuring of the answer library or navigation.

## Required sidebar sequence
1. **Search** — unchanged.
2. **Recently Viewed** — unchanged, preserving its existing functionality and placement.
3. **Most Likely — Top 10** — display exactly the ten question IDs from `bristol-hm-ranking.json` → `uiBuckets.mostLikely`, in that order. Show a concise question label and allow opening the existing answer. Do not automatically add all P0 questions, pins, recently viewed questions, or other records.
4. **Next Most Likely (12)** — an accordion directly beneath Most Likely, **collapsed by default**, populated in the exact order of `uiBuckets.nextMostLikely`. Use the same existing answer-opening interaction. Keep the full set searchable elsewhere.
5. **Topics** — preserve the existing Topics tab/section, every category accordion, category order, question count, 111 library entries, aliases, existing scenario questions, and all navigation behavior. This must NOT be replaced with a Full Library or Scenario Drills section.
6. **Experiences** — preserve the existing Experiences tab/section and maps, links, content, and behavior exactly as they are.
7. **Questions for Bristol (7)** — preserve as is.

Preserve the top navigation tabs (**Answers**, **Experience Maps**, **Battlecard**) as is. Preserve both existing **Topics** and **Experiences** subtabs at the bottom of the sidebar. Preserve manual pinning and the current search mechanism.

## Important distinction
- **Interview-likelihood ranking** is distinct from `priority`, `P0/P1/P2`, `suggestedPinned`, and Recently Viewed. Those other fields should remain intact and must not populate Most Likely automatically.
- Use existing IDs; do not duplicate answers or create shadow questions.
- `uiBuckets.scenarioDrills` in the ranking JSON is optional preparation metadata **only**. **Do not create a new Scenario Drills sidebar section.** Scenarios continue to appear under **Topics → Live Product Scenarios**.
- The ranking is reasoned preparation for a **45-minute hiring-manager conversation with Bristol Lewis**, not a confirmed script or a probabilistic model.

## Scope restrictions
Change only the Bristol profile's ranking metadata and the logic/presentation of those two quick-access lists (Most Likely and Next Most Likely). Do NOT edit or delete the question bodies, canonical answer records, question IDs, follow-ups, evidence labels, aliases, Stories, Experience Maps, Topics, Battlecard, Questrade, or Simplii profiles. Do NOT alter category names or counts. Do NOT change existing answer resolver behavior.

## Validation and acceptance criteria
- Exactly 10 questions appear in Most Likely, sorted by the array order in `uiBuckets.mostLikely`.
- Exactly 12 questions appear in the collapsed Next Most Likely accordion, in array order when expanded.
- Both sets link to existing questions by stable ID and have no overlapping question IDs.
- 111 original Bristol questions remain present and searchable under Topics; all existing category accordions remain intact.
- Experience Maps, the Experiences subtab, and Battlecard remain intact.
- Questions for Bristol (7) and Recently Viewed still work.
- No separate Scenario Drills sidebar section is added.
- No Questrade/Simplii records, canonical answers, or content are modified.
- Run appropriate build / UI tests and report any deviation.

Please make this minimal, localized change only.

# Story Map (Navigator MAP tab)

## UI

- **Tab order:** Next | Experiences | **Map** | All Answers
- **Component:** `apps/web/src/components/live/story-map-panel.tsx`
- **Wiring:** `apps/web/src/components/live/interview-navigator.tsx`
- Browse-only copy; **Active experience** pin hidden on Map (avoids accidental live context changes).
- Interview round on Map **re-ranks** only (label: “highlights only”); does not hide rows.
- Tab persisted in `sessionStorage` (`ic-live-navigator-tab`).

## Taxonomy (navigation layer)

- **Package:** `packages/shared/src/navigator/story-map/`
- **`taxonomy.ts`** — roots, topics, module ids, synthetic Arc'teryx / career buckets.
- **`build-index.ts`** — builds `StoryMapIndex` from catalog + profile; cross-links (e.g. RBC cashback → Banking → Money Movement) reference the **same row id**.
- No duplicate Q&A rows or embeddings.

## Profile filtering

- `isPreparedRowEligibleForProfile` + `isExperienceModuleEligibleForProfile` (Questbank vs digital-banking modules).
- `preparedAnswerForProfile` + `spokenAnswer` in preview display.

## Preview / main panel

- Uses `AnswerPreviewCard` with `onOpenInMainPanel(row, { fromBrowse: true })` — same path as Experiences / All Answers (no auto-analyze, respects answer lock).

## Search

- `storyMapSearch` — local token/substring match on eligible rows, deduped by id, profile-scoped.

## Tests

- `packages/shared/src/navigator/__tests__/story-map.test.ts`

## Unclassified rows

Run in devtools or a script:

```javascript
import { buildStoryMapIndex, storyMapUnclassifiedRows } from "@interview-copilot/shared";
```

After loading a profile catalog, log `storyMapUnclassifiedRows(index)` for rows not mapped to any topic (refine taxonomy if needed).

## Manual QA (screenshots)

Capture in Live with Simplii and Questrade profiles:

1. Map home — root category grid  
2. MAP → RBC → Cashback Withdrawals — key questions + intent groups  
3. Expanded answer preview with Open in main panel  

## Regression checklist

See product spec sections A–L; automated coverage for indexing, profile isolation, search dedupe, and shared row id across branches.

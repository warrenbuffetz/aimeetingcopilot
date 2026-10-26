/**
 * Semantic colour classes for /live — pair with CSS vars in globals.css (--ic-*).
 * Accents only; body text uses ic-answer / foreground.
 */
export const liveSemantic = {
  labelDetected: "text-ic-detected",
  labelLibrary: "text-ic-library",
  labelSuggested: "text-ic-suggested",
  labelAlternative: "text-ic-alternative",
  textAnswer: "text-ic-answer",
  blockDetected: "border-l-2 border-ic-detected/60 pl-3",
  surfaceLibrary:
    "rounded-md border border-ic-library/25 bg-ic-library-surface px-2.5 py-2",
  surfaceSuggested:
    "rounded-md border border-ic-suggested/20 bg-ic-suggested-surface",
  surfaceAlternative:
    "rounded-md border border-ic-alternative/30 bg-ic-alternative-surface",
  transcriptQuestion: "border border-ic-detected/35 bg-ic-detected-surface",
  transcriptSelected: "ring-1 ring-ic-detected/50 bg-ic-detected-surface",
  conceptLink: "hover:bg-ic-detected-surface decoration-ic-detected/70",
  mapTitle: "text-ic-detected",
  navTabNextActive: "border-ic-suggested text-foreground",
} as const;

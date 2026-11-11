/** Banking-first segments from the cheat sheet — optimized for live “pick one user” answers. */

export type UserSegmentChip = {
  id: string;
  label: string;
  speakLine: string;
  banking: boolean;
};

export const BANKING_USER_SEGMENT_CHIPS: UserSegmentChip[] = [
  {
    id: "new-applicant",
    label: "New applicant",
    speakLine: "I'd focus on new applicants who are considering Questbank but haven't funded yet.",
    banking: true,
  },
  {
    id: "newly-activated",
    label: "Newly activated",
    speakLine: "I'd focus on newly activated customers who reached first value but haven't deepened usage.",
    banking: true,
  },
  {
    id: "payroll-switcher",
    label: "Payroll switcher",
    speakLine:
      "I'd focus on customers who opened Questbank but haven't moved payroll or recurring deposits yet.",
    banking: true,
  },
  {
    id: "secondary-account",
    label: "Secondary-account user",
    speakLine: "I'd focus on secondary-account users who still do most banking elsewhere.",
    banking: true,
  },
  {
    id: "primary-candidate",
    label: "Primary-banking candidate",
    speakLine:
      "I'd focus on customers with recurring inflows who could meet a primary-banking threshold.",
    banking: true,
  },
  {
    id: "dormant",
    label: "Dormant account",
    speakLine: "I'd focus on dormant accounts that funded once but stopped transacting.",
    banking: true,
  },
  {
    id: "multi-bank",
    label: "Multi-bank relationship",
    speakLine: "I'd focus on customers splitting activity across several financial institutions.",
    banking: true,
  },
  {
    id: "family",
    label: "Family / shared finances",
    speakLine: "I'd focus on families managing shared bills and visibility across accounts.",
    banking: true,
  },
  {
    id: "vulnerable",
    label: "Financially vulnerable",
    speakLine:
      "I'd focus on financially vulnerable customers where errors, fees, or unclear status carry higher harm.",
    banking: true,
  },
];

export const GENERIC_USER_SEGMENT_CHIPS: UserSegmentChip[] = [
  {
    id: "first-time",
    label: "First-time user",
    speakLine: "I'd focus on first-time users who need more guidance before first value.",
    banking: false,
  },
  {
    id: "power-user",
    label: "Power user",
    speakLine: "I'd focus on power users where small efficiency gains compound.",
    banking: false,
  },
  {
    id: "low-engagement",
    label: "Low engagement",
    speakLine: "I'd focus on low-engagement users who need a clearer reason to return.",
    banking: false,
  },
];

export const PRODUCT_SENSE_SEGMENT_STORAGE_KEY = "ic-jaz-product-sense-user-segment";

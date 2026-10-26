/** Live workspace column sizing (px). */
export const LIVE_RAW_TRANSCRIPT_WIDTH = 240;
export const LIVE_DETECTED_QUESTIONS_WIDTH = 260;
export const LIVE_NAVIGATOR_WIDTH = 320;
export const LIVE_MIN_ANSWER_WIDTH = 550;
const RESIZE_HANDLE_TOTAL = 36;

export type LiveWorkspaceLayout = {
  fitsFourColumns: boolean;
  fitsQuestionsColumn: boolean;
  minAnswerWidth: number;
};

export function computeLiveWorkspaceLayout(workspaceWidth: number): LiveWorkspaceLayout {
  const minFour =
    LIVE_RAW_TRANSCRIPT_WIDTH +
    LIVE_DETECTED_QUESTIONS_WIDTH +
    LIVE_MIN_ANSWER_WIDTH +
    LIVE_NAVIGATOR_WIDTH +
    RESIZE_HANDLE_TOTAL;
  const minThree =
    LIVE_DETECTED_QUESTIONS_WIDTH + LIVE_MIN_ANSWER_WIDTH + LIVE_NAVIGATOR_WIDTH + RESIZE_HANDLE_TOTAL - 12;
  return {
    fitsFourColumns: workspaceWidth >= minFour,
    fitsQuestionsColumn: workspaceWidth >= minThree,
    minAnswerWidth: LIVE_MIN_ANSWER_WIDTH,
  };
}

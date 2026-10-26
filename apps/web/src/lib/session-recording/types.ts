export type SessionRecordingSourceMode = "microphone" | "meeting-tab" | "microphone-and-meeting";

export type SessionRecordingPhase = "idle" | "recording" | "paused" | "stopped" | "error";

export type ActiveCaptureSources = {
  microphone: boolean;
  meeting: boolean;
};

export const SESSION_RECORDING_TIMESLICE_MS = 10_000;
export const SESSION_RECORDING_BITRATE = 96_000;

export const RECORDING_REFRESH_WARNING =
  "A session recording is in progress. Leaving or refreshing this tab may lose audio that has not been downloaded yet.";

export const RECORDING_CONSENT_REMINDER =
  "You are responsible for informing participants and complying with meeting rules before recording.";

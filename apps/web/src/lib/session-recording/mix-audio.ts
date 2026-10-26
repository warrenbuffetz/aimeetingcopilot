import type { ActiveCaptureSources } from "./types";

export type SttCaptureSource = "none" | "display" | "microphone" | "both";

export type RecordingAcquireResult = {
  /** Stream fed to MediaRecorder (mixed when needed). */
  recordingStream: MediaStream;
  sourcesActive: ActiveCaptureSources;
  warning: string | null;
  /** Stop only tracks opened for this recording — never STT-borrowed tracks. */
  release: () => void;
};

function disableVideoTracks(stream: MediaStream) {
  for (const t of stream.getVideoTracks()) {
    t.enabled = false;
  }
}

async function openMicrophone(deviceId?: string): Promise<MediaStream> {
  const audio: boolean | MediaTrackConstraints = deviceId
    ? { deviceId: { exact: deviceId } }
    : true;
  return navigator.mediaDevices.getUserMedia({ audio, video: false });
}

async function openMeetingTabAudio(): Promise<{ stream: MediaStream; hasAudio: boolean }> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  disableVideoTracks(stream);
  const hasAudio = stream.getAudioTracks().length > 0;
  return { stream, hasAudio };
}

function borrowMicFromStt(sttStream: MediaStream | null, sttSource: SttCaptureSource): MediaStream | null {
  if (!sttStream) return null;
  if (sttSource !== "microphone" && sttSource !== "both") return null;
  if (!sttStream.getAudioTracks().length) return null;
  return sttStream;
}

function borrowMeetingFromStt(sttStream: MediaStream | null, sttSource: SttCaptureSource): MediaStream | null {
  if (!sttStream) return null;
  if (sttSource !== "display" && sttSource !== "both") return null;
  if (!sttStream.getAudioTracks().length) return null;
  return sttStream;
}

/**
 * Build a single audio-only recording stream. Reuses STT capture when possible to avoid duplicate mics.
 */
export async function acquireRecordingStream(options: {
  mode: "microphone" | "meeting-tab" | "microphone-and-meeting";
  micDeviceId?: string;
  sttStream: MediaStream | null;
  sttSource: SttCaptureSource;
}): Promise<RecordingAcquireResult> {
  const ownedTracks: MediaStreamTrack[] = [];
  const warnings: string[] = [];

  let micStream: MediaStream | null = null;
  let meetingStream: MediaStream | null = null;

  const needMic = options.mode === "microphone" || options.mode === "microphone-and-meeting";
  const needMeeting = options.mode === "meeting-tab" || options.mode === "microphone-and-meeting";

  if (needMic) {
    const borrowed = borrowMicFromStt(options.sttStream, options.sttSource);
    if (borrowed) {
      micStream = borrowed;
    } else {
      const opened = await openMicrophone(options.micDeviceId);
      ownedTracks.push(...opened.getAudioTracks());
      micStream = opened;
    }
  }

  if (needMeeting) {
    const borrowed = borrowMeetingFromStt(options.sttStream, options.sttSource);
    if (borrowed) {
      meetingStream = borrowed;
    } else {
      const { stream, hasAudio } = await openMeetingTabAudio();
      ownedTracks.push(...stream.getTracks());
      if (!hasAudio) {
        warnings.push(
          "No meeting audio track was shared. Share a browser tab with audio checked, or use microphone-only recording."
        );
      }
      meetingStream = stream;
    }
  }

  const sourcesActive: ActiveCaptureSources = {
    microphone: Boolean(micStream?.getAudioTracks().some((t) => t.readyState === "live")),
    meeting: Boolean(meetingStream?.getAudioTracks().some((t) => t.readyState === "live")),
  };

  if (options.mode === "meeting-tab" && !sourcesActive.meeting) {
    ownedTracks.forEach((t) => t.stop());
    throw new Error(
      "Meeting audio is not available. Pick a browser tab and enable “Share tab audio”, or record microphone only."
    );
  }

  if (options.mode === "microphone-and-meeting" && !sourcesActive.meeting && sourcesActive.microphone) {
    warnings.push("Meeting audio unavailable — recording microphone only.");
  }

  if (options.mode === "microphone" && !sourcesActive.microphone) {
    ownedTracks.forEach((t) => t.stop());
    throw new Error("Microphone is not available. Check permissions and device selection.");
  }

  const ctx = new AudioContext();
  await ctx.resume();
  const destination = ctx.createMediaStreamDestination();

  const nodes: MediaStreamAudioSourceNode[] = [];
  if (micStream && sourcesActive.microphone) {
    const node = ctx.createMediaStreamSource(micStream);
    node.connect(destination);
    nodes.push(node);
  }
  if (meetingStream && sourcesActive.meeting) {
    const node = ctx.createMediaStreamSource(meetingStream);
    node.connect(destination);
    nodes.push(node);
  }

  const release = () => {
    for (const n of nodes) {
      try {
        n.disconnect();
      } catch {
        /* ignore */
      }
    }
    try {
      void ctx.close();
    } catch {
      /* ignore */
    }
    for (const t of ownedTracks) {
      try {
        t.stop();
      } catch {
        /* ignore */
      }
    }
  };

  return {
    recordingStream: destination.stream,
    sourcesActive,
    warning: warnings.length ? warnings.join(" ") : null,
    release,
  };
}

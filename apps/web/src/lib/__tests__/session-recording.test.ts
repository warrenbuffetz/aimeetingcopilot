import { describe, expect, it } from "vitest";
import { assembleRecordingBlob, formatBytes, formatDuration } from "@/lib/session-recording/blob";
import { formatRecordingFilename, profileSlugForFilename } from "@/lib/session-recording/filename";
import { pickSessionRecorderMimeType } from "@/lib/session-recording/mime";
import {
  RECORDING_REFRESH_WARNING,
  SESSION_RECORDING_BITRATE,
  SESSION_RECORDING_TIMESLICE_MS,
} from "@/lib/session-recording/types";

describe("session recording — mime & filename", () => {
  it("prefers opus webm when supported", () => {
    expect(
      pickSessionRecorderMimeType((m) => m === "audio/webm;codecs=opus" || m === "audio/webm")
    ).toBe("audio/webm;codecs=opus");
  });

  it("falls back when opus unsupported", () => {
    expect(pickSessionRecorderMimeType((m) => m === "audio/webm")).toBe("audio/webm");
  });

  it("builds profile-based filename", () => {
    const name = formatRecordingFilename(
      "Questrade — Senior PM",
      new Date("2026-10-26T14:30:00"),
      "audio/webm;codecs=opus"
    );
    expect(name).toMatch(/^Questrade_Senior_PM_2026-10-26_1430\.webm$/);
  });

  it("slugifies profile names", () => {
    expect(profileSlugForFilename("A/B test")).toBe("AB_test");
  });
});

describe("session recording — blob assembly", () => {
  it("assembles chunks into one blob", () => {
    const a = new Blob(["a"], { type: "audio/webm" });
    const b = new Blob(["b"], { type: "audio/webm" });
    const out = assembleRecordingBlob([a, b], "audio/webm;codecs=opus");
    expect(out.size).toBe(a.size + b.size);
    expect(out.type).toContain("webm");
  });

  it("formats duration and bytes", () => {
    expect(formatDuration(125_000)).toBe("2:05");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("supports long session chunking interval", () => {
    expect(SESSION_RECORDING_TIMESLICE_MS).toBeGreaterThanOrEqual(5000);
    expect(SESSION_RECORDING_BITRATE).toBeGreaterThanOrEqual(64_000);
    expect(SESSION_RECORDING_BITRATE).toBeLessThanOrEqual(128_000);
  });
});

describe("session recording — privacy & storage", () => {
  it("warns before refresh during recording", () => {
    expect(RECORDING_REFRESH_WARNING).toMatch(/refresh/i);
  });

  it("download helper uses only local blob URLs (no fetch/upload)", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const text = fs.readFileSync(
      path.resolve(import.meta.dirname, "../session-recording/download.ts"),
      "utf8"
    );
    expect(text).not.toMatch(/\bfetch\s*\(/);
    expect(text).not.toMatch(/supabase|vercel|upload/i);
    expect(text).toMatch(/createObjectURL/);
  });
});

describe("session recording — STT independence (contract)", () => {
  it("recording module does not import live session or supabase", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const root = path.resolve(import.meta.dirname, "..");
    const files = [
      "session-recording/mix-audio.ts",
      "session-recording/chunk-store.ts",
      "session-recording/download.ts",
      "../hooks/use-session-recording.ts",
    ];
    for (const f of files) {
      const text = fs.readFileSync(path.join(root, f), "utf8");
      expect(text).not.toMatch(/supabase|use-live-session|transcribeChunk/i);
    }
  });
});

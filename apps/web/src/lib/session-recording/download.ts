import { extensionForMime } from "./mime";

export async function downloadRecordingFile(blob: Blob, filename: string): Promise<"save-picker" | "anchor"> {
  const ext = extensionForMime(blob.type);
  const pickerTypes = [
    {
      description: "Web audio recording",
      accept: { [blob.type || "audio/webm"]: [`.${ext}`] },
    },
  ];

  if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
    try {
      const handle = await (
        window as Window & {
          showSaveFilePicker: (opts: {
            suggestedName: string;
            types: typeof pickerTypes;
          }) => Promise<FileSystemFileHandle>;
        }
      ).showSaveFilePicker({
        suggestedName: filename,
        types: pickerTypes,
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return "save-picker";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        throw e;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return "anchor";
}

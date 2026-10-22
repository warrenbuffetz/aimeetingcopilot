import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("copilotDesktop", {
  openLiveApp: () => ipcRenderer.invoke("open-live-app"),
  toggleOverlay: () => ipcRenderer.invoke("toggle-overlay"),
  getWebUrl: () => ipcRenderer.invoke("get-web-url"),
  sendAudioChunk: (data: ArrayBuffer) => ipcRenderer.send("audio-chunk", data),
});

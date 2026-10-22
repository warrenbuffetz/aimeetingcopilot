import { app, BrowserWindow, ipcMain, desktopCapturer, session } from "electron";
import path from "path";
import { broadcastAudioChunk, startAudioRelay } from "./audio-relay";

const WEB_URL = process.env.INTERVIEW_COPILOT_URL ?? "http://localhost:3000";

let mainWindow: BrowserWindow | null = null;
let overlayWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 640,
    title: "Interview Copilot — Capture",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "capture.html"));
}

function createOverlay() {
  overlayWindow = new BrowserWindow({
    width: 480,
    height: 320,
    alwaysOnTop: true,
    frame: true,
    title: "Interview Copilot — Answers",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  overlayWindow.loadURL(`${WEB_URL}/live?compact=1`);
}

app.whenReady().then(() => {
  startAudioRelay();

  ipcMain.on("audio-chunk", (_event, data: ArrayBuffer) => {
    broadcastAudioChunk(Buffer.from(data));
  });

  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    const sources = await desktopCapturer.getSources({ types: ["screen", "window"] });
    const primary = sources[0];
    if (primary) {
      callback({ video: primary, audio: "loopback" as const });
    } else {
      callback({});
    }
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("open-live-app", () => {
  const w = new BrowserWindow({ width: 1200, height: 800 });
  w.loadURL(`${WEB_URL}/live`);
});

ipcMain.handle("toggle-overlay", () => {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
    return false;
  }
  createOverlay();
  return true;
});

ipcMain.handle("get-web-url", () => WEB_URL);

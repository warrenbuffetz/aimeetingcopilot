const DB_NAME = "interview-copilot-session-recording";
const DB_VERSION = 1;
const STORE = "chunks";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: ["sessionId", "index"] });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

export async function persistRecordingChunk(
  sessionId: string,
  index: number,
  blob: Blob
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error ?? new Error("chunk write failed"));
    tx.objectStore(STORE).put({ sessionId, index, blob, at: Date.now() });
  });
}

export async function loadRecordingChunks(sessionId: string): Promise<Blob[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onerror = () => reject(req.error ?? new Error("chunk read failed"));
    req.onsuccess = () => {
      const rows = (req.result as { sessionId: string; index: number; blob: Blob }[]).filter(
        (r) => r.sessionId === sessionId
      );
      rows.sort((a, b) => a.index - b.index);
      db.close();
      resolve(rows.map((r) => r.blob));
    };
  });
}

export async function clearRecordingSession(sessionId: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const rows = req.result as { sessionId: string; index: number }[];
      for (const row of rows) {
        if (row.sessionId === sessionId) {
          store.delete([row.sessionId, row.index]);
        }
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error ?? new Error("chunk clear failed"));
  });
}

#!/usr/bin/env node
/**
 * Stop stray Next dev servers so restarts don't leave a broken process on :3000.
 */
import { execSync } from "node:child_process";

const ports = [3000, 3001];

for (const port of ports) {
  try {
    const out = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
    if (!out) continue;
    for (const pid of out.split("\n").filter(Boolean)) {
      const n = Number(pid);
      try {
        process.kill(n, "SIGTERM");
        console.log(`Stopped PID ${n} on port ${port}`);
      } catch {
        /* already gone */
      }
    }
    execSync("sleep 0.4");
    try {
      const again = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
      for (const pid of again.split("\n").filter(Boolean)) {
        try {
          process.kill(Number(pid), "SIGKILL");
          console.log(`Force-stopped PID ${pid} on port ${port}`);
        } catch {
          /* already gone */
        }
      }
    } catch {
      /* port free */
    }
  } catch {
    /* nothing listening */
  }
}

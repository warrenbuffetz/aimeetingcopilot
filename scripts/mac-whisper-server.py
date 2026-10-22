#!/usr/bin/env python3
"""
Local Whisper STT for Interview Copilot (Mac). No cloud API.

Setup (once):
  brew install ffmpeg
  python3 -m venv .venv-whisper
  source .venv-whisper/bin/activate
  pip install -r scripts/requirements-whisper.txt

Run:
  python3 scripts/mac-whisper-server.py
  # or: npm run whisper:server

Env:
  WHISPER_PORT=8765
  WHISPER_MODEL=base.en   # tiny.en | base.en | small.en
"""
from __future__ import annotations

import cgi
import json
import os
import sys
import tempfile
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from faster_whisper import WhisperModel

MODEL: WhisperModel | None = None
MODEL_NAME = os.environ.get("WHISPER_MODEL", "base.en")
HOST = os.environ.get("WHISPER_HOST", "127.0.0.1")
PORT = int(os.environ.get("WHISPER_PORT", "8765"))


def load_model() -> "WhisperModel":
    global MODEL
    if MODEL is None:
        try:
            from faster_whisper import WhisperModel
        except ImportError:
            print(
                "Missing faster-whisper. Run:\n"
                "  python3 -m venv .venv-whisper && source .venv-whisper/bin/activate\n"
                "  pip install -r scripts/requirements-whisper.txt",
                file=sys.stderr,
            )
            raise
        device = os.environ.get("WHISPER_DEVICE", "cpu")
        compute = os.environ.get("WHISPER_COMPUTE", "int8")
        print(f"Loading Whisper model {MODEL_NAME} ({device}, {compute})…", flush=True)
        MODEL = WhisperModel(MODEL_NAME, device=device, compute_type=compute)
        print("Whisper ready.", flush=True)
    return MODEL


def transcribe_bytes(data: bytes, suffix: str = ".webm") -> str:
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        path = tmp.name
    try:
        model = load_model()
        segments, _info = model.transcribe(
            path,
            language="en",
            vad_filter=True,
            beam_size=1,
            best_of=1,
            condition_on_previous_text=False,
        )
        parts = [seg.text.strip() for seg in segments if seg.text.strip()]
        return " ".join(parts).strip()
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        if os.environ.get("WHISPER_QUIET") != "1":
            super().log_message(fmt, *args)

    def _send_json(self, code: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path.rstrip("/") == "/health":
            try:
                load_model()
                self._send_json(200, {"ok": True, "model": MODEL_NAME})
            except Exception as e:
                self._send_json(503, {"ok": False, "error": str(e)})
            return
        self.send_error(404)

    def do_POST(self) -> None:
        if self.path.rstrip("/") != "/transcribe":
            self.send_error(404)
            return

        ctype = self.headers.get("Content-Type", "")
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length) if length else b""

        audio = b""
        if "multipart/form-data" in ctype:
            environ = {
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": ctype,
                "CONTENT_LENGTH": str(len(raw)),
            }
            form = cgi.FieldStorage(fp=__import__("io").BytesIO(raw), environ=environ, headers=self.headers)
            if "audio" in form:
                audio = form["audio"].file.read() if form["audio"].file else b""
        else:
            audio = raw

        if not audio:
            self._send_json(400, {"error": "audio required"})
            return

        try:
            text = transcribe_bytes(audio)
            self._send_json(200, {"text": text, "isFinal": True})
        except Exception as e:
            msg = str(e)
            # Browser MediaRecorder often sends slices ffmpeg can't decode; treat as silence.
            if any(
                token in msg.lower()
                for token in ("invalid data", "decode", "could not find codec", "format not found")
            ):
                self._send_json(200, {"text": "", "isFinal": True})
                return
            self._send_json(500, {"error": msg})


def main() -> None:
    print(f"Local Whisper listening on http://{HOST}:{PORT}", flush=True)
    HTTPServer((HOST, PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()

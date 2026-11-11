#!/usr/bin/env python3
"""Rebuild questrade-jaz-interview-pack.json from hm-panel-authoritative-source.json."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/questrade-jaz/hm-panel-authoritative-source.json"
OUT = ROOT / "apps/web/src/data/questrade-jaz-interview-pack.json"

DEEP_DIVE_NAV: dict[str, tuple[str, str]] = {
    "DD01": ("DD1 · RBC Avion (Interac)", "DD1 · RBC Avion (Interac)"),
    "DD02": ("DD2 · Arc'teryx membership", "DD2 · Arc'teryx membership"),
    "DD03": ("DD3 · HBC growth & activation", "DD3 · HBC growth & activation"),
    "DD04": ("DD4 · HBC Neo onboarding", "DD4 · HBC Neo onboarding"),
    "DD05": ("DD5 · Aeroplan acquisition", "DD5 · Aeroplan acquisition"),
}

PANEL_NAV: dict[str, tuple[str, str]] = {
    "P01": ("Complex product (RBC Interac)", "Complex product (RBC Interac)"),
    "P02": ("Growth challenge (HBC portfolio)", "Growth challenge (HBC portfolio)"),
    "P03": ("Primary bank / direct deposit", "Primary bank / direct deposit"),
    "P04": ("Account overview & transactions", "Account overview & transactions"),
    "P05": ("Investigate activity drop", "Investigate activity drop"),
    "P06": ("Reliable money movement", "Reliable money movement"),
    "P07": ("Trade-off (Arc'teryx MVP)", "Trade-off (Arc'teryx MVP)"),
    "P08": ("Prioritize limited time", "Prioritize limited time"),
    "P09": ("Primary bank metrics", "Primary bank metrics"),
    "P10": ("Wrong hypothesis / launch snag", "Wrong hypothesis / launch snag"),
}

P02_DISCLAIMER = (
    "If asked for a concrete test, this is the type of example I'd prepare. "
    "The cohort and numbers below are illustrative rather than verified HBC campaign results."
)


def short_label(text: str, max_len: int = 56) -> str:
    t = re.sub(r"\s+", " ", text).strip()
    return (t[: max_len - 1] + "…") if len(t) > max_len else t


def first_paragraph(text: str, max_len: int = 600) -> str:
    parts = [p.strip() for p in text.split("\n\n") if p.strip()]
    return parts[0][:max_len] if parts else ""


def build_follow_up_ids(dd_key: str, index: int) -> str:
    return f"{dd_key}-F{index:02d}"


def panel_record(p: dict) -> dict:
    key = p["curatedKey"]
    title = p["title"]
    nav, short = PANEL_NAV.get(key, (title, short_label(title)))
    answer = p["answer"].strip()
    accuracy = p.get("accuracyNote") or "Authoritative HM panel script (user-verified)."
    if key == "P02" and P02_DISCLAIMER not in accuracy:
        accuracy = f"{accuracy} {P02_DISCLAIMER}".strip()

    rec = {
        "curatedKey": key,
        "title": title,
        "navigationLabel": nav,
        "shortLabel": short,
        "category": "Likely panel questions",
        "recordType": "panel",
        "answer": answer,
        "shortAnswer": first_paragraph(answer),
        "followUps": [
            {
                "id": f"{key}-F{i:02d}",
                "question": fu["question"].strip(),
                "answer": fu["answer"].strip(),
            }
            for i, fu in enumerate(p.get("followUps") or [], start=1)
        ],
        "priority": 1 if int(key[1:]) <= 7 else 2,
        "suggestedPinned": 3 <= int(key[1:]) <= 10,
        "aliases": [],
        "evidenceStatus": "mixed",
        "accuracyNote": accuracy,
        "linkedDeepDiveKey": p.get("linkedDeepDiveKey"),
    }
    return rec


def triggers_for_deep_dives(src: dict) -> dict[str, list[str]]:
    by_dd: dict[str, list[str]] = {}
    for t in src.get("questionTriggers") or []:
        dd = str(t.get("linkedDeepDiveKey") or "").strip()
        trigger = str(t.get("trigger") or "").strip()
        if dd and trigger:
            by_dd.setdefault(dd, []).append(trigger)
    for d in src.get("deepDives") or []:
        key = str(d.get("curatedKey") or "")
        for trigger in d.get("questionTriggers") or []:
            text = str(trigger).strip()
            if key and text and text not in by_dd.get(key, []):
                by_dd.setdefault(key, []).append(text)
    return by_dd


def deep_dive_record(d: dict, question_triggers: list[str] | None = None) -> dict:
    key = d["curatedKey"]
    title = d["title"]
    answer = d["reducedAnswer"].strip()
    nav, short = DEEP_DIVE_NAV.get(key, (title, short_label(title, 56)))
    triggers = [str(t).strip() for t in (question_triggers or d.get("questionTriggers") or []) if str(t).strip()]
    return {
        "curatedKey": key,
        "title": title,
        "navigationLabel": nav,
        "shortLabel": short,
        "category": "Experience",
        "recordType": "deep_dive",
        "questionTriggers": triggers,
        "answer": answer,
        "shortAnswer": first_paragraph(answer),
        "followUps": [
            {
                "id": build_follow_up_ids(key, i),
                "question": fu["question"].strip(),
                "answer": fu["answer"].strip(),
            }
            for i, fu in enumerate(d.get("followUps") or [], start=1)
        ],
        "priority": 1,
        "suggestedPinned": int(key[2:]) <= 2,
        "aliases": [],
        "evidenceStatus": "mixed",
        "accuracyNote": "Reduced spoken version only (full PDF narrative omitted).",
        "linkedDeepDiveKey": None,
    }


def main() -> None:
    if not SOURCE.is_file():
        print(f"Missing source: {SOURCE}", file=sys.stderr)
        sys.exit(1)
    src = json.loads(SOURCE.read_text())
    trigger_map = triggers_for_deep_dives(src)
    panels = [panel_record(p) for p in src["panels"]]
    dives = [deep_dive_record(d, trigger_map.get(d["curatedKey"], [])) for d in src["deepDives"]]

    meta = src.get("metadata") or {}
    follow_count = sum(len(d["followUps"]) for d in dives)
    trigger_count = sum(len(d.get("questionTriggers") or []) for d in dives)
    out = {
        "metadata": {
            "title": meta.get("title", "Questrade — Jaz (HM Panel)"),
            "purpose": meta.get(
                "purpose",
                "HM panel: authoritative panel scripts, reduced deep dives + follow-ups; triggers as cues on dives",
            ),
            "sourcePdf": meta.get("sourcePdf", "Questrade_-_Jaz.pdf"),
            "sourceAuthoritative": "data/questrade-jaz/hm-panel-authoritative-source.json",
            "version": meta.get("version", "2026-11-11"),
            "panelCount": len(panels),
            "deepDiveCount": len(dives),
            "questionTriggerCount": trigger_count,
            "followUpCount": follow_count,
        },
        "questions": panels + dives,
    }
    OUT.write_text(json.dumps(out, indent=2) + "\n")
    print(
        f"Wrote {OUT} — {len(panels)} panel, {len(dives)} dives, {trigger_count} question cues, "
        f"{follow_count} deep-dive follow-ups"
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Rebuild hm-panel-authoritative-source.json from questrade-jaz-interview-pack.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "apps/web/src/data/questrade-jaz-interview-pack.json"
SOURCE = ROOT / "data/questrade-jaz/hm-panel-authoritative-source.json"

TITLE_PATCHES = {
    "P04": "Design an account overview or transaction history experience that helps customers understand their money",
    "P05": "Transaction activity or direct deposit adoption has dropped. How would you investigate?",
    "P06": "Explain how you would design a reliable money-movement experience, including pending, failed and completed states",
    "P08": "How would you prioritize features when the team has limited time and several competing opportunities?",
    "P10": "Describe a time your initial hypothesis was wrong or a launch encountered an unexpected problem",
}

LINK_PATCHES = {
    "P02": "DD03",
    "P07": "DD02",
    "P10": "DD02",
}

P10_APPENDIX_MARKER = "\n\nDeep dive 1"


def main() -> None:
    pack = json.loads(PACK.read_text())
    questions = pack["questions"]

    panels = []
    for q in questions:
        if q["recordType"] != "panel":
            continue
        key = q["curatedKey"]
        answer = q["answer"]
        if key == "P10" and P10_APPENDIX_MARKER in answer:
            answer = answer.split(P10_APPENDIX_MARKER, 1)[0].strip()
        panels.append(
            {
                "curatedKey": key,
                "title": TITLE_PATCHES.get(key, q["title"]),
                "answer": answer,
                "followUps": [
                    {"question": fu["question"], "answer": fu["answer"]}
                    for fu in q.get("followUps") or []
                ],
                "linkedDeepDiveKey": LINK_PATCHES.get(key, q.get("linkedDeepDiveKey")),
                "accuracyNote": q.get("accuracyNote"),
            }
        )

    deep_dives = []
    triggers = []
    for q in questions:
        if q["recordType"] != "deep_dive":
            continue
        dd_triggers = [str(t).strip() for t in (q.get("questionTriggers") or []) if str(t).strip()]
        deep_dives.append(
            {
                "curatedKey": q["curatedKey"],
                "title": q["title"],
                "reducedAnswer": q["answer"],
                "questionTriggers": dd_triggers,
                "followUps": [
                    {"question": fu["question"], "answer": fu["answer"]}
                    for fu in q.get("followUps") or []
                ],
            }
        )
        for trigger in dd_triggers:
            triggers.append({"linkedDeepDiveKey": q["curatedKey"], "trigger": trigger})

    meta = pack.get("metadata") or {}
    out = {
        "metadata": {
            "title": meta.get("title", "Questrade — Jaz (HM Panel)"),
            "purpose": "Authoritative user-pasted HM panel + reduced deep dives",
            "sourcePdf": meta.get("sourcePdf", "Questrade_-_Jaz.pdf"),
            "version": meta.get("version", "2026-11-11"),
        },
        "panels": panels,
        "deepDives": deep_dives,
        "questionTriggers": triggers,
    }
    SOURCE.write_text(json.dumps(out, indent=2) + "\n")
    print(f"Wrote {SOURCE} ({len(panels)} panels, {len(deep_dives)} dives, {len(triggers)} triggers)")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""One-time maintainer: parse hm-panel-authoritative-paste.txt → source JSON."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PASTE = ROOT / "data/questrade-jaz/hm-panel-authoritative-paste.txt"
OUT = ROOT / "data/questrade-jaz/hm-panel-authoritative-source.json"

OFFICIAL_PANEL_TITLES = {
    1: "Walk us through a complex product you led from identifying the problem to launch and results",
    2: "Tell us about a growth challenge you owned. How did you identify the opportunity and measure success?",
    3: "How would you convince a Questrade customer to move their direct deposit and everyday banking to Questbank?",
    4: "Design an account overview or transaction history experience that helps customers understand their finances",
    5: "Transaction activity or direct deposit adoption has dropped. How would you investigate and act?",
    6: "Explain how you would design a reliable money-movement experience, including pending vs posted funds",
    7: "Tell us about a difficult technical or stakeholder trade-off you made during delivery",
    8: "How would you prioritize features when the team has limited time and several competing initiatives?",
    9: "What would you measure to determine whether Questbank is becoming a customer's primary bank?",
    10: "Describe a time your initial hypothesis was wrong or a launch encountered an unexpected constraint",
}

P02_DISCLAIMER = (
    "If asked for a concrete test, this is the type of example I'd prepare. "
    "The cohort and numbers below are illustrative rather than verified HBC campaign results."
)


def norm_block(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"-{10,}", "", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    lines = [ln.strip() for ln in text.split("\n")]
    paras: list[str] = []
    buf: list[str] = []
    for ln in lines:
        if not ln:
            if buf:
                paras.append(" ".join(buf))
                buf = []
            continue
        buf.append(ln)
    if buf:
        paras.append(" ".join(buf))
    text = "\n\n".join(paras)
    text = text.replace("money-movement product.>", "money-movement product.")
    return text.strip()


def extract_quoted_followup(block: str) -> tuple[str, dict | None]:
    """Pull trailing quoted Q/A pair (P01 timeout) into follow-up struct."""
    m = re.search(
        r'\n\n"([^"]+)"\s*\n\n"([^"]+)"\s*$',
        block,
        re.S,
    )
    if not m:
        return block, None
    main = block[: m.start()].strip()
    return main, {"question": m.group(1), "answer": m.group(2)}


def parse_panels(body: str) -> list[dict]:
    markers = list(
        re.finditer(r"(?m)^\s*(\d{1,2})\.\s+(.+?)\s*$", body[: body.find("Deep dive")])
    )
    panels = []
    for i, m in enumerate(markers):
        num = int(m.group(1))
        start = m.end()
        end = markers[i + 1].start() if i + 1 < len(markers) else len(body)
        raw = body[start:end]
        raw, p01_fu = extract_quoted_followup(raw) if num == 1 else (raw, None)
        answer = norm_block(raw)
        fu_list = []
        if p01_fu:
            fu_list.append(p01_fu)
        accuracy = "Authoritative HM panel script (user-verified)."
        if num == 2 and P02_DISCLAIMER in answer:
            accuracy = (
                f"Authoritative HM panel script (user-verified). {P02_DISCLAIMER}"
            )
        panels.append(
            {
                "curatedKey": f"P{num:02d}",
                "title": OFFICIAL_PANEL_TITLES[num],
                "answer": answer if num != 1 else norm_block(body[start:end]),
                "followUps": fu_list,
                "linkedDeepDiveKey": "DD01" if num == 1 else None,
                "accuracyNote": accuracy,
            }
        )
    # P01 uses full text including quoted follow-up in answer body
    for p in panels:
        if p["curatedKey"] == "P01":
            idx = int(p["curatedKey"][1:]) - 1
            m = markers[idx]
            p["answer"] = norm_block(body[m.end() : markers[idx + 1].start()])
    return panels


def parse_deep_dives(body: str) -> tuple[list[dict], list[dict]]:
    dive_hdr = list(re.finditer(r"Deep dive (\d+)\s*—\s*([^\n]+)", body))
    dives: list[dict] = []
    triggers: list[dict] = []
    for i, m in enumerate(dive_hdr):
        num = int(m.group(1))
        title = re.sub(r"\s+", " ", m.group(2).strip())
        start = m.start()
        end = dive_hdr[i + 1].start() if i + 1 < len(dive_hdr) else len(body)
        chunk = body[start:end]
        red_m = re.search(r"REDUCED\s*(.*?)(?=\d+\.\s*Follow-up\s*1:)", chunk, re.S)
        reduced = norm_block(red_m.group(1)) if red_m else ""
        fu_list = []
        for fm in re.finditer(
            r'\d+\.\s*Follow-up\s*\d+:\s*"([^"]+)"\s*\n+(.*?)(?=\n\d+\.\s*Follow-up\s*\d+:|\Z)',
            chunk,
            re.S,
        ):
            fu_list.append(
                {"question": fm.group(1).strip(), "answer": norm_block(fm.group(2))}
            )
        dives.append(
            {
                "curatedKey": f"DD{num:02d}",
                "title": title,
                "reducedAnswer": reduced,
                "followUps": fu_list,
            }
        )
        trig_m = re.search(
            r"Question triggers\s*\n+(.*?)(?:-{5,}\s*\n\s*REDUCED|\Z)",
            chunk,
            re.S,
        )
        if trig_m:
            for line in trig_m.group(1).split("\n"):
                t = line.strip()
                if len(t) > 8:
                    triggers.append({"linkedDeepDiveKey": f"DD{num:02d}", "trigger": t})
    return dives, triggers


def main() -> None:
    paste_path = Path(sys.argv[1]) if len(sys.argv) > 1 else PASTE
    if not paste_path.is_file():
        print(f"Missing paste: {paste_path}", file=sys.stderr)
        sys.exit(1)
    raw = paste_path.read_text()
    raw = re.sub(r"^I am copying and pasting[^\n]+\n\n", "", raw, count=1)
    dives, triggers = parse_deep_dives(raw)
    panels = parse_panels(raw)
    out = {
        "metadata": {
            "title": "Questrade — Jaz (HM Panel)",
            "purpose": "Authoritative user-pasted HM panel + reduced deep dives",
            "sourcePdf": "Questrade_-_Jaz.pdf",
            "version": "2026-11-11",
        },
        "panels": panels,
        "deepDives": dives,
        "questionTriggers": triggers,
    }
    OUT.write_text(json.dumps(out, indent=2) + "\n")
    print(
        f"Wrote {OUT}: {len(panels)} panels, {len(dives)} dives, "
        f"{sum(len(d['followUps']) for d in dives)} follow-ups, {len(triggers)} triggers"
    )
    for d in dives:
        if len(d["followUps"]) != 5:
            print(f"WARN {d['curatedKey']}: {len(d['followUps'])} follow-ups", file=sys.stderr)


if __name__ == "__main__":
    main()

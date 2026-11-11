#!/usr/bin/env python3
"""Regenerate apps/web/src/data/questrade-jaz-interview-pack.json from Questrade_-_Jaz.pdf."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

try:
    import pypdf
except ImportError:
    print("Install pypdf: pip install pypdf", file=sys.stderr)
    raise

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "apps/web/src/data/questrade-jaz-interview-pack.json"

PANEL_TITLES = [
    "Walk us through a complex product you led from identifying the problem to launch and results",
    "Tell us about a growth challenge you owned. How did you identify the opportunity and measure success?",
    "How would you convince a Questrade customer to move their direct deposit and everyday banking to Questbank?",
    "Design an account overview or transaction history experience that helps customers understand their finances",
    "Transaction activity or direct deposit adoption has dropped. How would you investigate and act?",
    "Explain how you would design a reliable money-movement experience, including pending vs posted funds",
    "Tell us about a difficult technical or stakeholder trade-off you made during delivery",
    "How would you prioritize features when the team has limited time and several competing initiatives?",
    "What would you measure to determine whether Questbank is becoming a customer's primary bank?",
    "Describe a time your initial hypothesis was wrong or a launch encountered an unexpected constraint",
]

# 0-indexed PDF page groups (empirical mapping for this export)
PANEL_PAGE_GROUPS: dict[int, list[int]] = {
    1: [0, 1],
    2: [2],
    3: [4, 5],
    4: [6],
    5: [8],
    6: [10],
    7: [12],
    8: [14],
    9: [16],
    10: [18],
}

# Alternate interviewer phrasing before each reduced deep dive (PDF "Question triggers")
TRIGGER_TO_DEEP = [
    ("DD01", ["complex product", "technically difficult integration", "failure handling", "engineering, risk and operations", "consequential technical trade-off"]),
    ("DD02", ["zero-to-one", "prioritize when you can't build", "stakeholder disagreement", "build-versus-buy", "ambiguous vision", "executable roadmap"]),
    ("DD03", ["growth challenge", "opportunity using data", "meaningful experiment", "incremental growth", "hypothesis that didn't work"]),
    ("DD04", ["conversion or onboarding", "real customer problem", "journey you didn't fully own", "customer research", "conversion across different systems"]),
    ("DD05", ["managing multiple external partners", "acquisition at scale", "experiment with different results", "partner objectives", "prioritizing different customer journeys"]),
]

P01_OPENER = (
    "I'd answer this with the RBC Avion Interac cashback withdrawal story — it’s the clearest example "
    "of taking a product from problem definition through launch and measurable results.\n\n"
    "The customer flow looks simple, but it required coordinating rewards balances, enterprise payments, "
    "risk controls, and financial operations. Open Deep dive 1 (DD01 — RBC Avion) for the reduced spoken script "
    "and all five follow-ups from the interview pack."
)


def clean_page(text: str) -> str:
    text = re.sub(r"\n\s*Questrade - Jaz Page \d+\s*\n", "\n", text)
    text = re.sub(r"November 9, 2026[^\n]*\n", "", text)
    text = re.sub(r"^\d+\.\s+[^\n]+\n", "", text, count=1, flags=re.M)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n ", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def para_norm(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def extract_deep_dives(full: str) -> list[dict]:
    dives = []
    dive_matches = list(re.finditer(r"Deep dive (\d+)\s*—\s*([^\n]+)", full))
    reduced_blocks = re.split(r"-{5,}\s*REDUCED\s*", full)[1:6]

    for i, m in enumerate(dive_matches):
        dd = int(m.group(1))
        title = para_norm(m.group(2))
        reduced = clean_page(reduced_blocks[i].split("---")[0].split("Deep dive")[0]) if i < len(reduced_blocks) else ""
        start = m.start()
        end = dive_matches[i + 1].start() if i + 1 < len(dive_matches) else len(full)
        chunk = full[start:end]
        follow_ups = []
        for fm in re.finditer(
            r"(\d+)\.\s*Follow-up (\d+):\s*\"(.*?)\"\s*\n(.*?)(?=\n\d+\.\s*Follow-up |\n-{5,}\s*REDUCED|\n-{5,}\s*FULL|\nQuestion triggers|\Z)",
            chunk,
            re.S,
        ):
            a = clean_page(fm.group(4))
            if "Question triggers" in a:
                a = a.split("Question triggers")[0].strip()
            follow_ups.append(
                {
                    "id": f"DD{dd:02d}-F{int(fm.group(2)):02d}",
                    "question": para_norm(fm.group(3)),
                    "answer": a,
                }
            )
        dives.append(
            {
                "curatedKey": f"DD{dd:02d}",
                "title": title,
                "navigationLabel": title,
                "shortLabel": (title[:52] + "…") if len(title) > 53 else title,
                "category": "Experience deep dives",
                "recordType": "deep_dive",
                "answer": reduced,
                "shortAnswer": (reduced.split("\n\n")[0] if reduced else "")[:600],
                "followUps": follow_ups,
                "priority": 1,
                "suggestedPinned": dd <= 2,
                "aliases": [],
                "evidenceStatus": "mixed",
                "accuracyNote": "Reduced spoken version only (full PDF narrative omitted).",
            }
        )
    return dives


def extract_trigger_extras(full: str) -> list[dict]:
    """PDF 'Question triggers' bullets — alternate ways interviewers might open the same deep dive."""
    parts = re.split(r"Question triggers\s*\n", full)
    extras: list[dict] = []
    for block_i, chunk in enumerate(parts[1 : len(TRIGGER_TO_DEEP) + 1]):
        if block_i >= len(TRIGGER_TO_DEEP):
            break
        dd_key, _hints = TRIGGER_TO_DEEP[block_i]
        raw_bullets = re.split(r"•", chunk[:1200])
        for bi, raw in enumerate(raw_bullets):
            q = para_norm(raw)
            if len(q) < 12:
                continue
            extras.append(
                {
                    "curatedKey": f"X{len(extras) + 1:02d}",
                    "title": q,
                    "navigationLabel": q,
                    "shortLabel": (q[:56] + "…") if len(q) > 57 else q,
                    "category": "If they ask instead…",
                    "recordType": "alias",
                    "answer": f"This wording points to the same prepared material as {dd_key}. Use the reduced deep-dive script and follow-ups there.",
                    "shortAnswer": f"Same content as {dd_key}.",
                    "followUps": [],
                    "priority": 2,
                    "suggestedPinned": False,
                    "aliases": [q.lower(), dd_key],
                    "evidenceStatus": "navigation_only",
                    "accuracyNote": "Navigation alias from PDF Question triggers; not a separate spoken script.",
                    "linkedDeepDiveKey": dd_key,
                }
            )
    return extras


def panel_from_pages(reader: pypdf.PdfReader, pages: list[int]) -> str:
    return clean_page("\n\n".join((reader.pages[p].extract_text() or "") for p in pages))


def main() -> None:
    pdf_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not pdf_path or not pdf_path.is_file():
        print("Usage: python3 scripts/parse-questrade-jaz-interview-pdf.py /path/to/Questrade_-_Jaz.pdf", file=sys.stderr)
        sys.exit(1)

    reader = pypdf.PdfReader(str(pdf_path))
    full = "\n".join((p.extract_text() or "") for p in reader.pages)

    dives = extract_deep_dives(full)
    dives_by_key = {d["curatedKey"]: d for d in dives}
    extras = extract_trigger_extras(full)

    panels = []
    for i, title in enumerate(PANEL_TITLES, start=1):
        pages = PANEL_PAGE_GROUPS.get(i, [])
        body = panel_from_pages(reader, pages) if pages else ""
        if i == 1:
            ans = P01_OPENER
            short = P01_OPENER.split("\n\n")[0]
            fus: list = []
            linked = "DD01"
        else:
            ans = body if len(body.split()) > 80 else ""
            short = ans.split("\n\n")[0] if ans else ""
            fus = []
            linked = None
        if not ans and i != 1:
            ans = "(PDF extract empty — re-run parser or paste panel script manually.)"
            short = ans
        panels.append(
            {
                "curatedKey": f"P{i:02d}",
                "title": title,
                "navigationLabel": title,
                "shortLabel": (title[:56] + "…") if len(title) > 57 else title,
                "category": "Panel questions",
                "recordType": "panel",
                "answer": ans,
                "shortAnswer": short,
                "followUps": fus,
                "priority": 1 if i <= 7 else 2,
                "suggestedPinned": i <= 5,
                "aliases": [],
                "evidenceStatus": "mixed",
                "accuracyNote": "Panel prompt from Questrade HM PDF.",
                "linkedDeepDiveKey": linked,
            }
        )

    out = {
        "metadata": {
            "title": "Questrade — Jaz (HM Panel)",
            "purpose": "HM panel PDF: panel prompts, reduced deep dives + follow-ups, alternate phrasing aliases",
            "sourcePdf": pdf_path.name,
            "version": "2026-11-11",
            "panelCount": len(panels),
            "deepDiveCount": len(dives),
            "aliasCount": len(extras),
            "followUpCount": sum(len(q["followUps"]) for q in dives),
        },
        "questions": panels + dives + extras,
    }
    OUT.write_text(json.dumps(out, indent=2) + "\n")
    print(
        f"Wrote {OUT} — {len(panels)} panel, {len(dives)} dives, {len(extras)} aliases, "
        f"{out['metadata']['followUpCount']} follow-ups"
    )


if __name__ == "__main__":
    main()

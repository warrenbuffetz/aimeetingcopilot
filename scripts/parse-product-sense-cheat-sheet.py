#!/usr/bin/env python3
"""Parse Product Sense section from cheat sheet raw text into structured JSON."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data/questrade-jaz/product-sense-cheat-sheet-raw.txt"
OUT = ROOT / "apps/web/src/data/questrade-jaz-product-sense-cheat-sheet.json"


def chunk_table(lines: list[str], col_count: int) -> list[list[str]]:
    rows = []
    for i in range(0, len(lines) - (len(lines) % col_count), col_count):
        rows.append(lines[i : i + col_count])
    return rows


def chunk_pairs(lines: list[str], stop_prefixes: tuple[str, ...] = ()) -> list[list[str]]:
    rows: list[list[str]] = []
    i = 0
    while i + 1 < len(lines):
        left = lines[i]
        if left.startswith("C. Common product solutions"):
            break
        if any(left.startswith(p) for p in stop_prefixes):
            break
        if left in ("Solution lever", "Examples", "Dimension", "Common guardrails"):
            break
        rows.append([left, lines[i + 1]])
        i += 2
    return rows


def parse() -> dict:
    lines = [ln.strip() for ln in RAW.read_text().splitlines() if ln.strip()]
    # Intro
    framework_match = re.search(
        r"(Clarify → User → Problem → Solutions → Prioritize → Measure\.[^A]+)",
        " ".join(lines[2:4]),
    )
    intro_line = lines[2] if len(lines) > 2 else ""
    use_for = lines[1] if len(lines) > 1 else ""

    def slice_between(start_label: str, end_label: str | None) -> list[str]:
        try:
            start = lines.index(start_label) + 1
        except ValueError:
            return []
        if end_label is None:
            return lines[start:]
        try:
            end = lines.index(end_label)
        except ValueError:
            end = len(lines)
        return lines[start:end]

    # A: table after headers (skip 3 header cells)
    a_block = slice_between("A. Common customer problems", "Common customer segments")
    a_headers = a_block[:3]
    a_rows = chunk_table(a_block[3:], 3)

    segments = slice_between("Common customer segments", "B. Common success metrics and guardrails")

    # B objective table
    b_block = slice_between(
        "B. Common success metrics and guardrails",
        "Common metric types",
    )
    b_intro = []
    b_table_start = 0
    for i, ln in enumerate(b_block):
        if ln == "Objective":
            b_table_start = i
            break
        b_intro.append(ln)
    b_objective = chunk_table(b_block[b_table_start + 4 :], 4)  # skip Objective + 3 headers

    # B metric types
    mt_block = slice_between("Common metric types", "Universal guardrail checklist")
    metric_types = chunk_table(mt_block[2:], 2)

    # B guardrails (stop before banking callout / section C)
    gr_block = slice_between("Universal guardrail checklist", "C. Common product solutions")
    guardrails = chunk_pairs(gr_block[2:], stop_prefixes=("For a banking",))

    banking_note = ""
    for ln in gr_block:
        if "banking dashboard" in ln.lower():
            banking_note = ln
            break

    # C
    c_block = slice_between("C. Common product solutions — the idea library", "D. Prioritization cheat sheet")
    c_solutions = chunk_table(c_block[2:], 2)

    # D
    d_block = slice_between("D. Prioritization cheat sheet", "E. Common product experiments")
    d_priorities = chunk_table(d_block[2:], 2)
    d_footer = [ln for ln in d_block if ln.startswith("Common prioritization") or "framework" in ln.lower()]

    # E
    e_block = slice_between("E. Common product experiments", None)
    e_experiments = chunk_table(e_block[2:], 3)
    e_footer = [ln for ln in e_block if ln.startswith("For experiments") or ln.startswith("High-priority")]

    return {
        "metadata": {
            "source": "Questrade_Senior_PM_Master_Cheat_Sheet_Arial.docx",
            "section": "1. Product Sense Cheat Sheet",
            "version": "2026-11-11",
        },
        "title": "Product Sense Cheat Sheet",
        "useFor": use_for,
        "frameworkSteps": [
            "Clarify",
            "User",
            "Problem",
            "Solutions",
            "Prioritize",
            "Measure",
        ],
        "introNote": intro_line,
        "interviewTip": next((ln for ln in segments if ln.startswith("Interview tip")), ""),
        "customerSegments": [ln for ln in segments if not ln.startswith("Interview tip")],
        "sections": [
            {
                "id": "problems",
                "title": "A. Common customer problems",
                "table": {"columns": a_headers, "rows": a_rows},
            },
            {
                "id": "metrics",
                "title": "B. Success metrics and guardrails",
                "prose": b_intro,
                "tables": [
                    {
                        "id": "objectives",
                        "title": "Metrics by objective",
                        "columns": ["Objective", "Primary success metric", "Leading / supporting", "Guardrails"],
                        "rows": b_objective,
                    },
                    {
                        "id": "metric-types",
                        "title": "Metric types",
                        "columns": ["Metric type", "Meaning"],
                        "rows": metric_types,
                    },
                    {
                        "id": "guardrails",
                        "title": "Universal guardrail checklist",
                        "columns": ["Dimension", "Common guardrails"],
                        "rows": guardrails,
                    },
                ],
                "callout": banking_note,
            },
            {
                "id": "solutions",
                "title": "C. Common product solutions",
                "table": {"columns": ["Solution lever", "Examples"], "rows": c_solutions},
            },
            {
                "id": "prioritize",
                "title": "D. Prioritization",
                "table": {"columns": ["Dimension", "Question"], "rows": d_priorities},
                "footnotes": d_footer,
            },
            {
                "id": "experiments",
                "title": "E. Common product experiments",
                "table": {
                    "columns": ["Hypothesis", "Experiment", "Success measure"],
                    "rows": e_experiments,
                },
                "footnotes": e_footer,
            },
        ],
    }


def main() -> None:
    data = parse()
    OUT.write_text(json.dumps(data, indent=2) + "\n")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()

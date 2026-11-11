#!/usr/bin/env python3
"""Parse System Design, Diagnostic, and Technical cheat sheets from raw text exports."""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/questrade-jaz"
OUT_DIR = ROOT / "apps/web/src/data"

SHEETS = [
    {
        "id": "system-design",
        "raw": DATA / "system-design-cheat-sheet-raw.txt",
        "out": OUT_DIR / "questrade-jaz-system-design-cheat-sheet.json",
    },
    {
        "id": "diagnostic",
        "raw": DATA / "diagnostic-cheat-sheet-raw.txt",
        "out": OUT_DIR / "questrade-jaz-diagnostic-cheat-sheet.json",
    },
    {
        "id": "technical",
        "raw": DATA / "technical-cheat-sheet-raw.txt",
        "out": OUT_DIR / "questrade-jaz-technical-cheat-sheet.json",
    },
]


def slug_id(letter_title: str) -> str:
    letter = letter_title[0].lower()
    rest = re.sub(r"^[A-Z]\.\s*", "", letter_title)
    slug = re.sub(r"[^a-z0-9]+", "-", rest.lower()).strip("-")[:48]
    return f"{letter}-{slug}" if slug else letter


def is_prose_line(line: str) -> bool:
    if re.match(r"^\d+\.\s", line):
        return True
    if line.startswith("For ") or line.startswith("Illustrative"):
        return True
    if line.startswith("Two critical") or line.startswith("RTO ="):
        return True
    if len(line) > 120 and "?" not in line[:40]:
        return True
    return False


def looks_like_header(line: str) -> bool:
    if len(line) > 72:
        return False
    if "★" in line or "\u2605" in line:
        return False
    if line.endswith("?"):
        return False
    if re.match(r"^\d+\.", line):
        return False
    return True


def detect_table(body: list[str], i: int) -> int | None:
    for ncol in (2, 3):
        if i + ncol > len(body):
            continue
        headers = body[i : i + ncol]
        if not all(looks_like_header(h) for h in headers):
            continue
        if i + ncol < len(body) and body[i + ncol] in headers:
            continue
        return ncol
    return None


def chunk_table(lines: list[str], col_count: int) -> tuple[list[list[str]], list[str]]:
    rows: list[list[str]] = []
    i = 0
    while i + col_count <= len(lines):
        row = lines[i : i + col_count]
        if any(is_prose_line(cell) for cell in row):
            break
        if col_count == 2 and row[0].startswith("For "):
            break
        rows.append(row)
        i += col_count
    return rows, lines[i:]


def split_table_chunks(
    body: list[str], start: int, ncol: int
) -> tuple[list[str], list[str], list[list[str]], list[str], int]:
    headers = body[start : start + ncol]
    i = start + ncol
    prose_before: list[str] = []
    row_lines: list[str] = []
    while i < len(body):
        line = body[i]
        if re.match(r"^[A-Z]\. ", line):
            break
        if line.startswith("Five questions"):
            prose_before.append(line)
            i += 1
            while i < len(body) and re.match(r"^\d+\.\s", body[i]):
                prose_before.append(body[i])
                i += 1
            break
        if line.startswith("Generic banking"):
            prose_before.append(line)
            i += 1
            continue
        if is_prose_line(line) and not row_lines:
            prose_before.append(line)
            i += 1
            continue
        if is_prose_line(line) and row_lines:
            break
        row_lines.append(line)
        i += 1
    rows, leftover = chunk_table(row_lines, ncol)
    return prose_before, headers, rows, leftover, i


def parse_sections(lines: list[str]) -> list[dict]:
    starts = [i for i, ln in enumerate(lines) if re.match(r"^[A-Z]\. ", ln)]
    sections: list[dict] = []
    for si, start in enumerate(starts):
        end = starts[si + 1] if si + 1 < len(starts) else len(lines)
        block = lines[start:end]
        title = block[0]
        body = block[1:]
        prose: list[str] = []
        footnotes: list[str] = []
        table = None
        i = 0
        while i < len(body):
            if re.match(r"^[A-Z]\. ", body[i]):
                break
            ncol = detect_table(body, i)
            if ncol:
                pb, headers, rows, remainder, next_i = split_table_chunks(body, i, ncol)
                prose.extend(pb)
                if rows:
                    table = {"columns": headers, "rows": rows}
                    for r in remainder:
                        if re.match(r"^\d+\.\s", r) or r.startswith("Five questions"):
                            prose.append(r)
                        elif len(r) > 60 or r.startswith("For ") or r.startswith("Two "):
                            footnotes.append(r)
                        else:
                            footnotes.append(r)
                    i = next_i
                    continue
            if is_prose_line(body[i]):
                prose.append(body[i])
            else:
                prose.append(body[i])
            i += 1
        sections.append(
            {
                "id": slug_id(title),
                "title": title,
                "prose": prose or None,
                "table": table,
                "footnotes": footnotes or None,
            }
        )
    return sections


def parse_sheet(raw_path: Path, sheet_id: str) -> dict:
    lines = [ln.strip() for ln in raw_path.read_text(encoding="utf-8").splitlines() if ln.strip()]
    title = lines[0]
    use_for = lines[1] if len(lines) > 1 and lines[1].startswith("Use for") else ""
    framework = lines[2] if len(lines) > 2 else ""
    first_section = next((i for i, ln in enumerate(lines) if re.match(r"^[A-Z]\. ", ln)), 3)
    preamble = [ln for ln in lines[3:first_section] if ln != framework]
    section_lines = lines[first_section:]
    sections = parse_sections(section_lines)
    return {
        "metadata": {
            "source": "Questrade_Senior_PM_Master_Cheat_Sheet_Arial.docx",
            "sectionId": sheet_id,
            "version": "2026-11-11",
        },
        "id": sheet_id,
        "title": title,
        "useFor": use_for,
        "frameworkNote": framework,
        "preamble": preamble or None,
        "sections": sections,
    }


def main() -> None:
    for spec in SHEETS:
        data = parse_sheet(spec["raw"], spec["id"])
        spec["out"].write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Wrote {spec['out']} ({len(data['sections'])} sections)")


if __name__ == "__main__":
    main()

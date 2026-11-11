#!/usr/bin/env python3
"""Parse Everyday Banking playbook + primer into live interview JSON."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAYBOOK = ROOT / "data/questrade-jaz/everyday-banking-playbook.md"
PRIMER = ROOT / "data/questrade-jaz/everyday-banking-primer.md"
OUT_CASES = ROOT / "apps/web/src/data/questrade-jaz-playbook-cases.json"
OUT_PRIMER = ROOT / "apps/web/src/data/questrade-jaz-primer-live.json"

CATEGORY_META = {
    "priority": {
        "id": "priority",
        "label": "Priority 12",
        "liveType": "priority",
        "cheatSheetHint": "product-sense",
    },
    "10.1": {
        "id": "accounts-product-sense",
        "label": "Accounts product sense",
        "liveType": "product-sense",
        "cheatSheetHint": "product-sense",
    },
    "10.2": {
        "id": "activation-growth",
        "label": "Activation & growth",
        "liveType": "product-sense",
        "cheatSheetHint": "product-sense",
    },
    "10.3": {
        "id": "cards-payments",
        "label": "Cards & payments",
        "liveType": "product-sense",
        "cheatSheetHint": "product-sense",
    },
    "10.4": {
        "id": "investments-savings",
        "label": "Investments & savings",
        "liveType": "product-sense",
        "cheatSheetHint": "product-sense",
    },
    "10.5": {
        "id": "diagnostic",
        "label": "Diagnostic",
        "liveType": "diagnostic",
        "cheatSheetHint": "diagnostic",
    },
    "10.6": {
        "id": "system-technical",
        "label": "System & technical",
        "liveType": "technical",
        "cheatSheetHint": "technical",
    },
    "10.7": {
        "id": "strategy",
        "label": "Strategy & prioritization",
        "liveType": "strategy",
        "cheatSheetHint": "product-sense",
    },
}


def field(block: str, label: str) -> str:
    m = re.search(rf"\*\*{re.escape(label)}\.\*\*\s*(.+?)(?=\n\n|\n\*\*|$)", block, re.S)
    if not m:
        return ""
    return re.sub(r"\s+", " ", m.group(1)).strip()


def spoken(block: str) -> str:
    m = re.search(r"\*\*Worked spoken answer\.\*\*\s*\n+\"([\s\S]*?)\"\s*(?:\n\n|\n\*\*|$)", block)
    if not m:
        # fallback: anything after the label until How to defend
        m2 = re.search(
            r"\*\*Worked spoken answer\.\*\*\s*\n+([\s\S]*?)(?:\n\*\*How to defend|\n### \[|$)",
            block,
        )
        if not m2:
            return ""
        text = m2.group(1).strip().strip('"')
        return re.sub(r"\s+", " ", text).strip()
    return re.sub(r"\s+", " ", m.group(1)).strip()


def category_key(cat_line: str, answer_id: str) -> str:
    if answer_id.startswith("T"):
        return "priority"
    m = re.search(r"10\.(\d)", cat_line)
    if m:
        return f"10.{m.group(1)}"
    if "Diagnostic" in cat_line:
        return "10.5"
    if "System-design" in cat_line or "technical" in cat_line.lower():
        return "10.6"
    if "Strategy" in cat_line or "prioritization" in cat_line.lower():
        return "10.7"
    if "Activation" in cat_line:
        return "10.2"
    if "Cards" in cat_line or "payments" in cat_line.lower():
        return "10.3"
    if "Investments" in cat_line:
        return "10.4"
    return "10.1"


def parse_questions(md: str) -> list[dict]:
    parts = re.split(r"\n(?=### \[[TQ])", md)
    out: list[dict] = []
    seen: set[str] = set()
    for part in parts:
        m = re.match(r"### \[([^\]]+)\]\s*(.+)", part)
        if not m:
            continue
        qid = m.group(1).strip()
        title = m.group(2).strip()
        if qid in seen:
            continue
        # Prefer Txx priority versions over duplicate Q10.x when both exist for same title later
        seen.add(qid)
        cat_m = re.search(r"\*\*Category:\*\*\s*([^*]+?)\.\s*\*\*Answer ID:\*\*", part)
        cat_line = cat_m.group(1).strip() if cat_m else ""
        ckey = category_key(cat_line, qid)
        meta = CATEGORY_META[ckey]
        spoken_answer = spoken(part)
        clarify = field(part, "Clarify first")
        hypothesis = field(part, "Customer problem / diagnostic hypothesis")
        option_a = field(part, "Option A")
        option_b = field(part, "Option B")
        choose = field(part, "Choose and justify")
        metric = field(part, "Primary metric")
        guardrail = field(part, "Guardrail")
        dependency = field(part, "Cross-team or technical dependency")
        senior = field(part, "Additional senior-level reasoning")
        aliases = [title]
        for token in re.findall(r"[A-Za-z][A-Za-z0-9 &\-]{3,}", title):
            if len(token) > 4:
                aliases.append(token.lower())
        out.append(
            {
                "id": qid,
                "title": title,
                "categoryId": meta["id"],
                "categoryLabel": meta["label"],
                "liveType": meta["liveType"],
                "cheatSheetHint": meta["cheatSheetHint"],
                "priority": qid.startswith("T"),
                "clarify": clarify,
                "hypothesis": hypothesis,
                "optionA": option_a,
                "optionB": option_b,
                "choose": choose,
                "seniorReasoning": senior,
                "metric": metric,
                "guardrail": guardrail,
                "dependency": dependency,
                "spokenAnswer": spoken_answer,
                "shortAnswer": (spoken_answer.split(". ")[0] + ".") if spoken_answer else clarify,
                "aliases": list(dict.fromkeys(aliases))[:12],
            }
        )
    return out


def parse_primer(md: str) -> dict:
    """Extract live-friendly distinctions and spoken takeaways from the primer."""
    parts: list[dict] = []
    current: dict | None = None
    for line in md.splitlines():
        if line.startswith("# Part "):
            if current:
                parts.append(current)
            title = line.replace("# ", "").strip()
            current = {"id": re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:48], "title": title, "bullets": [], "takeaway": ""}
            continue
        if not current:
            continue
        if line.startswith("**Spoken takeaway:**"):
            current["takeaway"] = line.split("**Spoken takeaway:**", 1)[1].strip().strip('"')
            continue
        if line.startswith("- **") and ":**" in line:
            current["bullets"].append(line[2:].strip())
            continue
        if line.startswith("**") and ":**" in line and len(line) < 200:
            current["bullets"].append(line.strip())
    if current:
        parts.append(current)

    # Executive table distinctions
    distinctions = []
    for m in re.finditer(
        r"\|\s*(\d+\.\s*[^|]+)\|\s*([^|]+)\|\s*([^|]+)\|",
        md,
    ):
        label, q, distinction = m.group(1).strip(), m.group(2).strip(), m.group(3).strip()
        if label.startswith("Priority") or "Fundamental" in q:
            continue
        distinctions.append({"label": label, "question": q, "distinction": distinction})

    nav_matrix = []
    in_matrix = False
    for line in PLAYBOOK.read_text(encoding="utf-8").splitlines():
        if line.startswith("# 19. Live navigation matrix"):
            in_matrix = True
            continue
        if in_matrix and line.startswith("# "):
            break
        if in_matrix and line.startswith("|") and "Trigger words" not in line and "---" not in line:
            cols = [c.strip() for c in line.strip("|").split("|")]
            if len(cols) >= 5:
                nav_matrix.append(
                    {
                        "trigger": cols[0],
                        "rootProblem": cols[1],
                        "intervention": cols[2],
                        "outcome": cols[3],
                        "guardrail": cols[4],
                    }
                )

    return {
        "title": "Everyday Banking Primer (live)",
        "useFor": "On-the-fly distinctions and spoken takeaways while answering case questions.",
        "distinctions": distinctions[:12],
        "parts": parts,
        "navMatrix": nav_matrix,
    }


def main() -> None:
    md = PLAYBOOK.read_text(encoding="utf-8")
    questions = parse_questions(md)
    # Deduplicate: keep T-priority when a Q duplicate exists with same title? Keep all; UI separates priority.
    categories = []
    for meta in CATEGORY_META.values():
        count = sum(1 for q in questions if q["categoryId"] == meta["id"])
        categories.append({**meta, "count": count})

    cases = {
        "metadata": {
            "source": "everyday_banking_interview_playbook_90_answers.md",
            "version": "2026-11-11",
            "note": "Hypothetical practice answers for live interview navigation; not confirmed interview prompts.",
        },
        "title": "Everyday Banking case answers",
        "useFor": "Prepared product sense, diagnostic, system/technical and strategy answers for live rehearsal.",
        "categories": categories,
        "questions": questions,
    }
    OUT_CASES.write_text(json.dumps(cases, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    primer = parse_primer(PRIMER.read_text(encoding="utf-8"))
    primer["metadata"] = {
        "source": "everyday_banking_six_part_primer.md",
        "version": "2026-11-11",
    }
    OUT_PRIMER.write_text(json.dumps(primer, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Wrote {OUT_CASES} ({len(questions)} questions)")
    by_cat = {}
    for q in questions:
        by_cat[q["categoryId"]] = by_cat.get(q["categoryId"], 0) + 1
    for k, v in by_cat.items():
        print(f"  {k}: {v}")
    print(f"Wrote {OUT_PRIMER} ({len(primer['parts'])} parts, {len(primer['navMatrix'])} nav triggers)")


if __name__ == "__main__":
    main()

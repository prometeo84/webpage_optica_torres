#!/usr/bin/env python3
"""
Normalize HTML files: validate comment pairs and collapse multiple blank lines.

Behavior:
- For each .html file under project root, ensure number of <!-- equals number of -->.
- Warn if mismatched and skip auto-edit for that file.
- Replace runs of 2+ consecutive blank lines with a single blank line.
- Trim trailing spaces on each line.
- Preserve file encoding (utf-8) and write back if changed.
- Print a JSON summary to stdout and write to tools/normalize_report.json
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html_files = list(ROOT.glob("*.html")) + list(ROOT.glob("**/*.html"))
html_files = [p for p in html_files if p.is_file()]

report = {}

for f in sorted(set(html_files)):
    text = f.read_text(encoding="utf-8", errors="ignore")
    orig = text
    # Count comment delimiters
    opens = len(re.findall(r"<!--", text))
    closes = len(re.findall(r"-->", text))
    issues = []
    if opens != closes:
        issues.append(
            f"Mismatched comment delimiters: <!-- ({opens}) vs --> ({closes})"
        )
    # Detect double-hyphen inside comments (invalid): <!-- ... -- ... -->
    for m in re.finditer(r"<!--([\s\S]*?)-->", text):
        body = m.group(1)
        if "--" in body:
            issues.append(
                'Comment contains "--" inside its body (invalid according to spec)'
            )
            break
    # Collapse multiple blank lines (3+) into single blank line
    new = re.sub(r"(?:\r\n|\r|\n){2,}", "\n\n", text)
    # Also trim trailing spaces on each line
    new = "\n".join([ln.rstrip() for ln in new.splitlines()]) + "\n"

    changed = False
    if issues:
        report[str(f.relative_to(ROOT))] = {"status": "skipped", "issues": issues}
    else:
        if new != orig:
            f.write_text(new, encoding="utf-8", newline="\n")
            changed = True
        report[str(f.relative_to(ROOT))] = {"status": "ok", "changed": changed}

OUT = ROOT / "tools" / "normalize_report.json"
OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False, indent=2))

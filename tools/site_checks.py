#!/usr/bin/env python3
"""
Simple site checks: runs W3C validator for all HTML files and scans for
- images without alt
- links opening in new tab without rel
Outputs JSON report to stdout and writes report to tools/site_checks_report.json
"""

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / "tools"

html_files = list(ROOT.glob("*.html")) + list(ROOT.glob("**/*.html"))
html_files = [p for p in html_files if p.is_file()]

report = {"pages": {}}

for f in sorted(set(html_files)):
    relpath = str(f.relative_to(ROOT))
    page = {"w3c": None, "images_missing_alt": [], "links_blank_no_rel": []}
    # Run existing validator script
    try:
        proc = subprocess.run(
            [sys.executable, str(TOOLS / "validate_html_w3c.py"), str(f)],
            capture_output=True,
            text=True,
            timeout=60,
        )
        if proc.returncode == 0:
            page["w3c"] = json.loads(proc.stdout)
        else:
            page["w3c"] = {
                "error": True,
                "stdout": proc.stdout,
                "stderr": proc.stderr,
                "returncode": proc.returncode,
            }
    except Exception as e:
        page["w3c"] = {"error": True, "exception": str(e)}

    text = f.read_text(encoding="utf-8", errors="ignore")
    # images without meaningful alt (missing alt or empty alt)
    for m in re.finditer(r"<img\b[^>]*>", text, flags=re.I):
        tag = m.group(0)
        if re.search(r"\balt=\"\"", tag) or not re.search(r"\balt=\"[^\"]+\"", tag):
            # find src for context
            srcm = re.search(r'src="([^"]+)"', tag)
            src = srcm.group(1) if srcm else None
            page["images_missing_alt"].append({"tag": tag, "src": src})

    # links target _blank without rel
    for m in re.finditer(r"<a\b[^>]*target=[\"']?_blank[\"']?[^>]*>", text, flags=re.I):
        tag = m.group(0)
        if not re.search(
            r'\brel="[^"]*noopener[^"]*"', tag, flags=re.I
        ) and not re.search(r"\brel='[^']*noopener[^']*'", tag, flags=re.I):
            hrefm = re.search(r'href="([^"]+)"', tag)
            href = hrefm.group(1) if hrefm else None
            page["links_blank_no_rel"].append({"tag": tag, "href": href})

    report["pages"][relpath] = page

OUT = TOOLS / "site_checks_report.json"
OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False, indent=2))

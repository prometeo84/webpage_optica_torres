#!/usr/bin/env python3
"""Fail CI when W3C errors are present in tools/site_checks_report.json

This small helper is used by the GitHub Actions workflow to avoid YAML
here-doc quoting issues in editors/linters.
"""
import json
import sys

REPORT = 'tools/site_checks_report.json'


def main():
    try:
        with open(REPORT, encoding='utf-8') as fh:
            report = json.load(fh)
    except Exception as e:
        print(f'ERROR: could not read {REPORT}: {e}', file=sys.stderr)
        sys.exit(2)

    errors = 0
    for page, data in (report.get('pages') or {}).items():
        w3c = data.get('w3c') or {}
        e = int(w3c.get('errors') or 0)
        errors += e

    if errors > 0:
        print(f'W3C errors found: {errors}')
        sys.exit(1)

    print('No W3C errors found')


if __name__ == '__main__':
    main()

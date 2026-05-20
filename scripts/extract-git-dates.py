#!/usr/bin/env python3
"""
Extract the last-commit date of every markdown file under content/ and
write a JSON sidecar that Zola templates can load with `load_data()`.

Runs as a pre-build step (CF Pages build command + local mise.toml
`build` task). Falls back to file mtime if git history is unavailable
(shallow clone, dirty working tree, etc.) so the script never makes
the build fail.

Output schema:
  {
    "_index.md":                        "2026-05-20",
    "getting-started/quickstart.md":    "2026-05-20",
    "contributing/content/wiki-entry.md": "2026-05-19",
    ...
  }

Templates can then:
  {% set dates = load_data(path="data/updated-dates.json") %}
  {% if page.relative_path and dates[page.relative_path] %}
    Updated {{ dates[page.relative_path] }}
  {% endif %}
"""

import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content"
OUTPUT = ROOT / "data" / "updated-dates.json"


def git_date(path: Path) -> str | None:
    """Return the last-commit date (YYYY-MM-DD) for `path`, or None."""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", str(path)],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
            timeout=5,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        return None
    date = result.stdout.strip()
    return date if date else None


def mtime_date(path: Path) -> str:
    """Fallback: filesystem modification date as YYYY-MM-DD."""
    import datetime
    ts = path.stat().st_mtime
    return datetime.date.fromtimestamp(ts).isoformat()


def main() -> int:
    if not CONTENT_DIR.is_dir():
        print(f"!! no content dir at {CONTENT_DIR}", file=sys.stderr)
        return 1

    dates: dict[str, str] = {}
    git_hits = 0
    mtime_hits = 0

    for path in sorted(CONTENT_DIR.rglob("*.md")):
        rel = path.relative_to(CONTENT_DIR).as_posix()
        date = git_date(path)
        if date:
            git_hits += 1
        else:
            date = mtime_date(path)
            mtime_hits += 1
        dates[rel] = date

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(dates, indent=2, sort_keys=True) + "\n")

    print(
        f"  {len(dates)} files indexed → {OUTPUT.relative_to(ROOT)}"
        f"  (git: {git_hits}, mtime fallback: {mtime_hits})"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

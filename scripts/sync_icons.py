#!/usr/bin/env python3
"""Sync the icon registry from the www repo into docs.

Copies:
  - data/icons.json (the registry)
  - themes/bifrost/templates/partials/icons/*.html (the SVG partials)
  - themes/bifrost/templates/macros/section-icons.html (the resolver macro)

Source: ../www.wheelofheaven.world/
Destination: this repo (data/, themes/docs-theme/templates/...)

Run before committing whenever the www icon registry changes. The synced
files are committed to the docs repo so CI builds don't need cross-repo
access; this script is a manual refresh tool, not a build-time step.

Usage:
    python3 scripts/sync_icons.py [--dry-run]
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

DOCS_ROOT = Path(__file__).resolve().parent.parent
WWW_ROOT = (DOCS_ROOT.parent / "www.wheelofheaven.world").resolve()

SYNC_PAIRS: list[tuple[Path, Path]] = [
    (
        WWW_ROOT / "data" / "icons.json",
        DOCS_ROOT / "data" / "icons.json",
    ),
    (
        WWW_ROOT / "themes" / "bifrost" / "templates" / "macros" / "section-icons.html",
        DOCS_ROOT / "themes" / "docs-theme" / "templates" / "macros" / "section-icons.html",
    ),
]

# The icons/ directory is synced as a whole — every SVG partial in the
# source mirrors over, and any partial that's been removed upstream is
# removed here too. The wholesale mirror keeps the docs registry
# faithful to the source of truth.
ICONS_SRC = WWW_ROOT / "themes" / "bifrost" / "templates" / "partials" / "icons"
ICONS_DST = DOCS_ROOT / "themes" / "docs-theme" / "templates" / "partials" / "icons"


def sync_file(src: Path, dst: Path, dry_run: bool) -> bool:
    if not src.exists():
        print(f"  ! missing source: {src.relative_to(WWW_ROOT)}", file=sys.stderr)
        return False
    if not dry_run:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    print(f"  {src.relative_to(WWW_ROOT)} → {dst.relative_to(DOCS_ROOT)}")
    return True


def sync_icons_dir(dry_run: bool) -> tuple[int, int]:
    if not ICONS_SRC.exists():
        print(f"  ! missing source: {ICONS_SRC.relative_to(WWW_ROOT)}", file=sys.stderr)
        return (0, 0)

    src_files = {p.name for p in ICONS_SRC.glob("*.html")}
    dst_files = {p.name for p in ICONS_DST.glob("*.html")} if ICONS_DST.exists() else set()

    added_or_updated = 0
    removed = 0

    if not dry_run:
        ICONS_DST.mkdir(parents=True, exist_ok=True)

    for name in sorted(src_files):
        src = ICONS_SRC / name
        dst = ICONS_DST / name
        if not dry_run:
            shutil.copy2(src, dst)
        added_or_updated += 1

    for name in sorted(dst_files - src_files):
        if not dry_run:
            (ICONS_DST / name).unlink()
        print(f"  - removed (upstream gone): partials/icons/{name}")
        removed += 1

    print(f"  partials/icons/: {added_or_updated} synced, {removed} removed")
    return (added_or_updated, removed)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="show what would change without writing")
    args = parser.parse_args()

    print(f"Source:      {WWW_ROOT}")
    print(f"Destination: {DOCS_ROOT}")
    if args.dry_run:
        print("(dry run — no files will be written)")
    print()

    if not WWW_ROOT.exists():
        print(f"Source repo not found at {WWW_ROOT}", file=sys.stderr)
        print("Clone www.wheelofheaven.world as a sibling directory and retry.", file=sys.stderr)
        return 1

    ok = True
    for src, dst in SYNC_PAIRS:
        if not sync_file(src, dst, args.dry_run):
            ok = False

    sync_icons_dir(args.dry_run)

    print()
    print("Done." if ok else "Done with warnings.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

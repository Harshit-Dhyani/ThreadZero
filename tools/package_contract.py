from __future__ import annotations

from pathlib import Path

PACKAGE_NAME = "NCRP Civic Evidence Ledger concept"
PACKAGE_VERSION = "0.3.0"

INCLUDED_FILES = (
    "AGENTS.md",
    "README.md",
    "README_START_HERE.md",
    "VERIFICATION.md",
    "PACKAGE_CONTENTS.md",
    "templates/SYNTHETIC_FINANCIAL_FRAUD_FIXTURE.json",
    "prototype/qa/harness.html",
    "prototype/qa/static-check.mjs",
    "tools/package_contract.py",
    "tools/build_manifest.py",
    "tools/validate_package.py",
)

INCLUDED_DIRS = (
    "docs",
    "prototype/shared",
    "prototype/app",
    "prototype/concepts/parallel-ledger",
    "prototype/concepts/guided-verification",
    "prototype/concepts/continuous-thread",
    "prototype/comparison",
    "prototype/wireframes",
)


def iter_package_files(root: Path) -> list[Path]:
    files: set[Path] = set()
    for relative in INCLUDED_FILES:
        path = root / relative
        if path.is_file():
            files.add(path)

    for relative in INCLUDED_DIRS:
        directory = root / relative
        if not directory.is_dir():
            continue
        for path in directory.rglob("*"):
            if path.is_file() and "__pycache__" not in path.parts and path.suffix != ".pyc":
                files.add(path)

    return sorted(files, key=lambda path: path.relative_to(root).as_posix())

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True

from package_contract import INCLUDED_DIRS, INCLUDED_FILES, PACKAGE_NAME, PACKAGE_VERSION, iter_package_files


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    args = parser.parse_args()
    root = Path(args.root).resolve()

    required = [*INCLUDED_FILES, *INCLUDED_DIRS, "PACKAGE_MANIFEST.json"]
    missing = [relative for relative in required if not (root / relative).exists()]
    if missing:
        print("MISSING")
        for relative in missing:
            print(" -", relative)
        return 1

    errors: list[str] = []

    try:
        fixture = json.loads((root / "templates" / "SYNTHETIC_FINANCIAL_FRAUD_FIXTURE.json").read_text(encoding="utf-8"))
        if fixture["incident"]["amount_inr"] != 25000:
            errors.append("canonical fixture amount is not 25000")
        if fixture["incident"]["transaction_reference"] != "419825901772":
            errors.append("canonical transaction reference drifted")
        if fixture["demo_report_reference"] != "DEMO-2026-08421":
            errors.append("canonical demo report reference drifted")
    except Exception as exc:
        errors.append(f"invalid canonical fixture: {exc}")

    try:
        manifest = json.loads((root / "PACKAGE_MANIFEST.json").read_text(encoding="utf-8"))
        if manifest.get("package") != PACKAGE_NAME:
            errors.append("manifest package name mismatch")
        if manifest.get("version") != PACKAGE_VERSION:
            errors.append("manifest version mismatch")
        if manifest.get("scope") != "active-product-only":
            errors.append("manifest scope must be active-product-only")

        manifest_rows = {row["path"]: row for row in manifest.get("files", [])}
        actual_files = iter_package_files(root)
        actual_paths = {path.relative_to(root).as_posix() for path in actual_files}

        if set(manifest_rows) != actual_paths:
            missing_from_manifest = sorted(actual_paths - set(manifest_rows))
            stale_manifest = sorted(set(manifest_rows) - actual_paths)
            errors.append(f"manifest path mismatch: missing={missing_from_manifest[:8]} stale={stale_manifest[:8]}")
        else:
            for path in actual_files:
                relative = path.relative_to(root).as_posix()
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                if manifest_rows[relative].get("sha256") != digest:
                    errors.append(f"manifest hash mismatch: {relative}")
                    break

        forbidden = [
            path for path in manifest_rows
            if path.startswith((".git/", ".tmp/", "archive/", "evidence/", "prototype/qa/screenshots/"))
        ]
        if forbidden:
            errors.append(f"manifest contains excluded files: {forbidden[:8]}")
    except Exception as exc:
        errors.append(f"manifest verification failed: {exc}")

    concept_root = root / "prototype" / "concepts"
    expected_concepts = {"parallel-ledger", "guided-verification", "continuous-thread"}
    actual_concepts = {path.name for path in concept_root.iterdir() if path.is_dir() and path.name != "visual-specs"}
    if actual_concepts != expected_concepts:
        errors.append(f"concept set mismatch: expected={sorted(expected_concepts)} actual={sorted(actual_concepts)}")

    if errors:
        print("FAIL")
        for error in errors:
            print(" -", error)
        return 1

    file_count = len(iter_package_files(root))
    print(
        f"PASS: {file_count} active product files verified; canonical fixture valid; "
        "archive, evidence, Git metadata, temporary files, and QA screenshots excluded."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

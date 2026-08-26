from __future__ import annotations

import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.dont_write_bytecode = True

from package_contract import PACKAGE_NAME, PACKAGE_VERSION, iter_package_files

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "PACKAGE_MANIFEST.json"

rows = []
for path in iter_package_files(ROOT):
    data = path.read_bytes()
    rows.append(
        {
            "path": path.relative_to(ROOT).as_posix(),
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
        }
    )

manifest = {
    "package": PACKAGE_NAME,
    "version": PACKAGE_VERSION,
    "scope": "active-product-only",
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "file_count": len(rows),
    "total_bytes": sum(row["bytes"] for row in rows),
    "excluded_roots": [".git", ".tmp", "archive", "evidence", "prototype/qa/screenshots"],
    "files": rows,
}

OUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {OUT} with {len(rows)} active product files")

#!/usr/bin/env python3
"""
PISO Chain External Security Audit Bundle Generator
Packages contracts, wallet core, specs, and test suites into a zip archive for external security audit submission.
"""

import os
import sys
import zipfile


def prepare_audit_bundle():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    output_zip = os.path.join(root_dir, "PISO_Chain_Audit_Bundle_v1.1.0.zip")

    include_dirs = ["contracts", "core", "wallet", "rpc", "api", "docs", "tests"]
    include_files = ["README.md", "WHITEPAPER.md", "TOKENOMICS.md", "CHANGELOG.md", "config/coin_type.yaml"]

    print(f"[*] Packaging PISO Chain v1.1.0 Security Audit Bundle -> {output_zip}...")

    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for d in include_dirs:
            full_d = os.path.join(root_dir, d)
            if os.path.exists(full_d):
                for root, _, files in os.walk(full_d):
                    for file in files:
                        if "__pycache__" in root or file.endswith(".pyc"):
                            continue
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, root_dir)
                        zf.write(file_path, arcname)

        for f in include_files:
            full_f = os.path.join(root_dir, f)
            if os.path.exists(full_f):
                zf.write(full_f, f)

    print(f"[+] Audit bundle generated successfully ({os.path.getsize(output_zip)} bytes).")


if __name__ == "__main__":
    prepare_audit_bundle()

"""
Unit tests for PISO Chain PWA Service Worker, Manifest, and Bubblewrap TWA APK Integration.
"""

import os
import unittest
import json

class TestPWAIntegration(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.manifest_path = os.path.join(self.root_dir, "dashboard", "manifest.json")
        self.sw_path = os.path.join(self.root_dir, "dashboard", "sw.js")
        self.twa_path = os.path.join(self.root_dir, "web-to-app", "twa-manifest.json")
        self.builder_path = os.path.join(self.root_dir, "scripts", "build_bubblewrap_apk.py")

    def test_pwa_manifest_exists_and_valid(self):
        self.assertTrue(os.path.exists(self.manifest_path), "manifest.json missing")
        with open(self.manifest_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertEqual(data.get("name"), "PISO Chain Web3 Mining & AI OS")
        self.assertEqual(data.get("display"), "standalone")
        self.assertEqual(data.get("theme_color"), "#a855f7")

    def test_service_worker_exists(self):
        self.assertTrue(os.path.exists(self.sw_path), "sw.js missing")
        with open(self.sw_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("piso-chain-pwa", content)
        self.assertIn("addEventListener('fetch'", content)

    def test_bubblewrap_twa_manifest_valid(self):
        self.assertTrue(os.path.exists(self.twa_path), "twa-manifest.json missing")
        with open(self.twa_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn(data.get("generatorApp"), ["bubblewrap-cli", "GoogleChromeLabs/bubblewrap"])
        self.assertEqual(data.get("packageId"), "app.vercel.piso_blockchain.twa")
        self.assertEqual(data.get("host"), "piso-blockchain.vercel.app")

    def test_bubblewrap_builder_script_exists(self):
        self.assertTrue(os.path.exists(self.builder_path), "build_bubblewrap_apk.py missing")

if __name__ == "__main__":
    unittest.main()

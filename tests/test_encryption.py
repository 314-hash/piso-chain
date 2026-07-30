"""
Unit tests for Web3 Keystore AES-256-GCM Encryption & Decryption.
"""

import os
import unittest
from wallet.account.account import Account
from wallet.encryption.keystore import KeystoreManager, zeroize_buffer


class TestEncryption(unittest.TestCase):

    def test_keystore_encrypt_decrypt_cycle(self):
        priv_key = os.urandom(32)
        acc = Account(priv_key)
        password = "SuperSecretPassword123!"

        keystore_json = KeystoreManager.encrypt_private_key(priv_key, password, acc.address)
        self.assertEqual(keystore_json["version"], 3)
        self.assertIn("crypto", keystore_json)

        decrypted_pk = KeystoreManager.decrypt_keystore(keystore_json, password)
        self.assertEqual(decrypted_pk, priv_key)

    def test_invalid_password_raises_error(self):
        priv_key = os.urandom(32)
        acc = Account(priv_key)
        keystore_json = KeystoreManager.encrypt_private_key(priv_key, "correct_pass", acc.address)

        with self.assertRaises(ValueError):
            KeystoreManager.decrypt_keystore(keystore_json, "wrong_pass")

    def test_zeroize_buffer(self):
        buf = bytearray(b"sensitive_secret_data")
        zeroize_buffer(buf)
        self.assertEqual(buf, bytearray(len(buf)))


if __name__ == "__main__":
    unittest.main()

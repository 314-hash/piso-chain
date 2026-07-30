"""
Cryptographically Isolated Key Management Engine for Validator, Treasury, Governance, and User Roles.
Enforces Phase 8 Strict Key Separation.
"""

import hashlib
from enum import Enum
from typing import Dict, Any
from eth_keys import keys as eth_keys_impl
from eth_utils import to_checksum_address


class KeyRole(Enum):
    WALLET = "piso-wallet-key-v1"
    VALIDATOR = "piso-validator-key-v1"
    TREASURY = "piso-treasury-key-v1"
    GOVERNANCE = "piso-governance-key-v1"


class KeyDomainError(Exception):
    """
    Raised when a key is used in an unauthorized domain or role context.
    """

    pass


class ValidatorKey:
    """
    Validator Key wrapper enforcing strict role isolation.
    """

    def __init__(self, raw_seed: bytes, role: KeyRole = KeyRole.VALIDATOR):
        self.role = role
        # Domain separation tag calculation: SHA256(role_tag || raw_seed)
        domain_tag = role.value.encode("utf-8")
        self.private_key_bytes = hashlib.sha256(domain_tag + raw_seed).digest()

        self._priv = eth_keys_impl.PrivateKey(self.private_key_bytes)
        self.address = to_checksum_address(self._priv.public_key.to_checksum_address())

    def assert_role(self, expected_role: KeyRole):
        """
        Verify key belongs strictly to expected role.
        """
        if self.role != expected_role:
            raise KeyDomainError(f"Key domain mismatch: expected {expected_role.name}, got {self.role.name}")

    def sign_block_proposal(self, block_hash: bytes) -> bytes:
        """
        Sign a consensus block proposal. Rejects non-validator keys.
        """
        self.assert_role(KeyRole.VALIDATOR)
        # Domain tag block header
        tagged_hash = hashlib.sha256(b"PISO-BLOCK-SIGN:" + block_hash).digest()
        return self._priv.sign_msg_hash(tagged_hash).to_bytes()

    def export_keystore(self, password: str) -> Dict[str, Any]:
        """
        Export encrypted validator key with role metadata tag.
        """
        from wallet.encryption.keystore import KeystoreManager

        data = KeystoreManager.encrypt_private_key(self.private_key_bytes, password, self.address)
        data["piso_role"] = self.role.name
        return data

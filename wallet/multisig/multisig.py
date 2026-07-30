"""
Native M-of-N Threshold Multisig Engine.
"""

import hashlib
from typing import List, Dict, Any
from eth_utils import to_checksum_address
from eth_keys import keys as eth_keys_impl


class MultisigTransaction:
    """
    Multisig transaction proposal containing signatures and threshold verification logic.
    """

    def __init__(self, tx_hash: bytes, target_address: str, value: int, data: bytes):
        self.tx_hash = tx_hash
        self.target_address = target_address
        self.value = value
        self.data = data
        self.signatures: Dict[str, bytes] = {}

    def add_signature(self, signer_address: str, signature: bytes):
        """
        Add a signature from a signer address.
        """
        self.signatures[signer_address.lower()] = signature


class MultisigWallet:
    """
    Multisig Account representation for DAO Treasuries, Validator Committees, and Emergency Vaults.
    """

    def __init__(self, owners: List[str], threshold: int):
        if threshold < 1 or threshold > len(owners):
            raise ValueError(f"Invalid threshold {threshold} for owner count {len(owners)}")

        self.owners = [to_checksum_address(o) for o in owners]
        self.threshold = threshold

        # Deterministic multisig address computation: Keccak256(sorted_owners || threshold)
        sorted_owners = sorted([o.lower() for o in self.owners])
        payload = "".join(sorted_owners) + f"-{threshold}"
        addr_bytes = hashlib.sha256(payload.encode("utf-8")).digest()[-20:]
        self.address = to_checksum_address("0x" + addr_bytes.hex())

    def verify_transaction(self, tx: MultisigTransaction) -> bool:
        """
        Verify transaction has at least 'threshold' valid signatures from distinct owners.
        """
        valid_signatures = 0
        verified_signers = set()

        for signer_addr_lower, sig_bytes in tx.signatures.items():
            signer_checksum = to_checksum_address(signer_addr_lower)

            if signer_checksum not in self.owners:
                continue

            if signer_checksum in verified_signers:
                continue

            try:
                sig = eth_keys_impl.Signature(sig_bytes)
                recovered_pub = sig.recover_public_key_from_msg_hash(tx.tx_hash)
                recovered_addr = to_checksum_address(recovered_pub.to_checksum_address())

                if recovered_addr == signer_checksum:
                    verified_signers.add(signer_checksum)
                    valid_signatures += 1
            except Exception:
                continue

        return valid_signatures >= self.threshold

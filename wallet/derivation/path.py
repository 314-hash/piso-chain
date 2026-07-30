"""
Derivation Path Parsing and BIP-44 Path Resolution Engine.
"""

from typing import List
from wallet.hdwallet.hdwallet import HDNode


class DerivationPath:
    """
    Parses and executes HD key derivation paths according to BIP-44 / SLIP-10 specs.
    """

    HARDENED_OFFSET = 0x80000000

    @classmethod
    def parse(cls, path_str: str) -> List[int]:
        """
        Parse path string like "m/44'/2026'/0'/0/0" into integer index list.
        """
        parts = path_str.strip().split("/")
        if parts[0] != "m":
            raise ValueError("Derivation path must start with 'm/'")

        indexes = []
        for part in parts[1:]:
            if not part:
                continue
            if part.endswith("'") or part.endswith("h") or part.endswith("H"):
                val = int(part[:-1])
                indexes.append(val + cls.HARDENED_OFFSET)
            else:
                val = int(part)
                indexes.append(val)

        return indexes

    @classmethod
    def derive_path(cls, master_node: HDNode, path_str: str) -> HDNode:
        """
        Recursively derive child node from master node using path string.
        """
        indexes = cls.parse(path_str)
        current = master_node
        for idx in indexes:
            current = current.derive_child(idx)
        return current


class BIP44Derivation:
    """
    BIP-44 Standard Path Builder for PISO Chain.
    Format: m / 44' / coin_type' / account' / change / address_index
    """

    @classmethod
    def build_path(
        cls,
        coin_type: int = 2026,
        account: int = 0,
        change: int = 0,
        address_index: int = 0,
    ) -> str:
        """
        Construct BIP-44 path string.
        """
        return f"m/44'/{coin_type}'/{account}'/{change}/{address_index}"

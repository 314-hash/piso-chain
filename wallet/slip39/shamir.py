"""
SLIP-39 Shamir Secret Sharing Engine over GF(256).
Enables threshold M-of-N secret splitting and reconstruction for recovery.
"""

import os
from typing import List, Tuple


class GF256:
    """
    Galois Field GF(2^8) arithmetic with irreducible polynomial x^8 + x^4 + x^3 + x^2 + 1 (0x11d).
    """

    EXP = [0] * 512
    LOG = [0] * 256

    @classmethod
    def _init_tables(cls):
        if cls.EXP[1] != 0:
            return
        x = 1
        for i in range(255):
            cls.EXP[i] = x
            cls.LOG[x] = i
            x <<= 1
            if x & 0x100:
                x ^= 0x11D
        for i in range(255, 512):
            cls.EXP[i] = cls.EXP[i - 255]

    @classmethod
    def add(cls, a: int, b: int) -> int:
        return a ^ b

    @classmethod
    def mul(cls, a: int, b: int) -> int:
        if a == 0 or b == 0:
            return 0
        cls._init_tables()
        return cls.EXP[cls.LOG[a] + cls.LOG[b]]

    @classmethod
    def div(cls, a: int, b: int) -> int:
        if b == 0:
            raise ZeroDivisionError("GF256 division by zero")
        if a == 0:
            return 0
        cls._init_tables()
        return cls.EXP[(cls.LOG[a] - cls.LOG[b]) % 255]


class Share:
    """
    Represents a single share in an M-of-N Shamir scheme.
    """

    def __init__(self, index: int, data: bytes, threshold: int):
        self.index = index
        self.data = data
        self.threshold = threshold

    def to_hex(self) -> str:
        return f"{self.index:02x}-{self.threshold:02x}-{self.data.hex()}"

    @classmethod
    def from_hex(cls, share_hex: str) -> "Share":
        parts = share_hex.strip().split("-")
        if len(parts) != 3:
            raise ValueError("Invalid share hex format. Expected 'index-threshold-hexdata'")
        idx = int(parts[0], 16)
        thresh = int(parts[1], 16)
        data = bytes.fromhex(parts[2])
        return cls(index=idx, data=data, threshold=thresh)


class ShamirSecretSharing:
    """
    Shamir's Secret Sharing Scheme over GF(256).
    """

    @classmethod
    def split(cls, secret: bytes, threshold: int, total_shares: int) -> List[Share]:
        """
        Split a secret byte array into total_shares with threshold reconstructability.
        """
        if threshold < 1 or threshold > total_shares:
            raise ValueError(f"Invalid threshold {threshold} for total shares {total_shares}")
        if total_shares > 254:
            raise ValueError("Total shares cannot exceed 254 in GF(256)")

        shares_data = [bytearray() for _ in range(total_shares)]

        # For each byte in secret, build random polynomial of degree (threshold - 1)
        for b in secret:
            poly = [b] + [os.urandom(1)[0] for _ in range(threshold - 1)]

            for i in range(1, total_shares + 1):
                # Evaluate polynomial at x = i
                y = 0
                x_pow = 1
                for coeff in poly:
                    term = GF256.mul(coeff, x_pow)
                    y = GF256.add(y, term)
                    x_pow = GF256.mul(x_pow, i)
                shares_data[i - 1].append(y)

        return [
            Share(index=i + 1, data=bytes(shares_data[i]), threshold=threshold)
            for i in range(total_shares)
        ]

    @classmethod
    def combine(cls, shares: List[Share]) -> bytes:
        """
        Reconstruct original secret from a threshold subset of shares.
        """
        if not shares:
            raise ValueError("No shares provided for combination.")

        threshold = shares[0].threshold
        if len(shares) < threshold:
            raise ValueError(f"Insufficient shares provided: {len(shares)} < required threshold {threshold}")

        # Use first 'threshold' shares
        subset = shares[:threshold]
        secret_len = len(subset[0].data)
        secret = bytearray(secret_len)

        for byte_idx in range(secret_len):
            value = 0
            for i, share_i in enumerate(subset):
                xi, yi = share_i.index, share_i.data[byte_idx]
                num, den = 1, 1
                for j, share_j in enumerate(subset):
                    if i != j:
                        xj = share_j.index
                        num = GF256.mul(num, xj)
                        den = GF256.mul(den, GF256.add(xi, xj))
                lagrange_weight = GF256.div(num, den)
                term = GF256.mul(yi, lagrange_weight)
                value = GF256.add(value, term)

            secret[byte_idx] = value

        return bytes(secret)

"""
BIP-39 Mnemonic Generator and Seed Derivation Engine.
"""

import os
import hashlib
from typing import List, Union
from .wordlists import WORDLIST, WORD_INDEX


class BIP39Mnemonic:
    """
    Standards-compliant BIP-39 mnemonic implementation supporting 12, 18, and 24 words.
    """

    ALLOWED_ENTROPY_BITS = {128: 12, 192: 18, 256: 24}

    @classmethod
    def generate(cls, num_words: int = 24) -> str:
        """
        Generate a cryptographically secure BIP-39 mnemonic phrase.
        :param num_words: Number of words (12, 18, or 24).
        :return: Space-separated mnemonic phrase.
        """
        bits_to_words = {12: 128, 18: 192, 24: 256}
        if num_words not in bits_to_words:
            raise ValueError(f"Invalid word count {num_words}. Must be 12, 18, or 24.")

        entropy_bits = bits_to_words[num_words]
        entropy_bytes = os.urandom(entropy_bits // 8)
        return cls.entropy_to_mnemonic(entropy_bytes)

    @classmethod
    def entropy_to_mnemonic(cls, entropy: bytes) -> str:
        """
        Convert entropy bytes to a BIP-39 mnemonic phrase.
        """
        bit_len = len(entropy) * 8
        if bit_len not in [128, 192, 256]:
            raise ValueError("Entropy length must be 128, 192, or 256 bits.")

        # Compute SHA256 checksum
        checksum_len = bit_len // 32
        hash_bytes = hashlib.sha256(entropy).digest()

        # Convert entropy + checksum bits into 11-bit chunks
        entropy_bits = bin(int.from_bytes(entropy, byteorder="big"))[2:].zfill(bit_len)
        checksum_bits = bin(hash_bytes[0])[2:].zfill(8)[:checksum_len]

        full_bits = entropy_bits + checksum_bits
        words = []
        for i in range(0, len(full_bits), 11):
            idx = int(full_bits[i : i + 11], 2)
            words.append(WORDLIST[idx])

        return " ".join(words)

    @classmethod
    def mnemonic_to_entropy(cls, mnemonic: str) -> bytes:
        """
        Convert a BIP-39 mnemonic phrase back to raw entropy bytes.
        """
        words = mnemonic.strip().split()
        if len(words) not in [12, 18, 24]:
            raise ValueError("Invalid mnemonic word count. Must be 12, 18, or 24.")

        bit_string = ""
        for word in words:
            if word not in WORD_INDEX:
                raise ValueError(f"Word '{word}' is not in BIP-39 wordlist.")
            idx = WORD_INDEX[word]
            bit_string += bin(idx)[2:].zfill(11)

        total_bits = len(bit_string)
        checksum_len = total_bits // 33
        entropy_bits = bit_string[:-checksum_len]
        checksum_bits = bit_string[-checksum_len:]

        entropy_bytes = int(entropy_bits, 2).to_bytes(len(entropy_bits) // 8, byteorder="big")

        # Verify checksum
        hash_bytes = hashlib.sha256(entropy_bytes).digest()
        computed_checksum_bits = bin(hash_bytes[0])[2:].zfill(8)[:checksum_len]

        if checksum_bits != computed_checksum_bits:
            raise ValueError("Invalid BIP-39 checksum.")

        return entropy_bytes

    @classmethod
    def validate(cls, mnemonic: str) -> bool:
        """
        Validate a BIP-39 mnemonic phrase.
        :return: True if valid, False otherwise.
        """
        try:
            cls.mnemonic_to_entropy(mnemonic)
            return True
        except Exception:
            return False

    @classmethod
    def to_seed(cls, mnemonic: str, passphrase: str = "") -> bytes:
        """
        Derive 512-bit seed from mnemonic using PBKDF2 HMAC-SHA512 (2048 iterations).
        :param mnemonic: BIP-39 mnemonic.
        :param passphrase: Optional user passphrase (salt prefix 'mnemonic').
        :return: 64-byte seed.
        """
        if not cls.validate(mnemonic):
            raise ValueError("Invalid BIP-39 mnemonic.")

        salt = ("mnemonic" + passphrase).encode("utf-8")
        mnemonic_bytes = mnemonic.strip().encode("utf-8")
        seed = hashlib.pbkdf2_hmac("sha512", mnemonic_bytes, salt, 2048, dklen=64)
        return seed

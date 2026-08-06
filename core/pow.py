"""
PISO Chain Proof of Work (PoW) Mining and Verification Engine.
Provides high-performance SHA-256 and Keccak-256 Proof of Work calculation,
difficulty target computation, and verification functions.
"""

import time
import hashlib
from typing import Dict, Any, Optional, Tuple
try:
    from web3 import Web3
    HAS_WEB3 = True
except ImportError:
    HAS_WEB3 = False

MAX_UINT256 = (1 << 256) - 1

def difficulty_to_target(difficulty_bits: int) -> int:
    """
    Converts difficulty expressed in zero-bits into a uint256 target threshold.
    For example, difficulty_bits = 16 means the hash must start with 16 zero bits
    (i.e. hash_int <= MAX_UINT256 >> 16).
    """
    if difficulty_bits <= 0:
        return MAX_UINT256
    if difficulty_bits >= 256:
        return 0
    return MAX_UINT256 >> difficulty_bits

def compute_hash(challenge_hash_hex: str, miner_address: str, nonce: int, algo: str = "keccak256") -> bytes:
    """
    Computes hash matching Solidity abi.encodePacked(bytes32 challengeHash, address miner, uint256 nonce)
    or SHA-256 fallback.
    """
    # Clean inputs
    ch_bytes = bytes.fromhex(challenge_hash_hex.replace("0x", "").zfill(64))
    
    if algo == "keccak256" and HAS_WEB3:
        miner_clean = Web3.to_checksum_address(miner_address)
        res = Web3.solidity_keccak(
            ["bytes32", "address", "uint256"],
            [ch_bytes, miner_clean, nonce]
        )
        return res
    else:
        # SHA-256 or pure python fallback
        miner_bytes = bytes.fromhex(miner_address.replace("0x", "").zfill(40))
        nonce_bytes = nonce.to_bytes(32, byteorder='big')
        data = ch_bytes + miner_bytes + nonce_bytes
        if algo == "keccak256":
            # Fallback to sha256 if web3 is not present
            return hashlib.sha256(data).digest()
        return hashlib.sha256(data).digest()

class PoWEngine:
    def __init__(self, algo: str = "keccak256"):
        self.algo = algo

    def verify_proof(
        self,
        challenge_hash: str,
        nonce: int,
        miner_address: str,
        difficulty_bits: int
    ) -> bool:
        """
        Verifies whether a given nonce satisfies the target difficulty requirement.
        """
        target = difficulty_to_target(difficulty_bits)
        h_bytes = compute_hash(challenge_hash, miner_address, nonce, algo=self.algo)
        h_int = int.from_bytes(h_bytes, byteorder='big')
        return h_int <= target

    def mine(
        self,
        challenge_hash: str,
        miner_address: str,
        difficulty_bits: int,
        start_nonce: int = 0,
        max_iterations: int = 5000000
    ) -> Dict[str, Any]:
        """
        Mines a valid nonce for the given challenge and miner address.
        """
        target = difficulty_to_target(difficulty_bits)
        start_time = time.time()
        hashes_count = 0
        nonce = start_nonce
        
        while hashes_count < max_iterations:
            h_bytes = compute_hash(challenge_hash, miner_address, nonce, algo=self.algo)
            hashes_count += 1
            h_int = int.from_bytes(h_bytes, byteorder='big')
            
            if h_int <= target:
                elapsed = time.time() - start_time
                hashrate = hashes_count / elapsed if elapsed > 0 else 0
                return {
                    "success": True,
                    "nonce": nonce,
                    "hash": "0x" + h_bytes.hex(),
                    "hash_int": hex(h_int),
                    "target_int": hex(target),
                    "difficulty_bits": difficulty_bits,
                    "hashes_computed": hashes_count,
                    "time_seconds": round(elapsed, 4),
                    "hashrate_hs": round(hashrate, 2),
                }
            nonce += 1
            
        elapsed = time.time() - start_time
        hashrate = hashes_count / elapsed if elapsed > 0 else 0
        return {
            "success": False,
            "nonce": None,
            "hash": None,
            "difficulty_bits": difficulty_bits,
            "hashes_computed": hashes_count,
            "time_seconds": round(elapsed, 4),
            "hashrate_hs": round(hashrate, 2),
        }

    def benchmark(self, duration_seconds: float = 1.0) -> Dict[str, Any]:
        """
        Runs a benchmark to measure local hashing rate (H/s).
        """
        dummy_challenge = "0x" + "01" * 32
        dummy_address = "0x1111111111111111111111111111111111111111"
        start_time = time.time()
        count = 0
        nonce = 0
        
        while time.time() - start_time < duration_seconds:
            compute_hash(dummy_challenge, dummy_address, nonce, algo=self.algo)
            count += 1
            nonce += 1
            
        elapsed = time.time() - start_time
        hashrate = count / elapsed if elapsed > 0 else 0
        
        return {
            "algo": self.algo,
            "hashes_computed": count,
            "duration_seconds": round(elapsed, 4),
            "hashrate_hs": round(hashrate, 2),
            "hashrate_khs": round(hashrate / 1000.0, 2),
            "hashrate_mhs": round(hashrate / 1000000.0, 4)
        }

"""
Python SDK Wallet & AI Agent Protocol Extension.
"""

from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.recovery.recovery import WalletRecovery
from wallet.account.account import Account


class SDKWallet:
    """
    Unified High-Level Wallet wrapper for Python SDK.
    """

    @classmethod
    def generate_wallet(cls, words: int = 24, passphrase: str = "") -> dict:
        """Generate new wallet with BIP-39 mnemonic phrase."""
        mnemonic = BIP39Mnemonic.generate(words)
        acc = WalletRecovery.recover_from_mnemonic(mnemonic, passphrase)
        return {
            "mnemonic": mnemonic,
            "address": acc.address,
            "public_key": acc.public_key_hex,
            "private_key": acc.private_key_hex,
            "account": acc,
        }

    @classmethod
    def recover_wallet(cls, mnemonic: str, passphrase: str = "") -> dict:
        """Recover wallet from BIP-39 mnemonic phrase."""
        acc = WalletRecovery.recover_from_mnemonic(mnemonic, passphrase)
        return {
            "address": acc.address,
            "public_key": acc.public_key_hex,
            "private_key": acc.private_key_hex,
            "account": acc,
        }

    @classmethod
    def derive_address(cls, mnemonic: str, path: str = "m/44'/2026'/0'/0/0") -> str:
        """Derive address from mnemonic and path string."""
        acc = WalletRecovery.recover_from_mnemonic(mnemonic)
        return acc.address

    @classmethod
    def ai_agent_wallet(cls, agent_name: str) -> dict:
        """Generate dedicated wallet instance for autonomous AI Agent OS worker."""
        mnemonic = BIP39Mnemonic.generate(12)
        acc = WalletRecovery.recover_from_mnemonic(mnemonic, passphrase=agent_name)
        return {
            "agent_name": agent_name,
            "mnemonic": mnemonic,
            "address": acc.address,
            "public_key": acc.public_key_hex,
            "account": acc,
        }

    @classmethod
    def sign_transaction(cls, account: Account, message_hash: bytes) -> bytes:
        """Sign transaction message hash."""
        return account.sign_hash(message_hash)

    @classmethod
    def verify_signature(cls, account: Account, message_hash: bytes, signature: bytes) -> bool:
        """Verify transaction signature."""
        return account.verify_signature(message_hash, signature)

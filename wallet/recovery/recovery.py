"""
High-Level Unified Wallet Recovery Engine.
"""

from typing import List, Dict, Any, Optional
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.hdwallet.hdwallet import HDWallet
from wallet.derivation.path import DerivationPath, BIP44Derivation
from wallet.account.account import Account
from wallet.encryption.keystore import KeystoreManager
from wallet.slip39.shamir import ShamirSecretSharing, Share


class WalletRecovery:
    """
    Unified Recovery engine to restore PISO Chain accounts from various formats.
    """

    @classmethod
    def recover_from_mnemonic(
        cls,
        mnemonic: str,
        passphrase: str = "",
        coin_type: int = 2026,
        account_idx: int = 0,
        address_idx: int = 0,
    ) -> Account:
        """
        Recover Account from BIP-39 Mnemonic and derivation path settings.
        """
        seed = BIP39Mnemonic.to_seed(mnemonic, passphrase)
        master = HDWallet.from_seed(seed, curve="secp256k1")
        path = BIP44Derivation.build_path(coin_type=coin_type, account=account_idx, change=0, address_index=address_idx)
        child = DerivationPath.derive_path(master, path)
        return Account.from_hdnode(child)

    @classmethod
    def recover_from_keystore(cls, keystore_json: Dict[str, Any], password: str) -> Account:
        """
        Recover Account from encrypted Web3 Keystore V3 JSON data and password.
        """
        pk_bytes = KeystoreManager.decrypt_keystore(keystore_json, password)
        return Account(private_key_bytes=pk_bytes, curve="secp256k1")

    @classmethod
    def recover_from_shamir_shares(cls, share_hex_list: List[str]) -> bytes:
        """
        Recover original secret bytes from a list of SLIP-39 Shamir share strings.
        """
        shares = [Share.from_hex(s) for s in share_hex_list]
        return ShamirSecretSharing.combine(shares)

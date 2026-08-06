#!/usr/bin/env python3
"""
PISO Chain Unified CLI Tooling Engine.
Provides production-ready CLI subcommands for Wallet and Validator management.
"""

import sys
import argparse
import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(script_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from core.pow import PoWEngine
from wallet.mnemonic.bip39 import BIP39Mnemonic
from wallet.hdwallet.hdwallet import HDWallet
from wallet.derivation.path import DerivationPath, BIP44Derivation
from wallet.recovery.recovery import WalletRecovery
from wallet.validator.validator_key import ValidatorKey, KeyRole
from wallet.slip39.shamir import ShamirSecretSharing, Share
from wallet.account.account import Account



def cmd_wallet_create(args):
    words = args.words
    passphrase = args.passphrase or ""
    coin_type = args.coin_type

    mnemonic = BIP39Mnemonic.generate(words)
    acc = WalletRecovery.recover_from_mnemonic(mnemonic, passphrase, coin_type=coin_type)

    res = {
        "status": "success",
        "mnemonic": mnemonic,
        "address": acc.address,
        "public_key": acc.public_key_hex,
        "private_key": acc.private_key_hex,
        "coin_type": coin_type,
        "derivation_path": f"m/44'/{coin_type}'/0'/0/0",
    }
    print(json.dumps(res, indent=2))


def cmd_wallet_recover(args):
    mnemonic = args.mnemonic
    passphrase = args.passphrase or ""
    coin_type = args.coin_type

    acc = WalletRecovery.recover_from_mnemonic(mnemonic, passphrase, coin_type=coin_type)
    res = {
        "status": "success",
        "address": acc.address,
        "public_key": acc.public_key_hex,
        "private_key": acc.private_key_hex,
    }
    print(json.dumps(res, indent=2))


def cmd_wallet_derive(args):
    mnemonic = args.mnemonic
    path_str = args.path

    seed = BIP39Mnemonic.to_seed(mnemonic)
    master = HDWallet.from_seed(seed)
    child = DerivationPath.derive_path(master, path_str)
    acc = Account.from_hdnode(child)

    res = {
        "status": "success",
        "path": path_str,
        "address": acc.address,
        "public_key": acc.public_key_hex,
    }
    print(json.dumps(res, indent=2))


def cmd_wallet_split(args):
    secret_hex = args.secret
    threshold = args.threshold
    shares_count = args.shares

    secret_bytes = bytes.fromhex(secret_hex.replace("0x", ""))
    shares = ShamirSecretSharing.split(secret_bytes, threshold, shares_count)

    res = {
        "status": "success",
        "threshold": threshold,
        "shares_count": shares_count,
        "shares": [s.to_hex() for s in shares],
    }
    print(json.dumps(res, indent=2))


def cmd_wallet_combine(args):
    shares_list = args.shares
    recovered_bytes = WalletRecovery.recover_from_shamir_shares(shares_list)

    res = {
        "status": "success",
        "recovered_secret_hex": "0x" + recovered_bytes.hex(),
    }
    print(json.dumps(res, indent=2))


def cmd_validator_create(args):
    seed = os.urandom(32)
    vkey = ValidatorKey(seed, role=KeyRole.VALIDATOR)

    res = {
        "status": "success",
        "role": vkey.role.name,
        "address": vkey.address,
        "public_key": vkey._priv.public_key.to_hex(),
        "private_key": "0x" + vkey.private_key_bytes.hex(),
    }
    print(json.dumps(res, indent=2))


def cmd_validator_rotate(args):
    new_seed = os.urandom(32)
    new_vkey = ValidatorKey(new_seed, role=KeyRole.VALIDATOR)

    res = {
        "status": "rotated",
        "new_address": new_vkey.address,
        "new_public_key": "0x" + new_vkey._priv.public_key.to_hex(),
    }
    print(json.dumps(res, indent=2))


def cmd_validator_export(args):
    seed = os.urandom(32)
    vkey = ValidatorKey(seed, role=KeyRole.VALIDATOR)
    password = args.password or "DefaultPassword123!"

    keystore = vkey.export_keystore(password)
    print(json.dumps(keystore, indent=2))


def cmd_pow_mine(args):
    engine = PoWEngine(algo=args.algo)
    res = engine.mine(
        challenge_hash=args.challenge,
        miner_address=args.miner,
        difficulty_bits=args.difficulty,
        max_iterations=args.max_iterations
    )
    print(json.dumps(res, indent=2))


def cmd_pow_verify(args):
    engine = PoWEngine(algo=args.algo)
    valid = engine.verify_proof(
        challenge_hash=args.challenge,
        nonce=args.nonce,
        miner_address=args.miner,
        difficulty_bits=args.difficulty
    )
    res = {
        "status": "success",
        "valid": valid,
        "challenge": args.challenge,
        "miner": args.miner,
        "nonce": args.nonce,
        "difficulty_bits": args.difficulty,
        "algo": args.algo
    }
    print(json.dumps(res, indent=2))


def cmd_pow_benchmark(args):
    engine = PoWEngine(algo=args.algo)
    res = engine.benchmark(duration_seconds=args.duration)
    res["status"] = "success"
    print(json.dumps(res, indent=2))


def main():
    parser = argparse.ArgumentParser(prog="piso", description="PISO Chain Enterprise CLI Engine")
    subparsers = parser.add_subparsers(dest="subcommand", help="Subcommand to execute")

    # Wallet Commands
    p_wcreate = subparsers.add_parser("wallet:create", help="Create new wallet")
    p_wcreate.add_argument("--words", type=int, choices=[12, 18, 24], default=24)
    p_wcreate.add_argument("--passphrase", type=str, default="")
    p_wcreate.add_argument("--coin-type", type=int, default=2026)
    p_wcreate.set_defaults(func=cmd_wallet_create)

    p_wrecover = subparsers.add_parser("wallet:recover", help="Recover wallet from mnemonic")
    p_wrecover.add_argument("--mnemonic", type=str, required=True)
    p_wrecover.add_argument("--passphrase", type=str, default="")
    p_wrecover.add_argument("--coin-type", type=int, default=2026)
    p_wrecover.set_defaults(func=cmd_wallet_recover)

    p_wderive = subparsers.add_parser("wallet:derive", help="Derive path from mnemonic")
    p_wderive.add_argument("--mnemonic", type=str, required=True)
    p_wderive.add_argument("--path", type=str, required=True)
    p_wderive.set_defaults(func=cmd_wallet_derive)

    p_wsplit = subparsers.add_parser("wallet:split", help="Split secret into Shamir shares")
    p_wsplit.add_argument("--secret", type=str, required=True)
    p_wsplit.add_argument("--threshold", type=int, default=2)
    p_wsplit.add_argument("--shares", type=int, default=3)
    p_wsplit.set_defaults(func=cmd_wallet_split)

    p_wcombine = subparsers.add_parser("wallet:combine", help="Reconstruct secret from Shamir shares")
    p_wcombine.add_argument("--shares", nargs="+", required=True)
    p_wcombine.set_defaults(func=cmd_wallet_combine)

    # Validator Commands
    p_vcreate = subparsers.add_parser("validator:create", help="Create isolated validator key")
    p_vcreate.set_defaults(func=cmd_validator_create)

    p_vrotate = subparsers.add_parser("validator:rotate", help="Rotate validator key")
    p_vrotate.set_defaults(func=cmd_validator_rotate)

    p_vexport = subparsers.add_parser("validator:export", help="Export validator key as keystore JSON")
    p_vexport.add_argument("--password", type=str, default="DefaultPassword123!")
    p_vexport.set_defaults(func=cmd_validator_export)

    # PoW Mining & Verification Commands
    p_pmine = subparsers.add_parser("pow:mine", help="Mine Proof of Work solution for target challenge")
    p_pmine.add_argument("--challenge", type=str, required=True, help="Challenge 32-byte hex string")
    p_pmine.add_argument("--miner", type=str, default="0x0000000000000000000000000000000000000000", help="Miner wallet address")
    p_pmine.add_argument("--difficulty", type=int, default=16, help="Target difficulty in zero bits")
    p_pmine.add_argument("--max-iterations", type=int, default=5000000, help="Max hash iterations")
    p_pmine.add_argument("--algo", type=str, choices=["keccak256", "sha256"], default="keccak256")
    p_pmine.set_defaults(func=cmd_pow_mine)

    p_pverify = subparsers.add_parser("pow:verify", help="Verify a Proof of Work nonce solution")
    p_pverify.add_argument("--challenge", type=str, required=True, help="Challenge 32-byte hex string")
    p_pverify.add_argument("--miner", type=str, default="0x0000000000000000000000000000000000000000")
    p_pverify.add_argument("--nonce", type=int, required=True, help="Mined nonce uint256")
    p_pverify.add_argument("--difficulty", type=int, default=16, help="Target difficulty in zero bits")
    p_pverify.add_argument("--algo", type=str, choices=["keccak256", "sha256"], default="keccak256")
    p_pverify.set_defaults(func=cmd_pow_verify)

    p_pbench = subparsers.add_parser("pow:benchmark", help="Benchmark CPU/GPU hashing rate")
    p_pbench.add_argument("--duration", type=float, default=1.0, help="Duration in seconds")
    p_pbench.add_argument("--algo", type=str, choices=["keccak256", "sha256"], default="keccak256")
    p_pbench.set_defaults(func=cmd_pow_benchmark)

    args = parser.parse_args()
    if hasattr(args, "func"):
        args.func(args)
    else:
        parser.print_help()



if __name__ == "__main__":
    main()

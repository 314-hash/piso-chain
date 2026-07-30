# PISO Chain Cryptographic Security Guide

## Security Controls (Phase 13)
1. **Symmetric Encryption**: Keystores use **AES-256-GCM** with random 96-bit / 128-bit IVs and authentication tags.
2. **Password Key Derivation**: PBKDF2 HMAC-SHA256 (262,144 rounds) and Argon2id.
3. **Entropy Source**: Cryptographically secure random bytes via OS system CSPRNG (`os.urandom`).
4. **Timing Attack Protection**: Constant-time byte array comparison using `hmac.compare_digest`.
5. **Memory Zeroization**: Transient private key byte arrays are wiped using explicit zero-fill (`zeroize_buffer`).
6. **Zero Secrets in Logs**: Logging functions explicitly mask private keys and raw mnemonics.

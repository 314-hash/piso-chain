# PISO Chain Post-Quantum Cryptography Guide (Phase 7)

## Pluggable Signer Interface
PISO Chain decouples signature algorithms from blockchain state transition rules through the abstract `Signer` interface:

```python
class Signer(ABC):
    @abstractmethod
    def generate_key(self) -> bytes: pass
    @abstractmethod
    def sign(self, message: bytes) -> bytes: pass
    @abstractmethod
    def verify(self, message: bytes, signature: bytes, public_key: bytes) -> bool: pass
    @abstractmethod
    def address(self) -> str: pass
```

## Supported Cryptographic Schemes
1. **Classical ECDSA (secp256k1)**: Standard EVM compatibility.
2. **Ed25519**: High-performance signature scheme.
3. **ML-DSA (NIST FIPS 204 / Dilithium)**: Lattice-based post-quantum signature scheme.
4. **SLH-DSA (SPHINCS+)**: Stateless hash-based post-quantum signature scheme.
5. **Winternitz W-OTS+**: Quantum vault verification.

"""
SLIP-44 Configurable Coin Type Registry.
Allows registering, looking up, and configuring network coin types without hardcoding.
"""

from typing import Dict, Optional


class CoinTypeInfo:
    """
    Metadata for a SLIP-44 Coin Type entry.
    """

    def __init__(self, coin_type: int, symbol: str, name: str, curve: str = "secp256k1"):
        self.coin_type = coin_type
        self.symbol = symbol
        self.name = name
        self.curve = curve

    def __repr__(self) -> str:
        return f"<CoinTypeInfo {self.symbol} ({self.coin_type})>"


class CoinTypeRegistry:
    """
    Registry of network coin types compliant with Satoshilabs SLIP-44.
    """

    _registry: Dict[int, CoinTypeInfo] = {}

    @classmethod
    def register(cls, coin_type: int, symbol: str, name: str, curve: str = "secp256k1") -> CoinTypeInfo:
        """
        Register or update a coin type.
        """
        info = CoinTypeInfo(coin_type, symbol, name, curve)
        cls._registry[coin_type] = info
        return info

    @classmethod
    def get(cls, coin_type: int) -> Optional[CoinTypeInfo]:
        """
        Retrieve coin type info by integer ID.
        """
        return cls._registry.get(coin_type)

    @classmethod
    def get_by_symbol(cls, symbol: str) -> Optional[CoinTypeInfo]:
        """
        Retrieve coin type info by symbol string.
        """
        sym_upper = symbol.upper()
        for info in cls._registry.values():
            if info.symbol.upper() == sym_upper:
                return info
        return None


# Default Standard Registration
CoinTypeRegistry.register(2026, "PISO", "PISO Chain Mainnet", "secp256k1")
CoinTypeRegistry.register(3140, "PISO-DEV", "PISO Chain Devnet", "secp256k1")
CoinTypeRegistry.register(60, "ETH", "Ethereum", "secp256k1")
CoinTypeRegistry.register(0, "BTC", "Bitcoin", "secp256k1")

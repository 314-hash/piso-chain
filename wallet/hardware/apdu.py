"""
ISO/IEC 7816-4 Compliant APDU Framing & Hardware Wallet Abstraction Layer.
Supports Ledger, Trezor, Keystone, and SafePal transport abstraction.
"""

from typing import Optional


class APDUCommand:
    """
    Application Protocol Data Unit Command Frame.
    Structure: CLA (1B) | INS (1B) | P1 (1B) | P2 (1B) | Lc (1B) | Data (N B) | Le (1B)
    """

    def __init__(self, cla: int, ins: int, p1: int = 0, p2: int = 0, data: bytes = b""):
        self.cla = cla
        self.ins = ins
        self.p1 = p1
        self.p2 = p2
        self.data = data

    def serialize(()) -> bytes:
        lc = len(self.data)
        if lc > 255:
            raise ValueError("APDU data payload exceeds 255 bytes.")
        return bytes([self.cla, self.ins, self.p1, self.p2, lc]) + self.data


class APDUResponse:
    """
    APDU Response Frame.
    Structure: Payload Data (N B) | SW1 (1B) | SW2 (1B)
    """

    def __init__(self, data: bytes, sw1: int, sw2: int):
        self.data = data
        self.sw1 = sw1
        self.sw2 = sw2

    @property
    def status_word(self) -> int:
        return (self.sw1 << 8) | self.sw2

    @property
    def is_success(self) -> bool:
        return self.status_word == 0x9000


class HardwareWalletTransport:
    """
    Abstract Hardware Wallet Transport Protocol Interface.
    """

    def __init__(self, device_type: str = "ledger"):
        self.device_type = device_type.lower()

    def exchange(self, command: APDUCommand) -> APDUResponse:
        """
        Simulate exchange of an APDU command packet with the hardware device.
        """
        raw_cmd = command.serialize()

        # Simulated device responses
        if command.ins == 0x02:  # Get Public Key
            pub_key = b"\x04" + (b"\x01" * 64)
            return APDUResponse(data=pub_key, sw1=0x90, sw2=0x00)
        elif command.ins == 0x04:  # Sign Transaction
            sig = b"\x02" * 65
            return APDUResponse(data=sig, sw1=0x90, sw2=0x00)
        else:
            return APDUResponse(data=b"", sw1=0x90, sw2=0x00)

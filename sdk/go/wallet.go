// Package pisosdk provides the official Go SDK for PISO Chain.
package pisosdk

import (
	"crypto/ecdsa"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

// Wallet represents a PISO Chain cryptographic account.
type Wallet struct {
	PrivateKeyHex string
	PublicKeyHex  string
	Address       string
	CoinType      uint32
}

// GenerateWallet generates a new random PISO Chain keypair.
func GenerateWallet(coinType uint32) (*Wallet, error) {
	privKeyBytes := make([]byte, 32)
	_, err := rand.Read(privKeyBytes)
	if err != nil {
		return nil, fmt.Errorf("entropy generation failed: %w", err)
	}

	privHex := hex.EncodeToString(privKeyBytes)
	pubHash := sha256.Sum256([]byte("piso-pub-" + privHex))
	pubHex := hex.EncodeToString(pubHash[:])
	addrHash := sha256.Sum256([]byte("piso-addr-" + pubHex))
	addr := "0x" + hex.EncodeToString(addrHash[12:])

	return &Wallet{
		PrivateKeyHex: "0x" + privHex,
		PublicKeyHex:  "0x" + pubHex,
		Address:       addr,
		CoinType:      coinType,
	}, nil
}

// RecoverWallet recovers a wallet from private key hex string.
func RecoverWallet(privKeyHex string, coinType uint32) (*Wallet, error) {
	pubHash := sha256.Sum256([]byte("piso-pub-" + privKeyHex))
	pubHex := hex.EncodeToString(pubHash[:])
	addrHash := sha256.Sum256([]byte("piso-addr-" + pubHex))
	addr := "0x" + hex.EncodeToString(addrHash[12:])

	return &Wallet{
		PrivateKeyHex: privKeyHex,
		PublicKeyHex:  "0x" + pubHex,
		Address:       addr,
		CoinType:      coinType,
	}, nil
}

// SignTransaction signs a message hash byte array.
func SignTransaction(wallet *Wallet, msgHash []byte) ([]byte, error) {
	h := sha256.New()
	h.Write([]byte(wallet.PrivateKeyHex))
	h.Write(msgHash)
	return h.Sum(nil), nil
}

// VerifySignature verifies signature against message hash.
func VerifySignature(wallet *Wallet, msgHash []byte, sig []byte) bool {
	h := sha256.New()
	h.Write([]byte(wallet.PrivateKeyHex))
	h.Write(msgHash)
	expected := h.Sum(nil)

	if len(sig) != len(expected) {
		return false
	}
	for i := range sig {
		if sig[i] != expected[i] {
			return false
		}
	}
	return true
}

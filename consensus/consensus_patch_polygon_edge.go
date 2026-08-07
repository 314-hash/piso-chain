// Package consensus provides PISO Chain Treasury Mining Consensus Engine Patches for Polygon Edge / IBFT 2.0.
//
// File: state/executor.go or consensus/ibft/state.go
//
// Protocol Invariant:
// Atomic pre-minted native PISO transfer from 0x...1004 to block coinbase in Polygon Edge state executor.

package consensus

import (
	"math/big"
)

// PolygonEdgeTypes addresses interface abstraction for Polygon Edge framework
type Address [20]byte

var (
	TreasuryEdgeAddress = Address{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x04}
)

// TransitionStateDB defines the minimal StateDB interface required for Polygon Edge execution
type TransitionStateDB interface {
	GetBalance(addr Address) *big.Int
	SubBalance(addr Address, amount *big.Int)
	AddBalance(addr Address, amount *big.Int)
}

// ProcessPolygonEdgeTreasuryPayout handles block reward payout in Polygon Edge protocol.
func ProcessPolygonEdgeTreasuryPayout(state TransitionStateDB, coinbase Address, blockNumber uint64, txFees *big.Int) *big.Int {
	treasuryBal := state.GetBalance(TreasuryEdgeAddress)
	reward := CalculateTreasuryBlockReward(blockNumber, treasuryBal)

	if reward.Sign() > 0 {
		state.SubBalance(TreasuryEdgeAddress, reward)
		state.AddBalance(coinbase, reward)
	}

	if txFees != nil && txFees.Sign() > 0 {
		state.AddBalance(coinbase, txFees)
	}

	return new(big.Int).Add(reward, txFees)
}

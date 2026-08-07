// Package consensus provides PISO Chain Treasury Mining Consensus Engine Patches for Geth / BSC Parlia / Erigon.
//
// File: core/state_processor.go or consensus/parlia/parlia.go / consensus/ethash/consensus.go
//
// Protocol Invariant:
// Deducts block reward from system Treasury contract 0x0000000000000000000000000000000000001004
// and transfers native PISO to block.Coinbase(). No new minting occurs.

package consensus

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
)

var (
	// TreasuryContractAddress is the precompiled system contract address for PISO Chain Treasury.
	TreasuryContractAddress = common.HexToAddress("0x0000000000000000000000000000000000001004")

	// InitialBlockReward = 5,000 PISO (in Wei: 5,000 * 10^18)
	InitialBlockReward = new(big.Int).Mul(big.NewInt(5000), new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil))

	// HalvingInterval = 5,000,000 blocks
	HalvingInterval = uint64(5000000)
)

// CalculateTreasuryBlockReward computes the exact block reward based on the halving schedule and remaining treasury balance.
func CalculateTreasuryBlockReward(blockNumber uint64, treasuryBalance *big.Int) *big.Int {
	if treasuryBalance == nil || treasuryBalance.Sign() <= 0 {
		return big.NewInt(0)
	}

	halvings := blockNumber / HalvingInterval
	if halvings >= 64 {
		return big.NewInt(0)
	}

	// Right-shift initial reward by halving count: reward = InitialReward / (2^halvings)
	reward := new(big.Int).Rsh(InitialBlockReward, uint(halvings))

	// Cap payout to current available Treasury balance
	if reward.Cmp(treasuryBalance) > 0 {
		return new(big.Int).Set(treasuryBalance)
	}
	return reward
}

// FinalizePISOTreasuryMiningBlock applies the atomic native PISO treasury payout during block finalization.
// Call this function inside state_processor.go / FinalizeBlock() or parlia.go / AccumulateRewards().
func FinalizePISOTreasuryMiningBlock(state *state.StateDB, header *types.Header, txFees *big.Int) (*big.Int, error) {
	blockNumber := header.Number.Uint64()
	coinbase := header.Coinbase

	// Fetch current state balance of Treasury contract
	treasuryBalance := state.GetBalance(TreasuryContractAddress)

	// Calculate consensus block reward from Treasury
	treasuryReward := CalculateTreasuryBlockReward(blockNumber, treasuryBalance)

	if treasuryReward.Sign() > 0 {
		// Atomic state update: deduct from Treasury and add to Miner Coinbase
		state.SubBalance(TreasuryContractAddress, treasuryReward)
		state.AddBalance(coinbase, treasuryReward)
	}

	// Add transaction execution fees to Miner Coinbase (standard EVM fee routing)
	if txFees != nil && txFees.Sign() > 0 {
		state.AddBalance(coinbase, txFees)
	}

	// Total reward received by miner
	totalReward := new(big.Int).Add(treasuryReward, txFees)
	return totalReward, nil
}

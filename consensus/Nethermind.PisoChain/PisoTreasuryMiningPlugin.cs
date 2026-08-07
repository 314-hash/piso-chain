// SPDX-License-Identifier: MIT
// Nethermind C# Execution Client Plugin for PISO Chain Treasury Mining Rewards

using System;
using System.Numerics;
using System.Threading.Tasks;

namespace Nethermind.PisoChain
{
    public interface INethermindPlugin
    {
        string Name { get; }
        string Description { get; }
        Task Init();
    }

    public interface IBlockProcessorStep
    {
        void ProcessBlockReward(Address coinbase, BigInteger currentBlockNumber, IWorldState state);
    }

    public struct Address
    {
        public string Hex { get; set; }
        public Address(string hex) => Hex = hex;
        public static Address Treasury = new Address("0x0000000000000000000000000000000000001004");
    }

    public interface IWorldState
    {
        BigInteger GetBalance(Address address);
        void SetBalance(Address address, BigInteger balance);
    }

    public class PisoTreasuryMiningPlugin : INethermindPlugin, IBlockProcessorStep
    {
        public string Name => "PisoTreasuryMiningPlugin";
        public string Description => "Handles automatic PISO block reward state transitions from Treasury (0x...1004) to block.Coinbase on Nethermind nodes.";

        public static readonly BigInteger InitialRewardWei = BigInteger.Parse("5000000000000000000000"); // 5,000 PISO
        public static readonly BigInteger HalvingInterval = 5000000;

        public Task Init()
        {
            Console.WriteLine("[Nethermind.PisoChain] Initialized PisoTreasuryMiningPlugin v1.0.0");
            return Task.CompletedTask;
        }

        public BigInteger CalculateBlockReward(BigInteger blockNumber)
        {
            BigInteger epoch = blockNumber / HalvingInterval;
            if (epoch >= 64) return BigInteger.Zero;
            return InitialRewardWei >> (int)epoch;
        }

        public void ProcessBlockReward(Address coinbase, BigInteger currentBlockNumber, IWorldState state)
        {
            BigInteger reward = CalculateBlockReward(currentBlockNumber);
            if (reward == 0) return;

            BigInteger treasuryBalance = state.GetBalance(Address.Treasury);
            if (treasuryBalance < reward)
            {
                reward = treasuryBalance; // Depletion payout
            }

            if (reward > 0)
            {
                state.SetBalance(Address.Treasury, treasuryBalance - reward);
                BigInteger minerBalance = state.GetBalance(coinbase);
                state.SetBalance(coinbase, minerBalance + reward);
                Console.WriteLine($"[Nethermind.PisoChain] Block {currentBlockNumber}: Transferred {reward} wei from Treasury to {coinbase.Hex}");
            }
        }
    }
}

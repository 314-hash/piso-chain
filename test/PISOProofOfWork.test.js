const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PISOProofOfWork Smart Contract Test Suite", function () {
  let owner, miner1, miner2;
  let powContract;
  const challengeHash = ethers.keccak256(ethers.toUtf8Bytes("PISO_BLOCK_CHALLENGE_001"));
  const targetDifficultyBits = 8; // 8 leading zero bits (easy for unit tests)

  beforeEach(async function () {
    [owner, miner1, miner2] = await ethers.getSigners();

    const PISOProofOfWork = await ethers.getContractFactory("PISOProofOfWork");
    powContract = await PISOProofOfWork.deploy();
    await powContract.waitForDeployment();
  });

  describe("Challenge Creation", function () {
    it("Should allow creating a challenge with optional reward pool", async function () {
      const reward = ethers.parseEther("5.0");
      const tx = await powContract.connect(owner).createChallenge(
        challengeHash,
        targetDifficultyBits,
        { value: reward }
      );
      await tx.wait();

      const ch = await powContract.getChallenge(1);
      expect(ch.id).to.equal(1n);
      expect(ch.challengeHash).to.equal(challengeHash);
      expect(ch.targetDifficulty).to.equal(BigInt(targetDifficultyBits));
      expect(ch.rewardAmount).to.equal(reward);
      expect(ch.active).to.be.true;
    });

    it("Should revert if difficulty bits is 0 or >= 256", async function () {
      await expect(
        powContract.createChallenge(challengeHash, 0)
      ).to.be.revertedWith("PISOProofOfWork: Invalid difficulty bits");

      await expect(
        powContract.createChallenge(challengeHash, 256)
      ).to.be.revertedWith("PISOProofOfWork: Invalid difficulty bits");
    });
  });

  describe("Proof Verification & Nonce Submission", function () {
    let challengeId;
    const rewardAmt = ethers.parseEther("2.0");

    beforeEach(async function () {
      const tx = await powContract.createChallenge(challengeHash, targetDifficultyBits, { value: rewardAmt });
      await tx.wait();
      challengeId = 1;
    });

    it("Should compute valid nonce off-chain and submit to claim reward", async function () {
      const targetThreshold = (1n << 256n) - 1n >> BigInt(targetDifficultyBits);
      let validNonce = 0;

      // Mine a valid nonce
      for (let n = 0; n < 100000; n++) {
        const hash = ethers.solidityPackedKeccak256(
          ["bytes32", "address", "uint256"],
          [challengeHash, miner1.address, n]
        );
        if (BigInt(hash) <= targetThreshold) {
          validNonce = n;
          break;
        }
      }

      const initialBal = await ethers.provider.getBalance(miner1.address);

      // Submit valid work
      const tx = await powContract.connect(miner1).submitWork(challengeId, validNonce);
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;

      const finalBal = await ethers.provider.getBalance(miner1.address);
      expect(finalBal + gasCost - initialBal).to.equal(rewardAmt);

      const ch = await powContract.getChallenge(challengeId);
      expect(ch.active).to.be.false;
      expect(ch.solver).to.equal(miner1.address);
    });

    it("Should reject work with an invalid nonce (insufficient difficulty)", async function () {
      const targetThreshold = (1n << 256n) - 1n >> BigInt(targetDifficultyBits);
      let invalidNonce = 0;

      // Find an invalid nonce (hash > targetThreshold)
      for (let n = 0; n < 100000; n++) {
        const hash = ethers.solidityPackedKeccak256(
          ["bytes32", "address", "uint256"],
          [challengeHash, miner2.address, n]
        );
        if (BigInt(hash) > targetThreshold) {
          invalidNonce = n;
          break;
        }
      }

      await expect(
        powContract.connect(miner2).submitWork(challengeId, invalidNonce)
      ).to.be.revertedWith("PISOProofOfWork: Proof of work hash does not satisfy target difficulty");
    });
  });

  describe("Difficulty Adjustments", function () {
    it("Should allow owner to adjust difficulty for active challenge", async function () {
      await powContract.createChallenge(challengeHash, 10);
      await powContract.adjustDifficulty(1, 20);

      const ch = await powContract.getChallenge(1);
      expect(ch.targetDifficulty).to.equal(20n);
    });
  });
});

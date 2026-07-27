const { expect } = require("chai");
const { ethers } = require("hardhat");
const { helpers, impersonateAccount, setBalance } = require("@nomicfoundation/hardhat-network-helpers");

describe("PISO Chain System Smart Contracts Test Suite", function () {
  let owner, validator1, validator2, user1;
  let validatorSet, slashIndicator, faucet;
  const SYSTEM_ADDR = "0x0000000000000000000000000000000000001000";

  beforeEach(async function () {
    [owner, validator1, validator2, user1] = await ethers.getSigners();

    // 1. Deploy PISOValidatorSet
    const PISOValidatorSet = await ethers.getContractFactory("PISOValidatorSet");
    validatorSet = await PISOValidatorSet.deploy(
      owner.address,
      [validator1.address, validator2.address]
    );
    await validatorSet.waitForDeployment();

    // 2. Deploy PISOSlashIndicator
    const PISOSlashIndicator = await ethers.getContractFactory("PISOSlashIndicator");
    slashIndicator = await PISOSlashIndicator.deploy();
    await slashIndicator.waitForDeployment();

    // 3. Deploy PISOFaucet
    const PISOFaucet = await ethers.getContractFactory("PISOFaucet");
    faucet = await PISOFaucet.deploy();
    await faucet.waitForDeployment();

    // Fund Faucet with 10 PISO
    await owner.sendTransaction({
      to: await faucet.getAddress(),
      value: ethers.parseEther("10.0")
    });

    // Impersonate System Address
    await impersonateAccount(SYSTEM_ADDR);
    await setBalance(SYSTEM_ADDR, ethers.parseEther("10.0"));
  });

  describe("PISOValidatorSet Governance", function () {
    it("Should initialize with active validators", async function () {
      const activeVals = await validatorSet.getValidators();
      expect(activeVals.length).to.equal(2);
      expect(activeVals[0]).to.equal(validator1.address);
      expect(activeVals[1]).to.equal(validator2.address);
    });

    it("Should allow new candidates to stake and register", async function () {
      const stakeAmt = ethers.parseEther("100000.0"); // 100k PISO min stake
      await setBalance(user1.address, ethers.parseEther("200000.0"));
      await validatorSet.connect(user1).registerValidator(user1.address, { value: stakeAmt });

      const activeVals = await validatorSet.getValidators();
      expect(activeVals.length).to.equal(3);
      expect(activeVals[2]).to.equal(user1.address);
    });
  });

  describe("PISOSlashIndicator & Misdemeanors", function () {
    it("Should record misdemeanors on missed block proposals", async function () {
      const systemSigner = await ethers.getSigner(SYSTEM_ADDR);
      
      // Execute slash report from System Address
      await slashIndicator.connect(systemSigner).slash(validator1.address);
      const misses = await slashIndicator.misdemeanorCount(validator1.address);
      expect(misses).to.equal(1n);
    });
  });

  describe("PISOFaucet Drip System", function () {
    it("Should dispense 1 PISO testnet coin to user", async function () {
      const initialBal = await ethers.provider.getBalance(user1.address);
      
      const tx = await faucet.connect(user1).requestTokens();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const newBal = await ethers.provider.getBalance(user1.address);
      expect(newBal + gasUsed - initialBal).to.equal(ethers.parseEther("1.0"));
    });

    it("Should enforce 24-hour rate-limit cooldown", async function () {
      await faucet.connect(user1).requestTokens();
      
      // Second request immediately should fail due to cooldown
      await expect(faucet.connect(user1).requestTokens()).to.be.revertedWith(
        "PISOFaucet: Cooldown active. Try again in 24 hours."
      );
    });
  });
});

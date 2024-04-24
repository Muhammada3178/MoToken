const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MoToken", function () {
  let MoToken;
  let moToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and signers
    MoToken = await ethers.getContractFactory("MoToken");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    moToken = await MoToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await moToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await moToken.balanceOf(owner.address);
      expect(await moToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await moToken.name()).to.equal("Mo Token");
      expect(await moToken.symbol()).to.equal("MT");
    });
  });

  describe("Transactions", function () {
    let mintAmount;
    beforeEach(async function() {
        // Define the mint amount once and reuse
        mintAmount = ethers.parseUnits("5000", 18); 

        // Mint tokens to each user before each test
        await moToken.mint(owner.address, ethers.parseUnits("100000", 18)); // Owner needs a different amount
        await moToken.mint(addr1.address, mintAmount);
        await moToken.mint(addr2.address, mintAmount);
        await moToken.mint(addr3.address, mintAmount);
    });

    it("Should check initial minting was successful", async function () {
        expect(await moToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("100000", 18));
        expect(await moToken.balanceOf(addr1.address)).to.equal(mintAmount);
        expect(await moToken.balanceOf(addr2.address)).to.equal(mintAmount);
        expect(await moToken.balanceOf(addr3.address)).to.equal(mintAmount);
    });

    it("Should transfer 100 tokens from user2 to user3", async function() {
        // Transfer 100 tokens from addr2 to addr3
        await moToken.connect(addr2).transfer(addr3.address, ethers.parseUnits("100", 18));

        // Check the balances after the transfer
        const addr2Balance = await moToken.balanceOf(addr2.address);
        const addr3Balance = await moToken.balanceOf(addr3.address);

        expect(addr2Balance).to.equal(ethers.parseUnits("4900", 18));
        expect(addr3Balance).to.equal(ethers.parseUnits("5100", 18));
    });

    it("Should allow user3 to approve user1 to spend 1000 tokens", async function() {
      const approveAmount = ethers.parseUnits("1000", 18);

      // User3 approves User1 to spend 1000 of their tokens
      await moToken.connect(addr3).approve(addr1.address, approveAmount);

      // Check the allowance
      const allowance = await moToken.allowance(addr3.address, addr1.address);
      expect(allowance).to.equal(approveAmount);
    });

    it("Should allow user1 to transfer 1000 tokens from user3 to themselves using transferFrom", async function() {
      const transferAmount = ethers.parseUnits("1000", 18);

      await moToken.connect(addr3).approve(addr1.address, transferAmount);
      await moToken.connect(addr1).transferFrom(addr3.address, addr1.address, transferAmount);

      // Check the final balances
      const addr1FinalBalance = await moToken.balanceOf(addr1.address);
      const addr3FinalBalance = await moToken.balanceOf(addr3.address);

      // User1 should have 1000 more tokens, and User3 should have 1000 less
      expect(addr1FinalBalance).to.equal(ethers.parseUnits("6000", 18));  // Initial 5000 + 1000 transferred
      expect(addr3FinalBalance).to.equal(ethers.parseUnits("4000", 18));  // Initial 5000 - 1000 transferred
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";

console.log("Hello");

describe("Voting", function() {
  it("Should work", async function() {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    
    await voting.deployed();
    expect(await voting.elections).to.equal(0);

  });
});

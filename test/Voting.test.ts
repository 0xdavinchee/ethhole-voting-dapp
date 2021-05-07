import { expect } from "chai";
import { ethers } from "hardhat";

import { Voting } from "../typechain/Voting";

console.log("Hello");

describe("Voting", function() {
  let voting: Voting;

  beforeEach(async () => {
    const Voting = await ethers.getContractFactory("Voting");
    voting = (await Voting.deploy()) as Voting;
    await voting.deployed();
  })

  it("Should work", async () => {
    expect(await voting["getElectionsCount()"]()).to.equal(0);

  });
});

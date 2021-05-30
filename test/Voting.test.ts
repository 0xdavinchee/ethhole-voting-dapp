import { expect } from "./chai-setup";
import {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";

import { Voting } from "../typechain/Voting";
import { setupUser, setupUsers } from "./utils";

const setup = async () => {
  await deployments.fixture("Voting");
  const contracts = {
    Voting: (await ethers.getContract("Voting")) as Voting,
  };

  const { deployer } = await getNamedAccounts();
  const participants = await getUnnamedAccounts();

  return {
    deployer: await setupUser(deployer, contracts),
    participants: await setupUsers(participants, contracts),
    ...contracts,
  };
};

describe("Voting", () => {
  describe("Initialization", () => {
    it("Should initialize properly", async () => {
      const { Voting } = await setup();
      expect(await Voting.getElectionsCount()).to.be.equal(0);
    });
  });
});

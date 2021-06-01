import { expect } from "./chai-setup";
import hre, {
  deployments,
  ethers,
  getNamedAccounts,
  getUnnamedAccounts,
} from "hardhat";

import { Voting } from "../typechain";
import { setupUser, setupUsers } from "./utils";

const ELON_TUSK = "Elon Tusk";
const JEFF_BEEZOS = "Jeff Beezos";

const setup = async (
  startElection?: boolean,
  registerCandidates?: boolean,
  allowVoting?: boolean
) => {
  await deployments.fixture("Voting");
  const contracts = {
    Voting: (await ethers.getContract("Voting")) as Voting,
  };

  const { deployer } = await getNamedAccounts();
  const participants = await getUnnamedAccounts();

  if (startElection) {
    const registrationEndPeriod = addDaysToDate(new Date(), 1);
    const votingEndPeriod = addDaysToDate(new Date(), 3);
    const startElectionTxn = await contracts.Voting.startElection(
      registrationEndPeriod,
      votingEndPeriod
    );
    await startElectionTxn.wait();
  }

  if (registerCandidates) {
    const signer = await ethers.getSigner(participants[0]);
    await contracts.Voting.registerCandidate(ELON_TUSK);
    await contracts.Voting.connect(signer).registerCandidate(JEFF_BEEZOS);
  }

  if (allowVoting) {
    await increaseBlockTime(60 * 60 * 25);
  }

  return {
    deployer: await setupUser(deployer, contracts),
    participants: await setupUsers(participants, contracts),
    ...contracts,
  };
};

const addDaysToDate = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return Math.round(date.getTime() / 1000);
};

const increaseBlockTime = async (time: number) => {
  await hre.network.provider.send("evm_increaseTime", [time]);
};

describe("Voting Contract Tests", () => {
  describe("Initialization", () => {
    it("Should properly initialize with empty storage.", async () => {
      const { Voting } = await setup();

      expect(await Voting.registrationEndPeriod()).to.equal(0);
      expect(await Voting.votingEndPeriod()).to.equal(0);
      expect(await Voting.locked()).to.equal(false);
    });
  });

  describe("Start Election", () => {
    it("Should allow starting an election.", async () => {
      const { Voting } = await setup();
      const registrationEndPeriod = addDaysToDate(new Date(), 1);
      const votingEndPeriod = addDaysToDate(new Date(), 2);
      const startElectionTxn = Voting.startElection(
        registrationEndPeriod,
        votingEndPeriod
      );

      await expect(startElectionTxn)
        .to.emit(Voting, "StartElection")
        .withArgs(0, registrationEndPeriod, votingEndPeriod);
      expect(await Voting.registrationEndPeriod()).to.equal(
        registrationEndPeriod
      );
      expect(await Voting.votingEndPeriod()).to.equal(votingEndPeriod);
    });

    it("Should not allow starting an election with registration end time before now.", async () => {
      const { Voting } = await setup();
      const registrationEndPeriod = addDaysToDate(new Date(), -1);
      const votingEndPeriod = addDaysToDate(new Date(), 1);
      const startElectionTxn = Voting.startElection(
        registrationEndPeriod,
        votingEndPeriod
      );

      await expect(startElectionTxn).to.be.revertedWith(
        "Registration end period must be > voting end period > registration end period."
      );
    });

    it("Should not allow starting an election with a voting end time before registration end time.", async () => {
      const { Voting } = await setup();
      const registrationEndPeriod = addDaysToDate(new Date(), 2);
      const votingEndPeriod = addDaysToDate(new Date(), 1);
      const startElectionTxn = Voting.startElection(
        registrationEndPeriod,
        votingEndPeriod
      );

      await expect(startElectionTxn).to.be.revertedWith(
        "Registration end period must be > voting end period > registration end period."
      );
    });

    it("Should not allow starting an election during an existing election.", async () => {
      const { Voting } = await setup(true);
      const registrationEndPeriod = addDaysToDate(new Date(), 1);
      const votingEndPeriod = addDaysToDate(new Date(), 2);
      const startAnotherElectionTxn = Voting.startElection(
        registrationEndPeriod,
        votingEndPeriod
      );
      await expect(startAnotherElectionTxn).to.be.revertedWith(
        "There is an active election currently, please wait until it is over."
      );
    });
  });

  describe("Register Candidate", () => {
    it("Should not allow me to register a candidate if an election doesn't exist.", async () => {
      const { Voting } = await setup();
      const registerCandidateTxn = Voting.registerCandidate(ELON_TUSK);

      await expect(registerCandidateTxn).to.be.revertedWith(
        "There are no elections currently."
      );
    });

    it("Should not allow me to register a candidate without a name.", async () => {
      const { Voting } = await setup(true);
      const registerCandidateTxn = Voting.registerCandidate(" ".trim());

      await expect(registerCandidateTxn).to.be.revertedWith(
        "Please register with a name."
      );
    });

    it("Should not allow me to register once the registration period has ended.", async () => {
      const { Voting } = await setup(true);
      await increaseBlockTime(60 * 60 * 48);
      const registerCandidateTxn = Voting.registerCandidate(ELON_TUSK);

      await expect(registerCandidateTxn).to.be.revertedWith(
        "The registration period has ended."
      );
    });

    it("Should not allow anyone to to register twice.", async () => {
      const { Voting } = await setup(true);
      await Voting.registerCandidate(ELON_TUSK);
      const registerAgainTxn = Voting.registerCandidate("Elon Busk");

      await expect(registerAgainTxn).to.be.revertedWith(
        "You have already registered for an election."
      );
    });

    it("Should allow someone to register.", async () => {
      const { Voting } = await setup(true);
      const registerCandidateTxn = Voting.registerCandidate(ELON_TUSK);

      await expect(registerCandidateTxn)
        .to.emit(Voting, "RegisterCandidate")
        .withArgs(0, 0, ELON_TUSK);
    });

    it("Should allow arbitrary number of people to register.", async () => {
      const { deployer, participants, Voting } = await setup(true);
      Voting.registerCandidate(ELON_TUSK);
      await participants[0].Voting.registerCandidate(JEFF_BEEZOS);

      expect(await Voting.registeredCandidates(deployer.address, 0)).to.equal(
        true
      );
      expect(
        await Voting.registeredCandidates(participants[0].address, 0)
      ).to.equal(true);
      expect(
        await Voting.registeredCandidates(participants[1].address, 0)
      ).to.equal(false);
    });
  });

  describe("Voting Tests", () => {
    it("Should allow non-candidate to vote for a candidate.", async () => {
      const { participants, Voting } = await setup(true, true, true);

      const voteTxn = participants[1].Voting.voteForCandidate(0);
      await expect(voteTxn)
        .to.emit(Voting, "VoteForCandidate")
        .withArgs(0, 0, 1);
    });

    it("Should allow candidate to vote for themselves.", async () => {
      const { Voting } = await setup(true, true, true);
      const voteTxn = Voting.voteForCandidate(0);

      await expect(voteTxn)
        .to.emit(Voting, "VoteForCandidate")
        .withArgs(0, 0, 1);
    });

    it("Should allow multiple votes from multiple participants.", async () => {
      const { participants, Voting } = await setup(true, true, true);
      await Voting.voteForCandidate(0);
      const candidateOneVoteTxn = participants[0].Voting.voteForCandidate(1);
      const candidateZeroVoteTxn = participants[1].Voting.voteForCandidate(0);

      await expect(candidateOneVoteTxn)
        .to.emit(Voting, "VoteForCandidate")
        .withArgs(0, 1, 1);
      await expect(candidateZeroVoteTxn)
        .to.emit(Voting, "VoteForCandidate")
        .withArgs(0, 0, 2);
    });

    it("Should not allow multiple votes from single voter.", async () => {
      const { Voting } = await setup(true, true, true);
      await Voting.voteForCandidate(0);
      const repeatVoteSameCandidateTxn = Voting.voteForCandidate(0);
      const repeatVoteDiffCandidateTxn = Voting.voteForCandidate(1);

      await expect(repeatVoteSameCandidateTxn).to.be.revertedWith(
        "You have already voted for a candidate."
      );
      await expect(repeatVoteDiffCandidateTxn).to.be.revertedWith(
        "You have already voted for a candidate."
      );
    });

    it("Should not allow voting for a non-existent candidate.", async () => {
      const { Voting } = await setup(true, true, true);
      const nonExistentCandidateVoteTxn = Voting.voteForCandidate(2);

      await expect(nonExistentCandidateVoteTxn).to.be.revertedWith(
        "This candidate doesn't exist."
      );
    });

    it("Should not allow voting prior to voting time.", async () => {
      const { Voting } = await setup(true, true, false);
      const nonExistentCandidateVoteTxn = Voting.voteForCandidate(0);

      await expect(nonExistentCandidateVoteTxn).to.be.revertedWith(
        "Voting is not allowed now."
      );
    });
  });

  describe("Election Results & New Elections", () => {
    it("Should allow starting a new election once an election has completed.", async () => {
      const { Voting } = await setup(true, true, true);
      await increaseBlockTime(60 * 60 * 96);
      const registrationEndPeriod = addDaysToDate(new Date(), 10);
      const votingEndPeriod = addDaysToDate(new Date(), 20);
      const startNewElectionTxn = Voting.startElection(
        registrationEndPeriod,
        votingEndPeriod
      );

      await expect(startNewElectionTxn)
        .to.emit(Voting, "StartElection")
        .withArgs(1, registrationEndPeriod, votingEndPeriod);
    });

    it("Should return the correct live election results.", async () => {
      const { deployer, participants, Voting } = await setup(true, true, true);
      await Voting.voteForCandidate(0);
      await participants[0].Voting.voteForCandidate(1);
      await participants[1].Voting.voteForCandidate(1);
      const liveResults = await Voting.getLiveResults();

      expect(liveResults[0][0]).to.equal(deployer.address);
      expect(liveResults[1][0]).to.equal(1);
      expect(liveResults[0][1]).to.equal(participants[0].address);
      expect(liveResults[1][1]).to.equal(2);
    });

    it("Should return the correct final election results.", async () => {
      const { participants, Voting } = await setup(true, true, true);
      await Voting.voteForCandidate(0);
      await participants[0].Voting.voteForCandidate(1);
      await participants[1].Voting.voteForCandidate(1);
      const results = await Voting.getWinnerResults();

      expect(results[0].toNumber()).to.equal(1);
      expect(results[1]).to.equal(false);
    });
  });
});

import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import DateTime from "react-datetime";
import moment from "moment";
import VotingABI from "./artifacts/contracts/Voting.sol/Voting.json";
import { Voting as VotingInterface } from "../../typechain/Voting";

interface Props {}

const Voting: React.FC<Props> = () => {
  const [registrationEnd, setRegistrationEnd] = useState<
    string | moment.Moment
  >("");
  const [votingEnd, setVotingEnd] = useState<string | moment.Moment>("");
  const [numElections, setNumElections] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const isGlobalEthereumObjectEmpty = typeof (window as any).ethereum == null;

  async function requestAccount() {
    const ethereum = (window as any).ethereum;
    if (isGlobalEthereumObjectEmpty) return;

    await ethereum.request({ method: "eth_requestAccounts" });
  }

  function initializeContract(requiresSigner: boolean) {
    const ethereum = (window as any).ethereum;
    if (isGlobalEthereumObjectEmpty) return;
    const provider = new ethers.providers.Web3Provider(ethereum);
    if (requiresSigner) {
      const signer = provider.getSigner();
      const votingContract = new ethers.Contract(
        contractAddress,
        VotingABI.abi,
        signer
      ) as VotingInterface;
      return votingContract;
    }
    const votingContract = new ethers.Contract(
      contractAddress,
      VotingABI.abi,
      provider
    ) as VotingInterface;
    return votingContract;
  }

  async function fetchAndSetElections() {
    const votingContract = initializeContract(false);
    if (isGlobalEthereumObjectEmpty || votingContract == null) return;
    try {
      const data = await votingContract.getElectionsCount();
      setNumElections(data.toNumber());
    } catch (err) {
      console.error(err);
    }
  }

  async function startElection() {
    if (isGlobalEthereumObjectEmpty) return;
    const currentTime = new Date().getTime();
    const registrationTime = (registrationEnd as moment.Moment)
      .toDate()
      .getTime();
    const votingTime = (votingEnd as moment.Moment).toDate().getTime();
    const votingContract = initializeContract(true);
    if (
      currentTime > registrationTime ||
      currentTime > votingTime ||
      registrationTime > votingTime ||
      votingContract == null
    ) {
      return;
    }
    try {
      await requestAccount();
      const txn = await votingContract.startElection(registrationTime, votingTime);
      await txn.wait();
      await fetchAndSetElections();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchAndSetElections();
    })();
  }, []);

  return (
    <div>
      <h1>Elections</h1>
      <p># Elections: {numElections}</p>
      <label>Registration End Date/Time</label>
      <DateTime
        value={registrationEnd}
        onChange={(e: string | moment.Moment) => setRegistrationEnd(e)}
      />
      <label>Voting End Date/Time</label>
      <DateTime
        value={votingEnd}
        onChange={(e: string | moment.Moment) => setVotingEnd(e)}
      />
      <button onClick={() => startElection()}>Start Election</button>
    </div>
  );
};

export default Voting;

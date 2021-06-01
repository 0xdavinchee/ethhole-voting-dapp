import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Container, Typography } from "@material-ui/core";
import { ethers } from "ethers";
import DateTime from "react-datetime";
import moment from "moment";
import VotingABI from "../../artifacts/contracts/Voting.sol/Voting.json";
import { Voting as VotingInterface } from "../../../../typechain/Voting";
import { GET_ELECTIONS } from "../../graphql/queries";

interface Props {}

const Voting: React.FC<Props> = () => {
  const [registrationEnd, setRegistrationEnd] = useState<
    string | moment.Moment
  >("");
  const [votingEnd, setVotingEnd] = useState<string | moment.Moment>("");

  const contractAddress = "0x340632f0199C4f9C073f493bddd2873Db0B5806C";

  const { loading, error, data } = useQuery(GET_ELECTIONS);

  useEffect(() => {
    if (loading || data == null) return;


    console.log(data.elections);
  }, [loading, data]);

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
      ) as unknown as VotingInterface;
      return votingContract;
    }
    const votingContract = new ethers.Contract(
      contractAddress,
      VotingABI.abi,
      provider
    ) as unknown as VotingInterface;
    return votingContract;
  }

  // async function startElection() {
  //   if (isGlobalEthereumObjectEmpty) return;
  //   const currentTime = new Date().getTime();
  //   const registrationTime = (registrationEnd as moment.Moment)
  //     .toDate()
  //     .getTime();
  //   const votingTime = (votingEnd as moment.Moment).toDate().getTime();
  //   const votingContract = initializeContract(true);
  //   if (
  //     currentTime > registrationTime ||
  //     currentTime > votingTime ||
  //     registrationTime > votingTime ||
  //     votingContract == null
  //   ) {
  //     return;
  //   }
  //   try {
  //     await requestAccount();
  //     // this creates the actual transacation sent to the blockchain
  //     const txn = await votingContract.startElection(registrationTime, votingTime);

  //     // this is called to wait for the txn to finish
  //     await txn.wait();
  //     await fetchAndSetElections();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  return (
    <Container maxWidth="md">
      <Typography variant="h1">Elections</Typography>
      <h2>Start an election!</h2>
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
      <Button variant="contained" color="primary" onClick={() => {console.log("start election")}}>Start Election</Button>
    </Container>
  );
};

export default Voting;

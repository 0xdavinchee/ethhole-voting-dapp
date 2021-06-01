import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { ethers } from "ethers";
import moment from "moment";
import VotingABI from "../../artifacts/contracts/Voting.sol/Voting.json";
import { Voting as VotingInterface } from "../../../../typechain";
import { GET_ELECTIONS } from "../../graphql/queries";
import "./Voting.css";
import { IElection } from "../../../interface";

interface Props {}

const Election = ({ election }: { election: IElection }) => {
  const formattedRegistrationEndDate = new Date(
    Number(election.registrationEndPeriod)
  );
  const formattedVotingEndDate = new Date(Number(election.votingEndPeriod));
  return (
    <Paper elevation={3} className="b-election-container" key={election.id}>
      <CardContent>
        <Typography variant="h5">Current Election</Typography>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Election Details</Typography>
            <div>Election ID: {election.electionId}</div>
            <div>
              Registration End Time:{" "}
              {formattedRegistrationEndDate.toDateString()}{" "}
              {formattedRegistrationEndDate.toLocaleTimeString()}
            </div>
            <div>
              Voting End Time: {formattedVotingEndDate.toDateString()}{" "}
              {formattedVotingEndDate.toLocaleTimeString()}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Register as Candidate</Typography>
            <div>Election ID: {election.electionId}</div>
            <div>
              Registration End Time:{" "}
              {formattedRegistrationEndDate.toDateString()}{" "}
              {formattedRegistrationEndDate.toLocaleTimeString()}
            </div>
            <div>
              Voting End Time: {formattedVotingEndDate.toDateString()}{" "}
              {formattedVotingEndDate.toLocaleTimeString()}
            </div>
          </Grid>
        </Grid>

        <div className="e-candidates-container">
          <Typography variant="h6">Candidates</Typography>
          {election.candidates.length > 0 &&
            "There are no candidates in this election currently."}
        </div>
      </CardContent>
    </Paper>
  );
};

const Voting: React.FC<Props> = () => {
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [votingEnd, setVotingEnd] = useState("");
  const [elections, setElections] = useState<IElection[]>([]);

  const contractAddress = "0x340632f0199C4f9C073f493bddd2873Db0B5806C";

  const { loading, error, data } = useQuery(GET_ELECTIONS);

  useEffect(() => {
    if (loading || data == null) return;
    setElections(data.elections);
  }, [loading, data]);

  const currentElection = useMemo(
    () => (elections.length > 0 ? elections[elections.length - 1] : null),
    [elections]
  );

  const hasActiveElection =
    currentElection != null &&
    new Date().getTime() < Number(currentElection.votingEndPeriod) * 1000;

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

  async function startElection() {
    if (isGlobalEthereumObjectEmpty) return;
    const currentTime = new Date().getTime();
    const registrationTime = new Date(registrationEnd).getTime();
    const votingTime = new Date(votingEnd).getTime();
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
      // this creates the actual transacation sent to the blockchain
      const txn = await votingContract.startElection(
        registrationTime,
        votingTime
      );

      // this is called to wait for the txn to finish
      await txn.wait();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container className="b-voting-container" maxWidth="md">
      {loading && <CircularProgress className="e-loader" />}
      {!loading && (
        <>
          <Typography variant="h4" className="e-title">
            Voting dApp
          </Typography>
          {currentElection != null && <Election election={currentElection} />}

          <Typography variant="h6">Start an election</Typography>
          <Grid container spacing={10} className="e-start-election">
            <Grid item>
              <TextField
                id="registration-datetime"
                label="Registration End Date/Time"
                type="datetime-local"
                defaultValue=""
                value={registrationEnd}
                onChange={(e) => setRegistrationEnd(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                id="voting-datetime"
                label="Voting End Date/Time"
                type="datetime-local"
                defaultValue=""
                value={votingEnd}
                onChange={(e) => setVotingEnd(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => startElection()}
              >
                Start Election
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Voting;

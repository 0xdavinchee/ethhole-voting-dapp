import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { GET_ELECTIONS } from "../../graphql/queries";
import "./Voting.css";
import { IElection, IPastElection } from "../../../interface";
import Election from "../Election/Election";
import {
  initializeContract,
  isGlobalEthereumObjectEmpty,
  requestAccount,
} from "../../utils/helpers";

interface Props {}

const Voting: React.FC<Props> = () => {
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [votingEnd, setVotingEnd] = useState("");
  const [elections, setElections] = useState<IElection[]>([]);
  const [pastElections, setPastElections] = useState<IPastElection[]>([]);

  const { loading, error, data, refetch } = useQuery(GET_ELECTIONS);
  const currentElection = useMemo(
    () => (elections.length > 0 ? elections[elections.length - 1] : null),
    [elections]
  );

  const hasActiveElection =
    currentElection != null &&
    new Date().getTime() < Number(currentElection.votingEndPeriod) * 1000;

  async function startElection() {
    if (
      isGlobalEthereumObjectEmpty ||
      registrationEnd === "" ||
      votingEnd === ""
    )
      return;
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

  useEffect(() => {
    if (loading || data == null) return;
    setElections(data.elections);
  }, [loading, data]);

  useEffect(() => {
    const votingContract = initializeContract(false);
    if (votingContract == null) {
      return;
    }
    votingContract.on("StartElection", (e) => console.log(e));

    return () => {
      votingContract.removeListener("StartElection", (_e) => {});
    };
  }, []);

  return (
    <Container className="b-voting-container" maxWidth="md">
      {loading && <CircularProgress className="e-loader" />}
      {!loading && (
        <>
          <Typography variant="h4" className="e-title">
            Voting dApp
          </Typography>
          {currentElection != null && (
            <Election
              election={currentElection}
              hasActiveElection={hasActiveElection}
            />
          )}

          <Typography variant="h6">Start an election</Typography>
          <Grid container spacing={10} className="e-start-election">
            <Grid item>
              <TextField
                id="registration-datetime"
                label="Registration End Date/Time"
                type="datetime-local"
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

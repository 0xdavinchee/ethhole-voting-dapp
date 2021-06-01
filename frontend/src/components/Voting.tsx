import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import makeBlockie from "ethereum-blockies-base64";

import { GET_ELECTIONS, GET_PAST_ELECTIONS } from "../graphql/queries";
import { IElection, IPastElection } from "../../interface";
import Election from "./Election";
import {
  initializeContract,
  isGlobalEthereumObjectEmpty,
  requestAccount,
} from "../utils/helpers";

interface Props {}

const Voting: React.FC<Props> = () => {
  const [registrationEnd, setRegistrationEnd] = useState("");
  const [votingEnd, setVotingEnd] = useState("");
  const [elections, setElections] = useState<IElection[]>([]);
  const [pastElections, setPastElections] = useState<IPastElection[]>([]);

  const {
    loading: loadingElections,
    error: electionsError,
    data: electionsData,
    refetch: refetchElections,
  } = useQuery(GET_ELECTIONS);

  const {
    loading: loadingPastElections,
    error: pastElectionsError,
    data: pastElectionsData,
    refetch: refetchPastElections,
  } = useQuery(GET_PAST_ELECTIONS);

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
    ) {
      return;
    }
    const currentTimeSecs = new Date().getTime() / 1000;
    const registrationTimeSecs = new Date(registrationEnd).getTime() / 1000;
    const votingTimeSecs = new Date(votingEnd).getTime() / 1000;
    const votingContract = initializeContract(true);
    if (
      currentTimeSecs > registrationTimeSecs ||
      currentTimeSecs > votingTimeSecs ||
      registrationTimeSecs > votingTimeSecs ||
      votingContract == null
    ) {
      return;
    }
    try {
      await requestAccount();
      // this creates the actual transacation sent to the blockchain
      const txn = await votingContract.startElection(
        registrationTimeSecs,
        votingTimeSecs
      );

      // this is called to wait for the txn to finish
      await txn.wait();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (loadingElections || electionsData == null) return;
    setElections(electionsData.elections);
  }, [loadingElections, electionsData]);

  useEffect(() => {
    if (loadingElections || pastElectionsData == null) return;
    setPastElections(pastElectionsData.pastElections);
  }, [loadingElections, pastElectionsData]);

  useEffect(() => {
    const votingContract = initializeContract(false);
    if (votingContract == null) {
      return;
    }
    votingContract.on("StartElection", (_e) => refetchElections());
    votingContract.on("VoteForCandidate", (e) => refetchElections());
    votingContract.on("RegisterCandidate", (e) => refetchElections());
    votingContract.on("ArchivePastElection", (e) => refetchPastElections());

    return () => {
      votingContract.removeListener("StartElection", (_e) => {});
      votingContract.removeListener("VoteForCandidate", (_e) => {});
      votingContract.removeListener("RegisterCandidate", (_e) => {});
      votingContract.removeListener("ArchivePastElection", (_e) => {});
    };
  }, []);

  return (
    <Container className="b-voting-container" maxWidth="md">
      {loadingElections && <CircularProgress className="e-loader" />}
      {!loadingElections && (
        <>
          <Typography variant="h4" className="e-title">
            Voting dApp
          </Typography>
          <Paper elevation={3}>
            <CardContent>
              <Typography variant="body2">
                A dapp for voting where all of the votes and candidate
                registration happens on chain. Anyone can start an election with
                a registration period, voting period, and ending time. Anyone
                can sign up as a candidate during the registration period, and
                vote once during the voting period. You can the results and know
                how long is left in the election.
              </Typography>
            </CardContent>
          </Paper>
          {currentElection != null && (
            <Election
              election={currentElection}
              hasActiveElection={hasActiveElection}
            />
          )}

          {!hasActiveElection && (
            <div className="e-start-election-container">
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
            </div>
          )}

          {pastElections.length > 0 && (
            <div className="e-past-elections">
              <Typography variant="h6">Past Election Results</Typography>
              {pastElections.map((x) => (
                <Accordion key={x.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body2">
                      Election: {x.electionId} | Winner: {x.winnerName}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <img
                      className="e-candidate-blockie"
                      alt={x.winnerAddress}
                      src={makeBlockie(x.winnerAddress)}
                    />
                    {x.voteCount}
                    {x.winnerAddress}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Voting;

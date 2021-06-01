import {
  Button,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { IElection } from "../../interface";
import { useEffect, useState } from "react";
import { initializeContract, requestAccount } from "../utils/helpers";
import Candidate from "./Candidate";

// - an active Election (registration period, voting perio)
// - an inactive complete Election

const getMs = (seconds: number) => seconds * 1000;

interface IElectionProps {
  hasActiveElection: boolean;
  election: IElection;
}

const Election = (props: IElectionProps) => {
  const [registerError, setRegisterError] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState(new Date());
  const formattedRegistrationEndDate = new Date(
    Number(props.election.registrationEndPeriod) * 1000
  );
  const formattedVotingEndDate = new Date(
    Number(props.election.votingEndPeriod) * 1000
  );
  const isRegistrationOver =
    time.getTime() > getMs(Number(props.election.registrationEndPeriod));
  const isVotingAllowed =
    time.getTime() < getMs(Number(props.election.votingEndPeriod)) &&
    isRegistrationOver;

  const totalVotes =
    props.election.candidates.length === 0
      ? 0
      : props.election.candidates
          .map((x) => Number(x.voteCount))
          .reduce((a, b) => a + b, 0);

  const registerCandidate = async () => {
    if (name.trim() === "") {
      setRegisterError(true);
      return;
    }
    const votingContract = initializeContract(true);
    if (votingContract == null) {
      return;
    }
    try {
      await requestAccount();
      const txn = await votingContract.registerCandidate(name);

      await txn.wait();
    } catch (err) {
      console.error(err);
    }
  };
  const setNameHelper = (name: string) => {
    if (registerError) {
      setRegisterError(false);
    }
    setName(name);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <Paper elevation={3} className="b-election-container">
      <CardContent>
        <Typography variant="h5">Current Election</Typography>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Election Details</Typography>
            <div>Election ID: {props.election.electionId}</div>
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
          {!isRegistrationOver && (
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Register as Candidate</Typography>
              <Typography variant="body2">
                Please enter your name and click the register button to register
                yourself as a candidate for the election.
              </Typography>
              <form className="e-register-form" noValidate>
                <TextField
                  error={registerError}
                  id="candidate-name"
                  label="Candidate Name"
                  variant="standard"
                  value={name}
                  required
                  onChange={(e) => setNameHelper(e.target.value)}
                />
                <Button
                  className="e-register-button"
                  variant="contained"
                  color="primary"
                  onClick={() => registerCandidate()}
                >
                  Register
                </Button>
              </form>
            </Grid>
          )}
          {isRegistrationOver && (
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                The registration period is over.
              </Typography>
            </Grid>
          )}
        </Grid>

        <div className="e-candidates-container">
          <Typography variant="h6">Candidates</Typography>
          {props.election.candidates.length === 0 &&
            "There are no candidates in this election currently."}
          {props.election.candidates.length > 0 &&
            props.election.candidates.map((x) => (
              <Candidate
                candidate={x}
                isVotingAllowed={isVotingAllowed}
                totalVotes={totalVotes}
              />
            ))}
        </div>
        {!props.hasActiveElection && (
          <Typography variant="body1">The election is over.</Typography>
        )}
      </CardContent>
    </Paper>
  );
};

export default Election;

import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import makeBlockie from "ethereum-blockies-base64";
import "./Election.css";
import { IElection } from "../../../interface";
import { useState } from "react";

interface IElectionProps {
  hasActiveElection: boolean;
  election: IElection;
}

const getMs = (seconds: number) => seconds * 1000;

const Election = (props: IElectionProps) => {
  const [registerError, setRegisterError] = useState(false);
  const [name, setName] = useState("");
  const formattedRegistrationEndDate = new Date(
    Number(props.election.registrationEndPeriod)
  );
  const formattedVotingEndDate = new Date(
    Number(props.election.votingEndPeriod)
  );

  const isRegistrationOver =
    new Date().getTime() > getMs(Number(props.election.registrationEndPeriod));
  const isVotingOver =
    new Date().getTime() > getMs(Number(props.election.votingEndPeriod));

  const registerCandidate = () => {
    if (name.trim() === "") {
      setRegisterError(true);
      return;
    }
  };
  const setNameHelper = (name: string) => {
    if (registerError) {
      setRegisterError(false);
    }
    setName(name);
  };
  const vote = (id: string) => {
    console.log(id);
  };

  return (
    <Paper
      elevation={3}
      className="b-election-container"
      key={props.election.id}
    >
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
              <Card key={x.id} className="e-candidate-container">
                <CardContent className="e-candidate">
                  <img
                    className="e-candidate-blockie"
                    src={makeBlockie(x.address)}
                    alt={x.address}
                  />
                  <div>
                    <Typography variant="body2">
                      Candidate Name: {x.name}
                    </Typography>
                    <Typography variant="body2">
                      Votes: {x.voteCount}
                    </Typography>
                    <Typography variant="body2">
                      Address: {x.address}
                    </Typography>
                  </div>
                  <Button
                    className="e-register-button"
                    color="primary"
                    variant="contained"
                    onClick={() => vote(x.candidateId)}
                  >
                    Vote
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Paper>
  );
};

export default Election;

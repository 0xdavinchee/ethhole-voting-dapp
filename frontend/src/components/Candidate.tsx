import { Button, Card, CardContent, Typography } from "@material-ui/core";
import makeBlockie from "ethereum-blockies-base64";
import { ICandidate } from "../../interface";
import {
  initializeContract,
  isGlobalEthereumObjectEmpty,
  requestAccount,
} from "../utils/helpers";

interface ICandidateProps {
  candidate: ICandidate;
  isVotingAllowed: boolean;
  totalVotes: number;
}
const Candidate = (props: ICandidateProps) => {
  const { candidate } = props;

  const vote = async (id: string) => {
    if (isGlobalEthereumObjectEmpty) {
      return;
    }
    const votingContract = initializeContract(true);
    if (votingContract == null) {
      return;
    }
    try {
      await requestAccount();
      const txn = await votingContract.voteForCandidate(Number(id));
      await txn.wait();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card key={candidate.id} className="e-candidate-container">
      <CardContent className="e-candidate">
        <div className="e-candidate-info">
          <img
            className="e-candidate-blockie"
            src={makeBlockie(candidate.address)}
            alt={candidate.address}
          />
          <div>
            <Typography variant="body2">
              Candidate Name: {candidate.name}
            </Typography>
            <Typography variant="body2">
              Address: {candidate.address}
            </Typography>
            <Typography variant="body2">
              Votes: {candidate.voteCount}
            </Typography>
            <Typography variant="body2">
              {candidate.voteCount} / {props.totalVotes} (
              {(Number(candidate.voteCount) / props.totalVotes) * 100}%)
            </Typography>
          </div>
        </div>
        <Button
          className="e-register-button"
          disabled={!props.isVotingAllowed}
          color="primary"
          variant="contained"
          onClick={() => vote(candidate.candidateId)}
        >
          Vote
        </Button>
      </CardContent>
    </Card>
  );
};

export default Candidate;

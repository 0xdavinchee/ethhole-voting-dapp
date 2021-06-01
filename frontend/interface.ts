export interface IElection {
  __typename: "Election";
  id: string;
  candidates: ICandidate[];
  electionId: string;
  registrationEndPeriod: string;
  votingEndPeriod: string;
}

export interface ICandidate {
  __typename: "Candidate";
  id: string;
  candidateId: string;
  address: string;
  voteCount: string;
  name: string;
}

export interface IPastElection {
  __typename: "PastElection";
  id: string;
  electionId: string;
  winnerName: string;
  voteCount: string;
  winnerAddress: string;
}

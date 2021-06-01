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
  voteCount: string;
  name: string;
}

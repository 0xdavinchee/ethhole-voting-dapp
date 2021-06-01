import { gql } from "@apollo/client";

export const GET_ELECTIONS = gql`
  query GetActiveElections {
    elections {
      id
      electionId
      registrationEndPeriod
      votingEndPeriod
      candidates {
        id
        candidateId
        address
        voteCount
        name
      }
    }
  }
`;

export const GET_PAST_ELECTIONS = gql`
  query GetPastElections {
    pastElections {
      id
      electionId
      winnerName
      voteCount
      winnerAddress
    }
  }
`;

import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

export const GET_ELECTIONS = gql`
  query GetActiveElections {
    elections {
      id
      electionId
      registrationEndPeriod
      votingEndPeriod
      candidates {
        id
        voteCount
        name
      }
    }
  }
`;

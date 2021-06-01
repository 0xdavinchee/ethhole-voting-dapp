import Voting from "../Voting/Voting";
import "react-datetime/css/react-datetime.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import '@fontsource/roboto';

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/0xdavinchee/ethhole-voting-dapp",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Voting />
    </ApolloProvider>
  );
}

export default App;

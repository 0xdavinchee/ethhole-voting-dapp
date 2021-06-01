import Voting from "../Voting/Voting";
import "react-datetime/css/react-datetime.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@fontsource/roboto";
import { ThemeProvider } from "@material-ui/styles";
import { useMemo } from "react";
import { createMuiTheme, useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/0xdavinchee/ethhole-voting-dapp",
  cache: new InMemoryCache(),
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: "dark",
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Voting />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

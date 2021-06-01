import Voting from "./Voting";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@fontsource/roboto";
import { ThemeProvider } from "@material-ui/styles";
import { useMemo } from "react";
import { createMuiTheme, useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { blue } from "@material-ui/core/colors";

const client = new ApolloClient({
  uri: "http://localhost:8000/subgraphs/name/0xdavinchee/ethhole-voting-dapp",
  cache: new InMemoryCache(),
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: {
            main: blue[200],
          },
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

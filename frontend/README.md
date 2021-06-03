# ethhole-voting-dapp-frontend

From: https://ethhole.com/challenge

Required environment variables in a .env file:

- `REACT_APP_GRAPHQL_URI`: the URI obtained from either a local graph deployment or on thegraph
- `REACT_APP_CONTRACT_ADDRESS`: the address of your deployed voting contract

Lessons Learned:

- How to request accounts and get the signer via metamask. In `helpers.ts`.
- How to interact with smart contracts on the client: ensuring we have acess to the ABI so we can instantiate the contract w/ the contractAddress. In `helpers.ts`.
- How to use material-ui and a bunch of cool things you can do with it: create themes to have dark mode, pass a CSS baseline component to give it a baseline of styles.
- How to use Apollo to connect to a graphql uri (subgraph) and make queries to get data from the blockchain onto the app.
- How to use event listeners on contracts to listen to emitted events on the client side and the fact that they return data we chose to emit from the contract.
- Using blockies to get a nice visual representation of an address.

Further Questions/Improvements:

- What is the best way of handling the lag of the event firing and triggering a refetch of the data and the subgraph indexing the data? That is, when we make a change, the event listener is triggered which causes us to refetch, but sometimes the updated data hasn't been indexed by the graph yet, so how can we ensure that this is properly handled?

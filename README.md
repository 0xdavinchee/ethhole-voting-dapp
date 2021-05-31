# ethhole-voting-dapp
From: https://ethhole.com/challenge

Create a dapp for voting where all of the votes and candidate registration happens on chain. 

Allow anyone to start an election with a registration period, voting period, and ending time. 

Allow anyone to sign up as a candidate during the registration period, and allow anyone to 
vote once during the voting period. Create a front end where voters can see the results and 
know how long is left in the election.

Assumptions:

- One election can be running and started by anyone.
- Anyone can sign up as a candidate.
- Voters can only vote once.
- Registration Starts immediately after an election is created.
- Voting starts immediately following the registration period.
- A new election can be started once this one has ended.

Lessons Learned:

- Utilize `keccak256(abi.encodePacked(string))` for string comparison.
- Your MetaMask must be connected to the correct network (localhost) during development otherwise you will keep getting an error when you try to call functions.
- You need to set hardhat network chainId to 1337 when using MetaMask with Hardhat Network: https://hardhat.org/metamask-issue.html.
- To deploy to the local hardhat network, you must first run `npx hardhat node` to start a local node, then run your deploy script with the `--network localhost` option.
- When working with time between the client (JS) and Solidity, it is important to remember that using `new Date().getTime()` returns the value in milliseconds whereas `block.timestamp` refers to time in **seconds** since unix epoch (January 1, 1970 UTC, an arbitrary date).
- When you use `hre.network.provider.send("evm_increaseTime", [<TIME_IN_SECONDS>])` and attempt to use a view function in solidity afterwards, it won't recognize this increase and will not work.
- How to send funds using `ethers.js`, look at `hardhat.config.ts`!

Further Questions:

- What is the best way for getting data from a contract, specifically an array of structs on the client side?

Using something like The Graph and indexing events and then utilizing GraphQL and something like Apollo for React to query the API created by the graph is the best way to do this.

- How do you create tests for functions based on time?

Using `hre.network.provider.send("evm_increaseTime", [<TIME_IN_SECONDS>])`

- Is there a better way to structure the data?

It depends on if you're doing this contracts just handles a single election or if the contract handles multiple elections. For the purposes of this project, the smart contract only handles one single election and allows starting a new one once the existing one has ended.
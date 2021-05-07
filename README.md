# ethhole-voting-dapp
Create a dapp for voting where all of the votes and candidate registration happens on chain. 

Allow anyone to start an election with a registration period, voting period, and ending time. 

Allow anyone to sign up as a candidate during the registration period, and allow anyone to 
vote once during the voting period. Create a front end where voters can see the results and 
know how long is left in the election.

Assumptions:
- Multiple elections can be started by anyone.
- Anyone can sign up as a candidate (and only be part of one election).
- Voters can only vote in one election.
- Registration Starts immediately after an election is created.
- Voting starts immediately following the registration period.

Lessons Learned:
- Utilize `keccak256(abi.encodePacked(string))` for string comparison.
- Your MetaMask must be connected to the correct network (localhost) during development otherwise you will keep getting an error when you try to call functions.
- You need to set hardhat network chainId to 1337 when using MetaMask with Hardhat Network: https://hardhat.org/metamask-issue.html.
- To deploy to the local hardhat network, you must first run `npx hardhat node` to start a local node, then run your deploy script with the `--network localhost` option.

Further Questions:
- What is the best way for getting data from a contract, specifically an array of structs on the client side?
- How do you create tests for functions based on time?
- Is there a better way to structure the data?
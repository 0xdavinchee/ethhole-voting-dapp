<br />
<p align="center">
  <h3 align="center">Ethhole Voting dApp</h3>

  <p align="center">
    Create a dapp for voting where all of the votes and candidate registration happens on chain.
    Allow anyone to start an election with a registration period, voting period, and ending time.
    Allow anyone to sign up as a candidate during the registration period, and allow anyone to
    vote once during the voting period. Create a front end where voters can see the results and
    know how long is left in the election.
  </p>
  <p>Assumptions:</p>
  <ul>
    <li>One election can be running and started by anyone.</li>
    <li>Anyone can sign up as a candidate.</li>
    <li>Voters can only vote once.</li>
    <li>Registration Starts immediately after an election is created.</li>
    <li>Voting starts immediately following the registration period.</li>
    <li>A new election can be started once this one has ended.</li>
  </ul>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Built With

- [Solidity](https://soliditylang.org/)
- [Hardhat](https://hardhat.org/)
- [TypeScript](https://typescriptlang.org/)
- [The Graph](https://thegraph.com/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/0xdavinchee/ethhole-voting-dapp.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env` file and add the two following values:

- `INFURA_API_KEY`: You can get this from https://infura.io by signing up for a free account.
- `RINKEBY_PRIVATE_KEY` (if you want to deploy to testnet).

<!-- USAGE EXAMPLES -->

## Usage

To compile: `npx hardhat compile`.

To run tests: `npx hardhat test`.

Run `npx hardhat node` to start up a local node.

Open up another terminal window and run `npx hardhat deploy --network localhost` to deploy your project to localhost. You can similarly deploy to other networks like so: `npx hardhat deploy --network <NETWORK>`

To set up the graph you need to initialize a graph project, you can follow follow the instructions here: https://medium.com/blockrocket/dapp-development-with-a-local-subgraph-ganache-setup-566a4d4cbb. I currently first verify my contract on rinkeby and then use `graph init` to initialize the project using the deployed project so that the graph initializes the project with the correct ABI and some boilerplate code.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

[@0xdavinchee](https://twitter.com/@0xdavinchee) - 0xdavinchee@gmail.com

Project Link: [https://github.com/0xdavinchee/ethhole-voting-dapp](https://github.com/0xdavinchee/ethhole-voting-dapp)

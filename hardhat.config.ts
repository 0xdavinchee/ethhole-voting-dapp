import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import "hardhat-typechain";
import "hardhat-prettier";
import { NetworkUserConfig } from "hardhat/types";

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "";

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 1337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  polygon: 137,
};

const createUrl = (network: string) =>
  "https://" + network + ".infura.io/v3/" + INFURA_API_KEY;

const createTestnetConfig = (
  network: keyof typeof chainIds
): NetworkUserConfig => {
  return {
    accounts: [RINKEBY_PRIVATE_KEY],
    chainId: chainIds[network],
    url: createUrl(network),
  };
};
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
    matic: createTestnetConfig("polygon"),
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;

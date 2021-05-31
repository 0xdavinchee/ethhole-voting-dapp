import { task, HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig(); 
import "hardhat-typechain";
import "hardhat-prettier";

// TODO: include hardhat coverage and contract verification too.

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  paths: {
    artifacts: "./frontend/src/artifacts"
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY]
    }
  },
  namedAccounts: {
    deployer: 0
  }
};

export default config;
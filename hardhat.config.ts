import { task, HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import "hardhat-typechain";
import "hardhat-prettier";

// TODO: include hardhat coverage and contract verification too.

task("sendFunds", "send ether to an account, pass in pKey and amount")
  .addParam("key", "private key of your wallet", "")
  .addParam("amount", "private key of your wallet", "")
  .addParam("to", "address to send funds to", "")
  .setAction(async (args, hre) => {
    const provider = hre.ethers.getDefaultProvider("rinkeby");
    const wallet = new hre.ethers.Wallet(args.key, provider);
    await wallet.sendTransaction({
      to: args.to,
      value: hre.ethers.utils.parseEther(args.amount),
    });
  });

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;

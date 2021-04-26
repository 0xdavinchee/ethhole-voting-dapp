import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

// TODO: this is very elementary and unclean, figure out how to level this up.
const func: any = async function ({deployments, getNamedAccounts}: {deployments: any, getNamedAccounts: any}) {
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('Voting', {
    from: deployer,
    log: true,
  });
};
export default func;
func.tags = ['Voting'];
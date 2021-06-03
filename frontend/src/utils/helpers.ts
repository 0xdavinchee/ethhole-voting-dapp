import { ethers } from "ethers";
import VotingABI from "../artifacts/contracts/Voting.sol/Voting.json";
import { Voting as VotingInterface } from "../../../typechain";

export const isGlobalEthereumObjectEmpty =
  typeof (window as any).ethereum == null;

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";

export async function requestAccount() {
  const ethereum = (window as any).ethereum;
  if (isGlobalEthereumObjectEmpty) return;

  await ethereum.request({ method: "eth_requestAccounts" });
}

export function initializeContract(requiresSigner: boolean) {
  const ethereum = (window as any).ethereum;
  if (isGlobalEthereumObjectEmpty) return;
  const provider = new ethers.providers.Web3Provider(ethereum);
  if (requiresSigner) {
    const signer = provider.getSigner();
    const votingContract = new ethers.Contract(
      contractAddress,
      VotingABI.abi,
      signer
    ) as unknown as VotingInterface;
    return votingContract;
  }
  const votingContract = new ethers.Contract(
    contractAddress,
    VotingABI.abi,
    provider
  ) as unknown as VotingInterface;
  return votingContract;
}

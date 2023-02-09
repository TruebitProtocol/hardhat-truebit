import truebitGoerli from '../client/goerli.json';
import truebitMainNet from '../client/mainnet.json';
import { NetworkContracts } from '../types/networkContracts';
import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';

export async function getCurrentNetworkContracts(hre: HardhatRuntimeEnvironment): Promise<NetworkContracts> {
  const networkType = await hre.web3.eth.net.getNetworkType();
  const hardhatNetworkName = hre.network.name;
  //Default to Goerli
  let contract: NetworkContracts = truebitGoerli;
  //Mainet cases
  if (networkType == 'main' && hardhatNetworkName == 'localhost') {
    contract = truebitMainNet;
  }
  if (networkType == 'main' && hardhatNetworkName == 'mainnet') {
    contract = truebitMainNet;
  }
  //Goerli cases
  if (networkType == 'goerli' && hardhatNetworkName == 'localhost') {
    contract = truebitGoerli;
  }
  if (networkType == 'goerli' && hardhatNetworkName == 'goerli') {
    contract = truebitGoerli;
  }
  return contract;
}

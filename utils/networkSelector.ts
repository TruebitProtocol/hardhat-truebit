import truebitGoerli from '../client/goerli.json';
import truebitMainNet from '../client/mainnet.json';
import { NetworkContracts } from '../types/networkContracts';
import { Network } from 'hardhat/types/runtime';

export async function getCurrentNetworkContracts(currentNetwork: Network): Promise<NetworkContracts> {
  let contract: NetworkContracts;
  switch (currentNetwork.name) {
    case 'mainnet':
      contract = truebitMainNet;
      break;
    case 'localhost':
      contract = truebitGoerli;
      break;
    case 'goerli':
      contract = truebitGoerli;
      break;
    default:
      contract = truebitGoerli;
      break;
  }
  return contract;
}

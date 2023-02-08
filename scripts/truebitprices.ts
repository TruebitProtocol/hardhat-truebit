import hre, { ethers, network } from 'hardhat';
import { getCurrentNetworkContracts } from '../utils/networkSelector';

async function main(): Promise<void> {
  // contracts
  const contracts = await getCurrentNetworkContracts(hre);
  console.log(`Ethereum network type: ${await hre.web3.eth.net.getNetworkType()}`);
  console.log(`Hardhat network name: ${network.name}`);

  // License price
  const incentiveLayerContract = await ethers.getContractAt(contracts.incentiveLayer.abi, contracts.incentiveLayer.address);
  const value = await incentiveLayerContract.LICENSE_FEE();
  console.log('Solver license price %s eth', ethers.utils.formatEther(value));

  // Tru price
  const purchaseContract = await ethers.getContractAt(contracts.purchase.abi, contracts.purchase.address);
  const truPurchasePrice = await purchaseContract.getPurchasePrice(ethers.utils.parseUnits('1000'));
  const truRetirePrice = await purchaseContract.getRetirePrice(ethers.utils.parseUnits('1000'));
  console.log('Purchase 1000 TRU for %s eth', ethers.utils.formatEther(truPurchasePrice));
  console.log('Retiring 1000 TRU for %s eth', ethers.utils.formatEther(truRetirePrice));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

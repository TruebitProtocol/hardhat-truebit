const hre = require("hardhat");
const ether = require("@nomiclabs/hardhat-ethers");
const truebitgoerli = require("../client/goerli.json");
const truebitmain = require("../client/mainnet.json");
const myNetwork = require("../util/networkSelector");


async function main() {

    
    //get accounts
            const accounts = await hre.ethers.getSigners();
           // contracts
           var contract = myNetwork.network();

   console.log("Network :", hre.network.name);

    // License price
    //const contractAddress = truebit.incentiveLayer.address;
    const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
    
    const value = await incentivelayer.LICENSE_FEE();

    console.log("Solver license price %s eth", ethers.utils.formatEther(value));

    // Tru price
    const trucontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
    
    const valuetrubuy = await trucontract.getPurchasePrice(ethers.utils.parseUnits("1000"));
    const valuetrusell = await trucontract.getRetirePrice(ethers.utils.parseUnits("1000"));
    console.log("Purchase 1000 TRU for %s eth", ethers.utils.formatEther(valuetrubuy));
    console.log("Retiring 1000 TRU for %s eth", ethers.utils.formatEther(valuetrusell));

    
   


  }

  main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
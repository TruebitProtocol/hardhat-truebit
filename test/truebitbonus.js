const { expect } = require("chai");
const { ethers } = require("hardhat");
const truebitgoerli = require("../client/goerli.json");
const truebitmain = require("../client/mainnet.json");
const myNetwork = require("../util/networkSelector");

describe("Check network connection", function () {
  it("Should return if Truebit license price", async function () {
    
    //get accounts
    const accounts = await hre.ethers.getSigners();
    // contracts
    var contract = myNetwork.network();

  
    const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
    const value = await incentivelayer.LICENSE_FEE();

    expect(ethers.utils.formatEther(value)).to.equal('0.4');
  });
});

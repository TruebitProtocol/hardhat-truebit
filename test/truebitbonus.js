const { expect } = require("chai");
const { ethers } = require("hardhat");
const truebitgoerli = require("../client/goerli.json");
const truebitmain = require("../client/mainnet.json");

describe("Check network connection", function () {
  it("Should return if Truebit license price", async function () {
    
    var contract ;
    switch (hre.network.name) {
        case "mainnet":
            contract = truebitmain;
            break;
        case "hardhat":
            contract= truebitgoerli;
            break;
        case "goerli":
            contract= truebitgoerli;
            break;
    }

    const accounts = await hre.ethers.getSigners();
    const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
    const value = await incentivelayer.LICENSE_FEE();

    expect(ethers.utils.formatEther(value)).to.equal('0.4');
  });
});

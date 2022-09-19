const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const sinon = require("sinon");
const myNetwork = require("../util/networkSelector");
const web3 = require("web3");

describe("Truebit tasks test", function () {
    let spyLog;
    let contract;
    let incentivelayer;
    let trucontract;
    let purchasecontract;

    this.beforeAll(async ()=>{
        spyLog = sinon.spy(console, "info");
        contract = myNetwork.network();
        incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
        trucontract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
        purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);

    })

    it("should print accounts in node", async function () {

        const accounts = await hre.run("accounts");
        const nodeAccounts =(await hre.ethers.getSigners()).map(elm=>elm.address);
        
        nodeAccounts.forEach(elm=>{
            expect(spyLog.calledWith(elm)).to.be.true;
        })
    });

    it("should print balance from account 0", async function () {

        const accountIndex = '0';
        await hre.run("balance",{a:accountIndex});        
        const accounts = await hre.ethers.getSigners();
        const balance = await accounts[accountIndex].getBalance();
        expect(spyLog.calledWith("balance: \n   Address: ", accounts[accountIndex].address)).to.be.true;
        expect(spyLog.calledWith("   Account: %s ETH", ethers.utils.formatEther(balance))).to.be.true;

        // Tru balance
        const balancetru = await trucontract.balanceOf(accounts[accountIndex].address);
        expect(spyLog.calledWith("             %s TRU", ethers.utils.formatEther(balancetru))).to.be.true;

        // Tru deposit
        const deposit = await incentivelayer.getUnbondedDeposit(accounts[accountIndex].address);
        expect(spyLog.calledWith("Deposit (Unbonded):  %s TRU", ethers.utils.formatEther(deposit))).to.be.true;

    });

    it("should return bonus values", async()=>{

        await hre.run("bonus");        

        const value = await incentivelayer.bonusTable();

        let ownerAmount = ethers.utils.formatEther(value.mul(2).toString()) / 9;
        let solverAmount = ethers.utils.formatEther(value.mul(4).toString()) / 9;
        let verifierAmount = ethers.utils.formatEther(value.mul(3).toString()) / 9;

        expect(spyLog.calledWith("info: Subsidies per task")).to.be.true;
        expect(spyLog.calledWith("     %s TRU for the Task Owner", ownerAmount)).to.be.true;
        expect(spyLog.calledWith("     %s TRU for the Solver, and", solverAmount)).to.be.true;
        expect(spyLog.calledWith("     %s TRU for split among Verifiers", verifierAmount)).to.be.true;
    })

    describe("license command",()=>{
        it("should print license price", async()=>{
            await hre.run("license",{param1:"price"});        
            const value = await incentivelayer.LICENSE_FEE();
            expect(spyLog.calledWith("Solver license price %s eth", ethers.utils.formatEther(value))).to.be.true;
        })
    
        it("should print license not owned", async()=>{
            const accountIndex = '0';
            await hre.run("license",{param1:"check", a:accountIndex});  
    
            const accounts = await hre.ethers.getSigners();      
            const solver = web3.utils.soliditySha3('SOLVER');
            if (await purchasecontract.hasRole(solver, accounts[accountIndex].address)) {
                expect(spyLog.calledWith("Has license")).to.be.true;
            } else {
                expect(spyLog.calledWith("No license")).to.be.true;
            }
        })
    
    })
    
});

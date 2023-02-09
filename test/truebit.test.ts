import hre, { ethers, run, web3 } from 'hardhat';
import { expect } from 'chai';
import sinon from 'ts-sinon';
import { getCurrentNetworkContracts } from '../utils/networkSelector';
import { Contract } from 'ethers';
import { NetworkContracts } from '../types/networkContracts';

describe('Truebit tasks test', function () {
  let spyLog: sinon.SinonSpy;
  let contract: NetworkContracts;
  let incentiveLayerContract: Contract;
  let truContract: Contract;
  let purchaseContract: Contract;

  this.beforeAll(async () => {
    spyLog = sinon.spy(console, 'info');
    contract = await getCurrentNetworkContracts(hre);
    incentiveLayerContract = await ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
    truContract = await ethers.getContractAt(contract.tru.abi, contract.tru.address);
    purchaseContract = await ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
  });

  it('should print accounts in node', async function () {
    await run('accounts');
    const nodeAccounts = (await ethers.getSigners()).map((elm) => elm.address);
    nodeAccounts.forEach((elm) => {
      expect(spyLog.calledWith(elm)).to.be.true;
    });
  });

  it('should print balance from account 0', async function () {
    const ACCOUNT_INDEX = '0';
    await run('balance', { a: ACCOUNT_INDEX });
    const accounts = await ethers.getSigners();
    const balance = await accounts[ACCOUNT_INDEX].getBalance();
    expect(spyLog.calledWith('balance: \n   Address: ', accounts[ACCOUNT_INDEX].address)).to.be.true;
    expect(spyLog.calledWith('   Account: %s ETH', ethers.utils.formatEther(balance))).to.be.true;

    // Tru balance
    const balancetru = await truContract.balanceOf(accounts[ACCOUNT_INDEX].address);
    expect(spyLog.calledWith('             %s TRU', ethers.utils.formatEther(balancetru))).to.be.true;

    // Tru deposit
    const deposit = await incentiveLayerContract.getUnbondedDeposit(accounts[ACCOUNT_INDEX].address);
    expect(spyLog.calledWith('Deposit (Unbonded):  %s TRU', ethers.utils.formatEther(deposit))).to.be.true;
  });

  it('should print bonus values', async () => {
    await run('bonus');
    const value = await incentiveLayerContract.bonusTable();
    const ownerAmount = Number(ethers.utils.formatEther(value.mul(2).toString())) / 9;
    const solverAmount = Number(ethers.utils.formatEther(value.mul(4).toString())) / 9;
    const verifierAmount = Number(ethers.utils.formatEther(value.mul(3).toString())) / 9;
    expect(spyLog.calledWith('info: Subsidies per task')).to.be.true;
    expect(spyLog.calledWith('     %s TRU for the Task Owner', ownerAmount)).to.be.true;
    expect(spyLog.calledWith('     %s TRU for the Solver, and', solverAmount)).to.be.true;
    expect(spyLog.calledWith('     %s TRU for split among Verifiers', verifierAmount)).to.be.true;
  });

  describe('license command', () => {
    it('should print license price', async () => {
      await run('license', { param1: 'price' });
      const value = await incentiveLayerContract.LICENSE_FEE();
      expect(spyLog.calledWith('Solver license price %s eth', ethers.utils.formatEther(value))).to.be.true;
    });

    it('should print license not owned', async () => {
      const ACCOUNT_INDEX = '0';
      await run('license', { a: ACCOUNT_INDEX, param1: 'check' });
      const accounts = await ethers.getSigners();
      const solver = web3.utils.soliditySha3('SOLVER');
      if (await purchaseContract.hasRole(solver, accounts[ACCOUNT_INDEX].address)) {
        expect(spyLog.calledWith('Has license')).to.be.true;
      } else {
        expect(spyLog.calledWith('No license')).to.be.true;
      }
    });
  });
});

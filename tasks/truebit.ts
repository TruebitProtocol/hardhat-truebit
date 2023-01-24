import { getCurrentNetworkContracts } from '../utils/networkSelector';
import { startProcess, getProcesses, stopProcess, getProcessStatus, getTasks, submitTask, getTaskParameters, getTaskStatus } from '../utils/tb-api';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types/index';
import { parseBoolean, parseInteger } from '../utils/parsers';
import { Process, ProcessStartParameters, ProcessStopParameters } from '../types/apiTypes';
import fs from 'fs';
import path from 'path';
import { decryptJsonWalletSync } from '@ethersproject/json-wallets';

task('accounts', 'Prints the addresses of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.info(account.address);
  }
});

// Check License price, check and purchase
task('license', 'Prints license price')
  .addPositionalParam('param1')
  .addOptionalParam('a')
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment): Promise<void> => {
    // Checking correct parameters syntax
    if (taskArgs.param1 == 'price' || taskArgs.param1 == 'check' || taskArgs.param1 == 'purchase') {
      //get accounts
      const accounts = await hre.ethers.getSigners();
      // contracts
      const contract = await getCurrentNetworkContracts(hre.network);

      if (taskArgs.param1 == 'price') {
        const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
        const value = await incentivelayer.LICENSE_FEE();
        console.info('Solver license price %s eth', hre.ethers.utils.formatEther(value));
      }
      if (taskArgs.param1 == 'check') {
        const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
        const solver = hre.web3.utils.soliditySha3('SOLVER');
        if (await purchasecontract.hasRole(solver, accounts[taskArgs.a].address)) {
          console.info('Has license');
        } else {
          console.info('No license');
        }
      }
      if (taskArgs.param1 == 'purchase') {
        const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
        const solver = hre.web3.utils.soliditySha3('SOLVER');
        //check if the user already has a license
        if (!(await purchasecontract.hasRole(solver, accounts[taskArgs.a].address))) {
          console.info('Account     %s ', accounts[taskArgs.a].address);
          const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
          //License price
          const valuelic = await incentivelayer.LICENSE_FEE();
          //Buy License
          try {
            await incentivelayer
              .connect(accounts[taskArgs.a])
              .buyLicense(accounts[taskArgs.a].address, { from: accounts[taskArgs.a].address, gasLimit: 200000, value: valuelic });
            console.info('info: Purchase complete.  Address %s has successfully registered as Solver.', accounts[taskArgs.a].address);
          } catch (err) {
            console.error(`Unable to purchase.  ${err}`);
          }
        } else {
          console.info('Has license');
        }
      }
    } else {
      console.info('Check syntax error in parameters');
    }
  });

// Token operations
// price: return the current price for purchase and sell
task('token', 'Token Operations: prices, purchase, deposit, transfer-eth, transfer-tru, retire and withdraw')
  .addPositionalParam('mainOp')
  .addOptionalParam('v')
  .addOptionalParam('a')
  .addOptionalParam('t')
  .setAction(async (taskArgs, hre) => {
    // Checking correct parameters syntax
    if (
      taskArgs.mainOp == 'price' ||
      taskArgs.mainOp == 'purchase' ||
      taskArgs.mainOp == 'deposit' ||
      taskArgs.mainOp == 'retire' ||
      taskArgs.mainOp == 'transfer-eth' ||
      taskArgs.mainOp == 'transfer-tru' ||
      taskArgs.mainOp == 'withdraw'
    ) {
      //get accounts
      const accounts = await hre.ethers.getSigners();
      // contracts
      const contract = await getCurrentNetworkContracts(hre.network);

      if (taskArgs.mainOp == 'price') {
        // Tru price
        const trucontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
        const valuetrubuy = await trucontract.getPurchasePrice(hre.ethers.utils.parseUnits('1000'));
        const valuetrusell = await trucontract.getRetirePrice(hre.ethers.utils.parseUnits('1000'));
        console.info('Purchase 1000 TRU for %s ETH', hre.ethers.utils.formatEther(valuetrubuy));
        console.info('Retiring 1000 TRU for %s ETH', hre.ethers.utils.formatEther(valuetrusell));
      }
      if (taskArgs.mainOp == 'purchase') {
        const purchaseContract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
        //TRU Price
        const purchasePriceETH = await purchaseContract.getPurchasePrice(hre.ethers.utils.parseUnits(taskArgs.v));
        const purchasePriceETHRef = await purchaseContract.getPurchasePrice(hre.ethers.utils.parseUnits('1000'));
        // Tru BuyTRU
        try {
          const valuetrubuy = await purchaseContract
            .connect(accounts[taskArgs.a])
            .buyTRU(hre.ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 100000, value: purchasePriceETH });
          console.info(
            'info: Address %s bought %s TRU with %s ETH',
            accounts[taskArgs.a].address,
            taskArgs.v,
            hre.ethers.utils.formatEther(valuetrubuy.value)
          );
          console.info('The effective price was %s TRU/ETH. Hash %s', hre.ethers.utils.formatEther(purchasePriceETHRef), valuetrubuy.hash);
        } catch (err) {
          console.error(`Unable to purchase.  ${err}`);
        }
      }
      if (taskArgs.mainOp == 'deposit') {
        if (hre.ethers.utils.parseUnits(taskArgs.v).gt(0)) {
          const truContract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
          try {
            await truContract
              .connect(accounts[taskArgs.a])
              .approve(contract.incentiveLayer.address, hre.ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address });
            const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
            await incentivelayer
              .connect(accounts[taskArgs.a])
              .makeDeposit(hre.ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 120000 });
            console.info(
              'Deposited ' +
                taskArgs.v +
                ' TRU from Account ' +
                accounts[taskArgs.a].address +
                ' into IncentiveLayer ' +
                contract.incentiveLayer.address +
                '.'
            );
          } catch (err) {
            console.error(`Unable to deposit.  ${err}`);
          }
        }
      }
      if (taskArgs.mainOp == 'retire') {
        if (hre.ethers.utils.parseUnits(taskArgs.v).gt(0)) {
          const truContract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
          const purchaseContract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
          try {
            await truContract
              .connect(accounts[taskArgs.a])
              .approve(contract.purchase.address, hre.ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address });
            await purchaseContract
              .connect(accounts[taskArgs.a])
              .sellTRU(hre.ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 200000 });
            const retirePriceETH = await purchaseContract.connect(accounts[taskArgs.a]).getRetirePrice(hre.ethers.utils.parseUnits(taskArgs.v));
            console.info(
              `Address ` +
                accounts[taskArgs.a].address +
                ` retired ` +
                taskArgs.v +
                ` TRU in exchange for ` +
                hre.ethers.utils.formatEther(retirePriceETH)
            );
          } catch (err) {
            console.error(`Unable to retire.  ${err}`);
          }
        }
      }
      if (taskArgs.mainOp == 'transfer-eth') {
        if (hre.ethers.utils.parseUnits(taskArgs.v).gt(0)) {
          try {
            await accounts[taskArgs.a].sendTransaction({
              from: accounts[taskArgs.a].address,
              gasLimit: 200000,
              to: accounts[taskArgs.t].address,
              value: hre.ethers.utils.parseUnits(taskArgs.v),
            });
            console.info(
              'Transferred ' + taskArgs.v + ' ETH from account ' + accounts[taskArgs.a].address + ' to account ' + accounts[taskArgs.t].address + '.'
            );
          } catch (err) {
            console.error(`Unable to transfer.  ${err}`);
          }
        }
      }
      if (taskArgs.mainOp == 'transfer-tru') {
        if (hre.ethers.utils.parseUnits(taskArgs.v).gt(0)) {
          const truContract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
          try {
            await truContract.connect(accounts[taskArgs.a]).transfer(accounts[taskArgs.t].address, hre.ethers.utils.parseUnits(taskArgs.v), {
              from: accounts[taskArgs.a].address,
              gasLimit: 200000,
            });
            console.info(
              'Transferred ' + taskArgs.v + ' TRU from account ' + accounts[taskArgs.a].address + ' to account ' + accounts[taskArgs.t].address + '.'
            );
          } catch (err) {
            console.error(`Unable to transfer.  ${err}`);
          }
        }
      }
      if (taskArgs.mainOp == 'withdraw') {
        const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
        if (hre.ethers.utils.parseUnits(taskArgs.v).gt(0)) {
          try {
            await incentivelayer
              .connect(accounts[taskArgs.a])
              .withdrawDeposit(hre.ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 200000 });
            console.info(
              'Withdrew ' +
                taskArgs.v +
                ' TRU from IncentiveLayer ' +
                contract.incentiveLayer.address +
                ' to account ' +
                accounts[taskArgs.a].address +
                '.'
            );
          } catch (err) {
            console.error(`Unable to withdraw.  ${err}`);
          }
        }
      }
    } else {
      console.info('Check syntax error in parameters');
    }
  });

// Check balance
task('balance', "Prints an account's balance")
  .addOptionalParam('a')
  .setAction(async (taskArgs, hre) => {
    //get accounts
    const accounts = await hre.ethers.getSigners();
    // contracts
    const contract = await getCurrentNetworkContracts(hre.network);
    const balance = await accounts[taskArgs.a].getBalance();
    console.info('balance: \n   Address: ', accounts[taskArgs.a].address);
    console.info('   Account: %s ETH', hre.ethers.utils.formatEther(balance));
    // Tru balance
    const truContract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
    const truBalance = await truContract.balanceOf(accounts[taskArgs.a].address);
    console.info('             %s TRU', hre.ethers.utils.formatEther(truBalance));
    // Tru deposit
    const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
    const deposit = await incentivelayer.getUnbondedDeposit(accounts[taskArgs.a].address);
    console.info('Deposit (Unbonded):  %s TRU', hre.ethers.utils.formatEther(deposit));
  });

// Check Bonus per task
task('bonus', 'Display current per task subsidy').setAction(async (taskArgs, hre) => {
  // contracts
  const contract = await getCurrentNetworkContracts(hre.network);
  const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
  const value = await incentivelayer.bonusTable();

  const ownerAmount = Number(hre.ethers.utils.formatEther(value.mul(2).toString())) / 9;
  const solverAmount = Number(hre.ethers.utils.formatEther(value.mul(4).toString())) / 9;
  const verifierAmount = Number(hre.ethers.utils.formatEther(value.mul(3).toString())) / 9;
  console.info('info: Subsidies per task');
  console.info('     %s TRU for the Task Owner', ownerAmount);
  console.info('     %s TRU for the Solver, and', solverAmount);
  console.info('     %s TRU for split among Verifiers', verifierAmount);
});

task('start', 'Starts a new process on TruebitOS')
  .addPositionalParam('mainOp')
  .addOptionalParam('a', 'Index of web3 account to use (default = 0)')
  .addOptionalParam('t', 'Solver will give bogus solutions, Verifier will challenge correct solutions')
  .addOptionalParam('l', 'Set minimum TRU reward (resp. Verifier tax) for participation, default = 0')
  .addOptionalParam('r', 'Resume processes with bonded deposits from <num> blocks behind current block')
  .addOptionalParam('p', 'Set minimum ratio of reward (resp. Verifier tax) to blockLimit, default = 0')
  .setAction(async (taskArgs) => {
    try {
      if (['solver', 'verifier'].includes(taskArgs.mainOp)) {
        const parameters: ProcessStartParameters = {
          account: parseInteger(taskArgs.a),
          limit: parseInteger(taskArgs.l),
          price: parseInteger(taskArgs.p),
          recover: parseInteger(taskArgs.r),
          test: parseBoolean(taskArgs.t),
        };
        const message = await startProcess(taskArgs.mainOp, parameters);
        console.info(message?.data);
      } else {
        console.info('Check syntax error in parameters');
      }
    } catch (err) {
      console.error(err);
    }
  });

task('stop', 'Stops a running process on TruebitOS')
  .addPositionalParam('mainOp')
  .addParam('p', 'Index of process running')
  .setAction(async (taskArgs) => {
    try {
      if (['solver', 'verifier'].includes(taskArgs.mainOp)) {
        const parameters: ProcessStopParameters = {
          processNumber: parseInt(taskArgs.p),
        };
        const message = await stopProcess(taskArgs.mainOp, parameters);
        console.info(message?.data);
      } else {
        console.info('Check syntax error in parameters');
      }
    } catch (err) {
      console.error(err);
    }
  });

task('ps', 'List all processes running on TruebitOS').setAction(async () => {
  try {
    const processes = (await getProcesses())?.data;
    if (processes) {
      if (!processes.solvers.length && !processes.verifiers.length) {
        throw new Error('There are no processes running');
      }
      console.info('SOLVERS:');
      processes.solvers.forEach((elm: Process, index) => {
        console.info(`${index}) ${elm.address}`);
      });
      console.info('VERIFIERS:');
      processes.verifiers.forEach((elm: Process, index) => {
        console.info(`${index}) ${elm.address}`);
      });
    } else {
      throw new Error('processes is undefined');
    }
  } catch (err) {
    console.error(err);
  }
});

task('process-status', 'Stops a running process on TruebitOS')
  .addPositionalParam('mainOp')
  .addParam('p', 'Index of process running')
  .setAction(async (taskArgs) => {
    try {
      if (['solver', 'verifier'].includes(taskArgs.mainOp)) {
        const message = await getProcessStatus(taskArgs.mainOp, { processNumber: parseInt(taskArgs.p) });
        if (message) {
          message.data.logs.forEach((elm) => {
            console.info(elm);
          });
        } else {
          throw new Error('message is undefined');
        }
      } else {
        console.info('Check syntax error in parameters');
      }
    } catch (err) {
      console.error(err);
    }
  });

task('task', 'List all task submitted on TruebitOS')
  .addPositionalParam('mainOp')
  .addOptionalParam('a', 'Index of web3 account to use (default = 0)')
  .addOptionalParam('f', 'File name with task metadata inside file system')
  .addOptionalParam('h', 'Hash of the task submitted')
  .setAction(async (taskArgs) => {
    try {
      if (['list'].includes(taskArgs.mainOp)) {
        const tasks = await getTasks();
        if (tasks) {
          console.info(tasks.data.data);
        } else {
          throw new Error('tasks is undefined');
        }
      } else if (['submit'].includes(taskArgs.mainOp)) {
        if (taskArgs.a || taskArgs.f) {
          console.info('Submitting task to blockchain...');
          const message = await submitTask({ account: parseInt(taskArgs.a), taskFile: taskArgs.f });
          if (message) {
            console.info(`${message.data.message} with hash ${message.data.hash}`);
          } else {
            throw new Error('message is undefined');
          }
        } else {
          console.info('Please provide account and file arguments');
        }
      } else if (['parameters'].includes(taskArgs.mainOp)) {
        if (taskArgs.h) {
          const message = await getTaskParameters({ taskHash: taskArgs.h });
          if (message) {
            Object.entries(message.data.data).forEach(([key, value]) => console.info(`${key}: ${value}`));
          }
        } else {
          console.info('Please provide task hash');
        }
      } else if (['status'].includes(taskArgs.mainOp)) {
        if (taskArgs.h) {
          const message = await getTaskStatus({ taskHash: taskArgs.h });
          if (message) {
            message.data.data.logs.forEach((elm) => {
              console.info(elm);
            });
          } else {
            throw new Error('message is undefinded');
          }
        } else {
          console.info('Please provide task hash');
        }
      } else {
        console.info('Check syntax error in parameters');
      }
    } catch (err) {
      console.error(err);
    }
  });

task('pk', 'Receives private key JSON file and retrieves private key string')
  .addParam('file', 'Relative path to directory of private key in JSON keystore format')
  .addParam('password', 'Decrypt password')
  .setAction(async (taskArgs) => {
    try {
      const pkFile = fs.readFileSync(path.join(__dirname, taskArgs.file), 'utf8');
      const decryptedPK = decryptJsonWalletSync(pkFile, taskArgs.password);
      console.info('Address: ', decryptedPK.address);
      console.info('Private key: ', decryptedPK.privateKey);
    } catch (err) {
      console.error(err);
    }
  });

// Verify if the account is ready for
/* task("verification", "check account ready for truebit")
    .addPositionalParam("account")
    .setAction(async (taskArgs, hre) => {     
        var verification = true;
        // contracts
        var contract = getCurrentNetworkContracts();

        const accountip = await hre.ethers.getSigner(taskArgs.account);
        const balance = await accountip.getBalance();
        if (ethers.utils.formatEther(balance) < 0.02) {
            console.info("\x1b[31m You need more ETH to execute Truebit, minimum 0.02 ETH, in your account: %s ETH", ethers.utils.formatEther(balance));
            verification = false;
        }

        // Tru balance
        const trucontract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
        const balancetru = await trucontract.balanceOf(taskArgs.account);

        // Tru deposit
        const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
        const deposit = await incentivelayer.getUnbondedDeposit(taskArgs.account);

        if (ethers.utils.formatEther(deposit) < 11) {
            console.info("- \x1b[31m Not enough TRU, please deposit  TRU");
            console.info("    Minimum deposits depend on the role ");
            console.info("    Task Submmiter 8 TRU, Solver and Verify 10 TRU");
            console.info("    current deposit: %s TRU", ethers.utils.formatEther(deposit));
            if (ethers.utils.formatEther(balancetru) > 10) {
                console.info("    This account has %s TRU", ethers.utils.formatEther(balancetru));
                console.info("    you can se it to deposit in Truebit");
            } else {
                (console.info("    You need first to purchase some TRU before depositing in Truebit"));
            }
            verification = false;
        }
        const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
        const solver = web3.utils.soliditySha3('SOLVER');
        if (!(await purchasecontract.hasRole(solver, taskArgs.account))) {
            console.info("\x1b[31m -This account doesn't have a LICENSE, If you plan to Solve, you need to purchase a License, cost 0.4 ETH");
            verification = false;
        }
        if (verification) {
            console.info("\x1b[32m The account is READY to execute TRUEBIT");
        }
        console.info("\x1b[37m \n");
        // }

    }); */

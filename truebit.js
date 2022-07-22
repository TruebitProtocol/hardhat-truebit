const ether = require("@nomiclabs/hardhat-ethers");
const { keccak256 } = require("ethers/lib/utils");
const truebitgoerli = require("./client/goerli.json");
const truebitmain = require("./client/mainnet.json");
const web3 = require("web3");
const myNetwork = require("./util/networkSelector");


// Check License price, check and purchase
task("license", "Prints license price")
    .addPositionalParam("param1")
    .addOptionalParam("a")
    .setAction(async (taskArgs, hre) => {
        // Checking correct parameters syntax 
        if (taskArgs.param1 == "price" || taskArgs.param1 == "check" || taskArgs.param1 == "purchase") {
            //get accounts
            const accounts = await hre.ethers.getSigners();
           // contracts
           var contract = myNetwork.network();

            if (taskArgs.param1 == "price") {  
                const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
                const value = await incentivelayer.LICENSE_FEE();
                console.info("Solver license price %s eth", ethers.utils.formatEther(value));
            }
            if (taskArgs.param1 == "check") {
                const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
                const solver = web3.utils.soliditySha3('SOLVER');
                if (await purchasecontract.hasRole(solver, accounts[taskArgs.a].address)) {
                    console.info("Has license");
                } else {
                    console.info("No license");
                }

            }
            if (taskArgs.param1 == "purchase") {

                const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
                const solver = web3.utils.soliditySha3('SOLVER');
                //check if the user already has a license
                if (!await purchasecontract.hasRole(solver, accounts[taskArgs.a].address)) {
                    console.info("Account     %s ", accounts[taskArgs.a].address);
                    const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
                    //License price
                    const valuelic = await incentivelayer.LICENSE_FEE();
                    //Buy License
                    try {
                        const buyLicense = await incentivelayer.connect(accounts[taskArgs.a]).buyLicense(accounts[taskArgs.a].address, { from: accounts[taskArgs.a].address, value: valuelic, gasLimit: 200000 });
                        console.info("info: Purchase complete.  Address %s has successfully registered as Solver.", accounts[taskArgs.a].address);
                    } catch (err) {
                        console.error(`Unable to purchase.  ${err}`)
                    }

                }else {
                console.info("Has license");}
            }
        } else {
            console.info("Check syntax error in parameters");

        }
    });


// Token operations
// price: return the current price for purchase and sell
task("token", "Token Operations: prices, purchase, deposit, transfer-eth, transfer-tru, retire and withdraw")
    .addPositionalParam("mainOp")
    .addOptionalParam("v")
    .addOptionalParam("a")
    .addOptionalParam("t")
    .setAction(async (taskArgs, hre) => {
        
        // Checking correct parameters syntax 
        if (taskArgs.mainOp == "price" || taskArgs.mainOp == "purchase" || taskArgs.mainOp == "deposit" || taskArgs.mainOp == "retire" || taskArgs.mainOp == "transfer-eth" || taskArgs.mainOp == "transfer-tru" || taskArgs.mainOp == "withdraw") {
           //get accounts
            const accounts = await hre.ethers.getSigners();
            // contracts
           var contract = myNetwork.network();

            if (taskArgs.mainOp == "price") {
                // Tru price
                const trucontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
                const valuetrubuy = await trucontract.getPurchasePrice(ethers.utils.parseUnits("1000"));
                const valuetrusell = await trucontract.getRetirePrice(ethers.utils.parseUnits("1000"));
                console.info("Purchase 1000 TRU for %s ETH", ethers.utils.formatEther(valuetrubuy));
                console.info("Retiring 1000 TRU for %s ETH", ethers.utils.formatEther(valuetrusell));
            }
            if (taskArgs.mainOp == "purchase") {
                const purchaseContract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
                //TRU Price
                const purchasePriceETH = await purchaseContract.getPurchasePrice(ethers.utils.parseUnits(taskArgs.v));
                const purchasePriceETHRef = await purchaseContract.getPurchasePrice(ethers.utils.parseUnits("1000"));
                // Tru BuyTRU
                try {
                    const valuetrubuy = await purchaseContract.connect(accounts[taskArgs.a]).buyTRU(ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, value: purchasePriceETH, gasLimit: 100000 });
                    console.info("info: Address %s bought %s TRU with %s ETH", accounts[taskArgs.a].address, taskArgs.v, ethers.utils.formatEther(valuetrubuy.value));
                    console.info("The effective price was %s TRU/ETH. Hash %s", ethers.utils.formatEther(purchasePriceETHRef), valuetrubuy.hash);
                } catch (err) {
                    console.error(`Unable to purchase.  ${err}`)
                }

                
            }
            if (taskArgs.mainOp == "deposit") {
                if (ethers.utils.parseUnits(taskArgs.v) > 0) {
                    const truContract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
                    try {
                        await truContract.connect(accounts[taskArgs.a]).approve(contract.incentiveLayer.address, ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address });
                        const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
                        await incentivelayer.connect(accounts[taskArgs.a]).makeDeposit(ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 120000 });
                        console.info('Deposited ' + taskArgs.v + ' TRU from Account ' + accounts[taskArgs.a].address + ' into IncentiveLayer ' + contract.incentiveLayer.address + '.');
                    } catch (err) {
                        console.error(`Unable to deposit.  ${err}`);
                    }
                }
            }

            if (taskArgs.mainOp == "retire") {
                if (ethers.utils.parseUnits(taskArgs.v) > 0) {
                    const truContract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
                    const purchaseContract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
                    try {
                        await truContract.connect(accounts[taskArgs.a]).approve(contract.purchase.address, ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address });
                        await purchaseContract.connect(accounts[taskArgs.a]).sellTRU(ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 200000 });
                        // console.info('Deposited ' + taskArgs.v + ' TRU from account ' + accounts[taskArgs.a].address + ' into IncentiveLayer ' + contract.incentiveLayer.address +'.');
                        let retirePriceETH = await purchaseContract.connect(accounts[taskArgs.a]).getRetirePrice(ethers.utils.parseUnits(taskArgs.v));
                        console.info(`Address ` + accounts[taskArgs.a].address + ` retired ` + taskArgs.v + ` TRU in exchange for ` +  ethers.utils.formatEther(retirePriceETH) );
                    } catch (err) {
                        console.error(`Unable to retire.  ${err}`);
                    }
                }
            }

            if (taskArgs.mainOp == "transfer-eth") {
                if (ethers.utils.parseUnits(taskArgs.v) > 0) {
                    try {
                        await accounts[taskArgs.a].sendTransaction({ from: accounts[taskArgs.a].address, to: accounts[taskArgs.t].address, value: ethers.utils.parseUnits(taskArgs.v), gasLimit: 200000 })
                        console.info('Transferred ' + taskArgs.v + ' ETH from account ' + accounts[taskArgs.a].address + ' to account ' + accounts[taskArgs.t].address + '.')
                    } catch (err) {
                        console.error(`Unable to transfer.  ${err}`);
                    }

                }
            }

            if (taskArgs.mainOp == "transfer-tru") {
                if (ethers.utils.parseUnits(taskArgs.v) > 0) {
                    const truContract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
                    try {
                        await truContract.connect(accounts[taskArgs.a]).transfer(accounts[taskArgs.t].address, ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 200000 });
                        console.info('Transferred ' + taskArgs.v + ' TRU from account ' + accounts[taskArgs.a].address + ' to account ' + accounts[taskArgs.t].address + '.');
                    } catch (err) {
                        console.error(`Unable to transfer.  ${err}`);
                    }
                }
            }

            if (taskArgs.mainOp == "withdraw") {
                const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
                if (ethers.utils.parseUnits(taskArgs.v) > 0) {
                    try {
                        await incentivelayer.connect(accounts[taskArgs.a]).withdrawDeposit(ethers.utils.parseUnits(taskArgs.v), { from: accounts[taskArgs.a].address, gasLimit: 200000 });
                        console.info('Withdrew ' + taskArgs.v + ' TRU from IncentiveLayer ' + contract.incentiveLayer.address + ' to account ' + accounts[taskArgs.a].address + '.');
                    } catch (err) {
                        console.error(`Unable to withdraw.  ${err}`);
                    }
                }
            }

        } else {
            console.info("Check syntax error in parameters");
        }
    });


// Check balance
task("balance", "Prints an account's balance")
    .addOptionalParam("a")
    .setAction(async (taskArgs, hre) => {
        //get accounts
        const accounts = await hre.ethers.getSigners();
        // contracts
        var contract = myNetwork.network();
        //const accounts = await hre.ethers.getSigners();
        const balance = await accounts[taskArgs.a].getBalance();
        console.info("balance: \n   Address: ", accounts[taskArgs.a].address);
        console.info("   Account: %s ETH", ethers.utils.formatEther(balance));
        // Tru balance
        const trucontract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
        const balancetru = await trucontract.balanceOf(accounts[taskArgs.a].address);
        console.info("             %s TRU", ethers.utils.formatEther(balancetru));
        // Tru deposit
        const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
        const deposit = await incentivelayer.getUnbondedDeposit(accounts[taskArgs.a].address);
        console.info("Deposit (Unbonded):  %s TRU", ethers.utils.formatEther(deposit));
    });


// Impersonate 
// get Balance impersonating specific account 
/*task("impersonate", "Impersonate account and provide ETH balance")
    .addPositionalParam("param1")
    .addPositionalParam("account")
    .setAction(async (taskArgs, hre) => {
        if (taskArgs.param1 == "true") {
            await hre.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: [taskArgs.account],
            });
            await network.provider.send("hardhat_setBalance", [
                taskArgs.account,
                "0xFB900000000000000",
            ]);
            // contracts
            var contract = myNetwork.network();
            const accountip = await hre.ethers.getSigner(taskArgs.account);
            console.info("balance: \n   Address: ", accountip.address);
            const balance = await accountip.getBalance();
            console.info("   account: %s ETH", ethers.utils.formatEther(balance));
            // Tru balance
            const trucontract = await hre.ethers.getContractAt(contract.tru.abi, contract.tru.address);
            const balancetru = await trucontract.balanceOf(taskArgs.account);
            console.info("             %s TRU", ethers.utils.formatEther(balancetru));
            // Tru deposit
            const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
            const deposit = await incentivelayer.getUnbondedDeposit(taskArgs.account);
            console.info("deposit (unbonded):  %s TRU", ethers.utils.formatEther(deposit));
            const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi, contract.purchase.address);
            const solver = web3.utils.soliditySha3('SOLVER');
            if (await purchasecontract.hasRole(solver, taskArgs.account)) {
                console.info("Has license");
            } else {
                console.info("No license");
            }
        }
        if (taskArgs.param1 == "false") {
            await hre.network.provider.request({
                method: "hardhat_stopImpersonatingAccount",
                params: [taskArgs.account],
            });
            console.info("Impersonate ended");
        }
    });*/

// Check Bonus per task
task("bonus", "Display current per task subsidy")
    .setAction(async (taskArgs, hre) => {
        
        //get accounts
        const accounts = await hre.ethers.getSigners();
        // contracts
        var contract = myNetwork.network();
        const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi, contract.incentiveLayer.address);
        const value = await incentivelayer.bonusTable();

        let ownerAmount = ethers.utils.formatEther(value.mul(2).toString()) / 9;
        let solverAmount = ethers.utils.formatEther(value.mul(4).toString()) / 9;
        let verifierAmount = ethers.utils.formatEther(value.mul(3).toString()) / 9;
        console.info("info: Subsidies per task");
        console.info("     %s TRU for the Task Owner", ownerAmount);
        console.info("     %s TRU for the Solver, and", solverAmount);
        console.info("     %s TRU for split among Verifiers", verifierAmount);

    });

// Verify if the account is ready for  
/* task("verification", "check account ready for truebit")
    .addPositionalParam("account")
    .setAction(async (taskArgs, hre) => {     
        var verification = true;
        // contracts
        var contract = myNetwork.network();

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

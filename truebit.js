const ether = require("@nomiclabs/hardhat-ethers");
const { keccak256 } = require("ethers/lib/utils");
const truebitgoerli = require("./client/goerli.json");
const truebitmain = require("./client/mainnet.json");
const web3 = require("web3");


// Check License price, check and purchase
task("license", "Prints license price")
    .addPositionalParam("param1")
    .addOptionalParam("a")
    .setAction(async (taskArgs) => {
    // Checking correct parameters syntax 
    if (taskArgs.param1=="price" || taskArgs.param1=="check"  || taskArgs.param1=="purchase"){
        
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
            
            if (taskArgs.param1=="price"){
                const accounts = await hre.ethers.getSigners();
                const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
                const value = await incentivelayer.LICENSE_FEE();
                console.info("Solver license price %s eth", ethers.utils.formatEther(value));
            }
            if (taskArgs.param1=="check"){
                const accounts = await hre.ethers.getSigners();
                const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
                const solver = web3.utils.soliditySha3('SOLVER');
                if (await purchasecontract.hasRole(solver,accounts[taskArgs.index].address) ){
                    console.info("Has license");
                }else {
                    console.info("No license");
                }
                
            }
            if (taskArgs.param1=="purchase"){               
                const accounts = await hre.ethers.getSigners();
                console.log("Account     %s ", accounts[taskArgs.a].address);
                const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
                //License price
                const valuelic = await incentivelayer.LICENSE_FEE();
                //Buy License
                const buyLicense = await  incentivelayer.connect(accounts[taskArgs.a]).buyLicense(accounts[taskArgs.a].address , {from: accounts[taskArgs.a].address, value: valuelic});
                console.info("info: Purchase complete.  Address %s has successfully registered as Solver.",accounts[taskArgs.a].address);
            }
    }else{
            console.info("Check syntax error in parameters");
            
    }
  });

 
// Token operations
// price: return the current price for purchase and sell
task("token", "prices and purchase")
    .addPositionalParam("mainOp")
    .addOptionalParam("v")
    .addOptionalParam("a")
    .setAction(async (taskArgs) => {
     // Checking correct parameters syntax 
    if (taskArgs.mainOp=="price" || taskArgs.mainOp=="purchase"){
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
        if (taskArgs.mainOp=="price"){     
            const accounts = await hre.ethers.getSigners();
            // Tru price
            const trucontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
            const valuetrubuy = await trucontract.getPurchasePrice(ethers.utils.parseUnits("1000"));
            const valuetrusell = await trucontract.getRetirePrice(ethers.utils.parseUnits("1000"));
            console.info("Purchase 1000 TRU for %s ETH", ethers.utils.formatEther(valuetrubuy));
            console.info("Retiring 1000 TRU for %s ETH", ethers.utils.formatEther(valuetrusell));
        }
        if (taskArgs.mainOp=="purchase"){
            const accounts = await hre.ethers.getSigners();
            const purchaseContract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
            //TRU Price
            const purchasePriceETH = await purchaseContract.getPurchasePrice(ethers.utils.parseUnits(taskArgs.v));
            const purchasePriceETHRef = await purchaseContract.getPurchasePrice(ethers.utils.parseUnits("1000"));
            // Tru BuyTRU
            const valuetrubuy = await purchaseContract.connect(accounts[taskArgs.a]).buyTRU(ethers.utils.parseUnits(taskArgs.v), {from: accounts[taskArgs.a].address, value: purchasePriceETH});
            console.info("info: Address %s bought %s TRU with %s ETH",accounts[taskArgs.a].address, taskArgs.v,  ethers.utils.formatEther(valuetrubuy.value));
            console.info("The effective price was %s TRU/ETH. Hash %s",ethers.utils.formatEther(purchasePriceETHRef), valuetrubuy.blockHash );
        }
    }else {
        console.info("Check syntax error in parameters");
    }
  });


// Check balance
  task("balance", "Prints an account's balance")
    .addPositionalParam("param1")
    .addPositionalParam("index")
    .setAction(async (taskArgs) => {
     // Checking correct parameters syntax 
     if (taskArgs.param1=="-a" && !isNaN(taskArgs.index) ){
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
        if (taskArgs.param1=="-a"){ 
            const accounts = await hre.ethers.getSigners();
            const balance = await accounts[taskArgs.index].getBalance();
            console.info("balance: \n   Address: ",accounts[taskArgs.index].address);
            console.info("   account: %s ETH", ethers.utils.formatEther(balance));
            // Tru balance
            const trucontract = await hre.ethers.getContractAt(contract.tru.abi,contract.tru.address);
            const balancetru = await trucontract.balanceOf(accounts[taskArgs.index].address);
            console.info("             %s TRU", ethers.utils.formatEther(balancetru));
            // Tru deposit
            const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
            const deposit = await incentivelayer.getUnbondedDeposit(accounts[taskArgs.index].address);
            console.info("deposit (unbonded):  %s TRU", ethers.utils.formatEther(deposit));

        }
     }else{
        console.info("Check syntax error in parameters");
     }
  });


// Impersonate 
// get Balance impersonating specific account 
task("Impersonate", "Impersonate account")
    .addPositionalParam("param1")
    .addPositionalParam("account")
    .setAction(async (taskArgs) => {
    if (taskArgs.param1=="true"){     
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [taskArgs.account],
          });
          await network.provider.send("hardhat_setBalance", [
            taskArgs.account,
            "0xFB900000000000000",
          ]);
          var contract ;
        switch (hre.network.name) {
            case "mainnet":
                contract = truebitmain;
                break;
            case "hardhat":
                contract= truebitgoerli;
                break;
        }
        const accountip = await hre.ethers.getSigner(taskArgs.account);
        console.info("balance: \n   Address: ",accountip.address);
        const balance = await accountip.getBalance();
        console.info("   account: %s ETH", ethers.utils.formatEther(balance));
         // Tru balance
         const trucontract = await hre.ethers.getContractAt(contract.tru.abi,contract.tru.address);
         const balancetru = await trucontract.balanceOf(taskArgs.account);
         console.info("             %s TRU", ethers.utils.formatEther(balancetru));
         // Tru deposit
         const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
         const deposit = await incentivelayer.getUnbondedDeposit(taskArgs.account);
         console.info("deposit (unbonded):  %s TRU", ethers.utils.formatEther(deposit));
         const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
         const solver = web3.utils.soliditySha3('SOLVER');
         if (await purchasecontract.hasRole(solver,taskArgs.account) ){
             console.info("Has license");
         }else {
             console.info("No license");
         }
    }
    if (taskArgs.param1=="false"){
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [taskArgs.account],
          });
    }
  });

// Check Bonus per task
task("bonus", " Display current per task subsidy")
.setAction(async (taskArgs) => {
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
const value = await incentivelayer.bonusTable();

let ownerAmount = ethers.utils.formatEther(value.mul(2).toString())/9;
let solverAmount = ethers.utils.formatEther(value.mul(4).toString())/9;
let verifierAmount = ethers.utils.formatEther(value.mul(3).toString())/9;
console.info("info: Subsidies per task");
console.info("     %s TRU for the Task Owner", ownerAmount);
console.info("     %s TRU for the Solver, and", solverAmount);
console.info("     %s TRU for split among Verifiers", verifierAmount);

});

// Verify if the account is ready for  
task("verification", "check account")
    .addPositionalParam("account")
    .setAction(async (taskArgs) => {
    //if (taskArgs.param1=="check"){     
        var verification = true;
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [taskArgs.account],
          });
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

        const accountip = await hre.ethers.getSigner(taskArgs.account);
        const balance = await accountip.getBalance();
        if ( ethers.utils.formatEther(balance)<0.02){
            console.info("\x1b[31m You need more ETH to execute Truebit, minimum 0.02 ETH, in your account: %s ETH", ethers.utils.formatEther(balance));    
            verification = false;
        }
        
         // Tru balance
         const trucontract = await hre.ethers.getContractAt(contract.tru.abi,contract.tru.address);
         const balancetru = await trucontract.balanceOf(taskArgs.account);
         
         // Tru deposit
         const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
         const deposit = await incentivelayer.getUnbondedDeposit(taskArgs.account);
         
         if ( ethers.utils.formatEther(deposit)<11){
            console.info("- \x1b[31m Not enough TRU, please deposit  TRU");
            console.info("    Minimum deposits depend on the role ");
            console.info("    Task Submmiter 8 TRU, Solver and Verify 10 TRU");
            console.info("    current deposit: %s TRU", ethers.utils.formatEther(deposit));
            if (ethers.utils.formatEther(balancetru)>10){
                console.info("    This account has %s TRU", ethers.utils.formatEther(balancetru));
                console.info("    you can se it to deposit in Truebit");
            }else{
                (console.info("    You need first to purchase some TRU before depositing in Truebit"));
            }
            verification = false;
         }
         const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
         const solver = web3.utils.soliditySha3('SOLVER');
         if (!(await purchasecontract.hasRole(solver,taskArgs.account)) ){
             console.info("\x1b[31m -This account doesn't have a LICENSE, If you plan to Solve, you need to purchase a License, cost 0.4 ETH"); 
             verification = false;
         }
         if(verification){
             console.info("\x1b[32m The account is READY to execute TRUEBIT");
         }
         console.info("\x1b[37m \n");
   // }
    
  });
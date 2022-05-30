const ether = require("@nomiclabs/hardhat-ethers");
const { keccak256 } = require("ethers/lib/utils");
const truebitgoerli = require("./client/goerli.json");
const truebitmain = require("./client/mainnet.json");


// Check License price
task("license", "Prints license price")
    .addPositionalParam("param1")
    .addPositionalParam("param2")
    .addPositionalParam("index")
    .setAction(async (taskArgs) => {
    var contract ;
    switch (hre.network.name) {
        case "mainnet":
            contract = truebitmain;
            break;
        case "hardhat":
            contract= truebitgoerli;
            break;
    }
    const solver = hre.ethers.utils.sha256(hre.ethers.utils.toUtf8Bytes("SOLVER"));
    if (taskArgs.param1=="price"){
        const accounts = await hre.ethers.getSigners();
        //const contractAddress = truebit.incentiveLayer.address;
        const incentivelayer = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
        
        const value = await incentivelayer.LICENSE_FEE();
    
        console.log("Solver license price %s eth", ethers.utils.formatEther(value));
    }
    if (taskArgs.param1=="check"){
        const accounts = await hre.ethers.getSigners();
        const purchasecontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
        if (await purchasecontract.hasRole(solver,accounts[taskArgs.index]) ){
            console.log("Has license");
        }else {
            console.log("No license");
        }
        
    }
    if (taskArgs.param1=="purchase"){}
  });


 
// Token operations
// price: return the current price for purchase and sell
task("token", "prices and purchase")
    .addPositionalParam("param1")
    .setAction(async (taskArgs) => {
    if (taskArgs.param1=="price"){     
        const accounts = await hre.ethers.getSigners();
        var contract = truebitgoerli;
        //const contractAddress = truebit.incentiveLayer.address;
        // Tru price
        const trucontract = await hre.ethers.getContractAt(contract.purchase.abi,contract.purchase.address);
            
        const valuetrubuy = await trucontract.getPurchasePrice(ethers.utils.parseUnits("1000"));
        const valuetrusell = await trucontract.getRetirePrice(ethers.utils.parseUnits("1000"));
        console.log("Purchase 1000 TRU for %s eth", ethers.utils.formatEther(valuetrubuy));
        console.log("Retiring 1000 TRU for %s eth", ethers.utils.formatEther(valuetrusell));
    }
    if (taskArgs.param1=="purchase"){}
  });


// Check balance
  task("balance", "Prints an account's balance")
    .addPositionalParam("param1")
    .addPositionalParam("index")
    .setAction(async (taskArgs) => {
        var contract ;
        switch (hre.network.name) {
            case "mainnet":
                contract = truebitmain;
                break;
            case "hardhat":
                contract= truebitgoerli;
                break;
        }
        if (taskArgs.param1=="-r"){ 
            const accounts = await hre.ethers.getSigners();
            const balance = await accounts[taskArgs.index].getBalance();
            console.log("balance: \n account: %s ETH", ethers.utils.formatEther(balance));
            
            // Tru balance
            const trucontract = await hre.ethers.getContractAt(contract.tru.abi,contract.tru.address);
            const balancetru = await trucontract.balanceOf(contract.tru.address);
            console.log("          %s TRU", ethers.utils.formatEther(balancetru));
            // Tru deposit
            const trudecontract = await hre.ethers.getContractAt(contract.incentiveLayer.abi,contract.incentiveLayer.address);
            const balancedetru = await trudecontract.balancedetru(contract.tru.address);
            console.log("          %s TRU deposit ", ethers.utils.formatEther(balancedetru));

        }
  });




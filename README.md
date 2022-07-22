# What is Truebit?
[Truebit](https://truebit.io/) is a blockchain enhancement which enables smart contracts to securely perform complex computations in standard programming languages at reduced gas costs. 


Try running some of the following tasks:

```shell
To fork Goerli or mainnet, change configuration in hardhat.config and execute:

npx hardhat token price --network goerli


npx hardhat run scripts/truebitprices.js --network mainnet

# Send task using especific network  
npx hardhat run scripts/truebitprices.js --network Goerli

#token price
npx hardhat token price --network Goerli

#license price
npx hardhat license price --network Goerli

#license check
npx hardhat license check --a 1 --network Goerli

#balance
npx hardhat balance --a 0 --network goerli 

#bonus
npx hardhat bonus --network goerli

#using network specific
npx hardhat balance --a 0 --network goerli

# Test Truebit network reach
npx hardhat --network Goerli test

#update commands

npx hardhat license purchase --a 0 --network goerli

npx hardhat balance --a 0 --network goerli

npx hardhat token purchase --v 10 --a 2 --network goerli

npx hardhat token retire --v 20 --a 1 --network goerli

npx hardhat token deposit --v 20 --a 1 --network goerli

npx hardhat token transfer-eth --v 0.05 --a 0 --t 1 --network goerli

npx hardhat token transfer-tru --v 1 --a 0 --t 1 --network goerli

npx hardhat token withdraw --v 7 --a 0  --network goerli


npx hardhat accounts
npx hardhat compile
npx hardhat clean

npx hardhat help

```

Forking with ganache

Launch Ganache

ganache --fork.url https://goerli.infura.io/v3/<YOUR INFURA API KEY> --miner.blockTime 5

npx hardhat token purchase --v 10 --a 2 --network localhost

npx hardhat token deposit --v 20 --a 1 --network localhost
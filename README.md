# What is Truebit?
[Truebit](https://truebit.io/) is a blockchain enhancement which enables smart contracts to securely perform complex computations in standard programming languages at reduced gas costs. 


Try running some of the following tasks:

```shell
To fork Goerli or mainnet, change configuration in hardhat.config and execute:

npx hardhat node --network hardhat



npx hardhat run scripts/truebitprices.js --network mainnet

# Send task using especific network  
npx hardhat run scripts/truebitprices.js --network hardhat

#token price
npx hardhat token price

#license price
npx hardhat license price

#license check
npx hardhat license check --a 1

#balance
npx hardhat balance --a 0 --network goerli

#bonus
npx hardhat bonus

#Impersonate account for balance
npx hardhat Impersonate true 0x2F25f5DF360305977Fef8F6730883a787785B802

#Stop Impersonate account for balance
npx hardhat Impersonate false 0x2F25f5DF360305977Fef8F6730883a787785B802

#verify the account ready to submit task, solve or verify
npx hardhat verification  0x1F04a03F5fBF7fD20EC461efC38f8827B2E6AF6a

#using network specific
npx hardhat balance --a 0 --network goerli

# Test Truebit network reach
npx hardhat test

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

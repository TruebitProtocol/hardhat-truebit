# What is Truebit?
[Truebit](https://truebit.io/) is a blockchain enhancement which enables smart contracts to securely perform complex computations in standard programming languages at reduced gas costs. 


Try running some of the following tasks:

```shell
To fork Goerli or mainnet, change configuration in hardhat.config and execute:

npx hardhat node --network hardhat

npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test

npx hardhat run scripts/truebitprices.js --network mainnet

# fork
npx hardhat run scripts/truebitprices.js --network hardhat

#token price
npx hardhat token price

#license price
npx hardhat license price

#license check
npx hardhat license check -a 1

#balance
npx hardhat balance -r 1 

#bonus
npx hardhat bonus

#Impersonate account for balance
npx hardhat Impersonate true 0x2F25f5DF360305977Fef8F6730883a787785B802

#Stop Impersonate account for balance
npx hardhat Impersonate false 0x2F25f5DF360305977Fef8F6730883a787785B802

#using network specific
npx hardhat balance -r 0 --network goerli

npx hardhat help
```

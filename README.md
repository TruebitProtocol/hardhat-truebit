# What is Truebit?

[Truebit](https://truebit.io/) is a blockchain enhancement which enables smart contracts to securely perform complex computations in standard programming languages at reduced gas costs.

## Truebit - Hardhat standard development environment

This project is meant to test Truebit.

### Prerequisites:

1. Visual Studio Code (latest version)
2. Visual Studio Code required extensions:<BR>
   ESLint: `"dbaeumer.vscode-eslint"`,<BR>
   Prettier-Code Formatter: `"esbenp.prettier-vscode"`,<BR>
   Solidity: `"nomicfoundation.hardhat-solidity"`<BR>
   VSCode extesion install command:<BR>
   `code --install-extension <publisher.extension>`
3. Visual Studio Code recommended extensions:<BR>
   Back & Forth: `"nick-rudenko.back-n-forth"`,<BR>
   Code Spell Checker: `"streetsidesoftware.code-spell-checker"`,<BR>
   Git Graph: `"mhutchie.git-graph"`,<BR>
   Git History: `"donjayamanne.githistory"`,<BR>
   GitLens — Git supercharged: `"eamodio.gitlens"`,<BR>
   TODO Highlight: `"wayou.vscode-todo-highlight"`,<BR>
   Todo Tree: `"gruntfuggly.todo-tree"`,<BR>
4. Nodejs environment:<BR>
   Hardhat supports the latest LTS version of NodeJS.
   The project has a package.json property to set the minimum versions of node and npm:
   ```json
   "engines": {
    "npm": ">=8.19.3",
    "node": ">=18.13.0"
   },
   ```

### Getting the project working

1. Install dependencies:<BR>
   `npm install`
2. Set in the `.env` file the required environment variables according to what it is indicated in `.env.example` file and the use scenario.
3. Setup and run the Ethereum network and TruebitOS. Please follow the "Getting Started Guide" https://truebit.io/guide/prerequisites/
4. Execute the tests or tasks:<BR>
   Note: Please note that localhost is the default network, so it is not necessary to set it on the commands.<BR>
   If you want to use a different network please add `--network [networkName]` at the end of the commands.<BR>
   Tests (example):<BR>
   `npx hardhat test`<BR>
   Tasks (example):<BR>
   `npx hardhat accounts`<BR>
   `npx hardhat balance --a 0`<BR>
5. Execute ESlint and TypeScript check types:<BR>
   `npm run lint`<BR>
   `npm run check-types`<BR>
6. Check for available dependencies updates:<BR>
   `npx ncu`
7. Pre-commit hook:<BR>
   This hook will be executed every time you do a commit, and it will execute lint and check-types package.json scripts. If any of those have a finding it won't allow you to finish the commit until you fix the issue.<BR>
   This configuration is set on package.json
   ```json
   "scripts": {
      "lint": "npx eslint . --ext .ts",
      "check-types": "npx tsc --noEmit",
      "ncu": "npx ncu -e 2"
    },
    "pre-commit": {
      "run": [
        "lint",
        "check-types",
        "ncu"
      ],
      "silent": true,
      "colors": true
    }
   ```
8. Github pull request template `.github/PULL_REQUEST_TEMPLATE.md`<BR>
   This template will show up every time you create a PR as description template.
9. For coding styling and other rules please see the following configuration files:<BR>
   `.prettierrc`<BR>
   `.eslintrc.json`<BR>
   This VSCode workspace configuration file `.vscode/settings.json` is set to auto format every time you paste or save a file using the plugin `"esbenp.prettier-vscode"` as default formatter.<BR>

## Try running some of the following tasks:

```shell

npx hardhat token price --network goerli
npx hardhat run scripts/truebitprices.js --network mainnet

# Send task using specific network
npx hardhat run scripts/truebitprices.js --network goerli

# Token price
npx hardhat token price --network goerli

# License price
npx hardhat license price --network goerli

# License check
npx hardhat license check --a 1 --network goerli

# Balance
npx hardhat balance --a 0 --network goerli

# Bonus
npx hardhat bonus --network goerli

# Using network specific
npx hardhat balance --a 0 --network goerli

# Test Truebit network reach
npx hardhat --network goerli test

# Update commands

npx hardhat license purchase --a 0 --network goerli

npx hardhat balance --a 0 --network goerli

npx hardhat token purchase --v 10 --a 2 --network goerli

npx hardhat token retire --v 20 --a 1 --network goerli

npx hardhat token deposit --v 20 --a 1 --network goerli

npx hardhat token transfer-eth --v 0.05 --a 0 --t 1 --network goerli

npx hardhat token transfer-tru --v 1 --a 0 --t 1 --network goerli

npx hardhat token withdraw --v 7 --a 0  --network goerli

npx hardhat start {{ solver | verifier }} --a {{ accountIndex }} --network goerli

npx hardhat stop {{ solver | verifier }} --p {{ processIndex }} --network goerli

npx hardhat ps --network goerli

npx hardhat process-status {{ solver | verifier }} --p {{ processIndex }} --network goerli

npx hardhat task list --network goerli

npx hardhat task submit --a 0 --f factorial.json --network goerli

npx hardhat task status --h {{ taskHash }} --network localhost

npx hardhat task parameters --h {{ taskHash }} --network localhost

npx hardhat accounts
npx hardhat compile
npx hardhat clean

npx hardhat help
```

## Decrypt private key in JSON keystore format

```
npx hardhat pk --file pk.json --password test
```

## Forking with ganache

### Launch Ganache

```
ganache --fork.url https://goerli.infura.io/v3/<YOUR INFURA API KEY> --miner.blockTime 5

npx hardhat token purchase --v 10 --a 2 --network localhost

npx hardhat token deposit --v 20 --a 1 --network localhost
```

# To run tests

### First, run a local instance of ethereum blockchain with ganache:

`ganache --fork.url https://goerli.infura.io/v3/<YOUR INFURA API KEY> --miner.blockTime 5`

### Execute tests command:

`npx hardhat test --network localhost`

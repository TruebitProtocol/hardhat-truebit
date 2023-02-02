<p align="center">
  <img src="./doc/images/truebit-logo.png" width="650">
</p>

# What is Truebit?

[Truebit](https://truebit.io/) is a blockchain enhancement which enables smart contracts to securely perform complex computations in standard programming languages at reduced gas costs. As described in the [whitepaper](https://people.cs.uchicago.edu/~teutsch/papers/truebit.pdf) and this graphical, developer-oriented [overview](https://medium.com/truebit/truebit-the-marketplace-for-verifiable-computation-f51d1726798f), Task Givers can issue computational tasks while Solvers and Verifiers receive remuneration for correctly solving them. You may wish to familiarize yourself with the practical, high-level [user guide](https://medium.com/truebit/getting-started-with-truebit-on-ethereum-ac1c7cdb0907) before proceeding.

This comprehensive Ethereum implementation includes everything you need to create (from C, C++, or Rust code), issue, solve, and verify Truebit tasks. This repo includes the Truebit-OS command line [client configurations](https://github.com/TruebitProtocol/truebit-eth/tree/master/wasm-client) for solving and verifying tasks, some [libraries ported to WebAssembly](https://github.com/TruebitProtocol/truebit-eth/tree/master/wasm-ports), an [wasm module wrapper](https://github.com/TruebitProtocol/truebit-eth/tree/master/wasm-module-wrapper) for adding runtime hooks, a [Rust tool](https://github.com/TruebitProtocol/truebit-eth/tree/master/rust-tool) for generating tasks, the [off-chain interpreter](https://github.com/TruebitProtocol/truebit-eth/tree/master/ocaml-offchain) for executing and snapshotting computations, as well as [sample tasks](#Sample-tasks-via-smart-contracts). You can install Truebit using Docker or build it from source for Linux, MacOS, or Windows.

Feel free to browse the [legacy wiki](https://github.com/TruebitProtocol/wiki), contribute to this repo's wiki, or check out these classic development blog posts:

- [Developing with Truebit: An Overview](https://medium.com/truebit/developing-with-truebit-an-overview-86a2e3565e22)
- [Using the Truebit Filesystem](https://medium.com/truebit/using-the-truebit-filesystem-f6a5d4ac9604)
- [Truebit Toolchain & Transmute](https://medium.com/truebit/truebit-toolchain-transmute-4984928364a7)
- [Writing a Truebit Task in Rust](https://medium.com/truebit/writing-a-truebit-task-in-rust-6d96f2ee0a4b)
- [JIT for Truebit](https://medium.com/truebit/jit-for-truebit-e5299afc72d8)

In addition, Truebit's [Reddit](https://www.reddit.com/r/truebit/) channel features links to some excellent introductions and mainstream media articles about Truebit. If you'd like to speak with developers working on this project, come say hello on Truebit's [Gitter](https://gitter.im/TruebitProtocol/Lobby) and [Discord](https://discord.gg/CzpsQ66) channels.

# Table of contents

1. [Before you begin: what you will need (Requirements)](#before-you-begin-what-you-will-need-requirements)
2. [Install Truebit’s Hardhat Framework](#install-truebits-hardhat-framework)
3. [Configuration Overview](#configuration-overview)
4. [Configure Infura](#configure-infura)
5. [Create your Ethereum accounts](#create-your-ethereum-accounts)
6. [Export Private Keys](#export-private-keys)
7. [Share your accounts with your environment](#share-your-accounts-with-your-environment)
8. [Share your accounts with Hardhat](#share-your-accounts-with-hardhat)
9. [Dependencies: Install libraries](#dependencies-install-libraries)
10. [Environment: Test Accounts](#environment-test-accounts)
11. [Truebit Commands](#truebit-commands)
12. [Forking with Ganache](#forking-with-ganache)
13. [Hardhat: interacting with Truebit Smart Contracts](#hardhat-interacting-with-truebit-smart-contracts)
14. [Hardhat Test structure for Truebit ](#hardhat-test-structure-for-truebit)
15. [Task execution using Ganache](#Task-execution-using-Ganache)
16. [Truebit - Hardhat standard development environment](#Truebit---Hardhat-standard-development-environment)

# Before you begin: what you will need (Requirements)

Make sure you have the following packages properly installed

- Docker: Developers - [Docker (Getting Started)](https://www.docker.com/get-started/)

- Download and configure TruebitOS Docker Image [Solvers/Verifiers Getting Started Guide](https://truebit.io/guide/prerequisites/)

- NodeJS Latest LTS version: [Download Node.js](https://nodejs.org/en/)

- Git for your system: [Git - Downloads](https://git-scm.com/downloads)

- Visual Studio Code: [Download VS Code](https://code.visualstudio.com/download)

# Install Truebit’s Hardhat Framework

Clone Truebit’s Hardhat repository; it has pre-configured networks and TruebitOS commands built-in: [GitHub - TruebitProtocol/hardhat-truebit](https://github.com/TruebitProtocol/truebit-eth)

# Configuration Overview

Open the folder with Visual Code [(Download VS Code)](https://code.visualstudio.com/download). Truebit’s hardhat repository has a environment variables example file (`.env.example`), we will modify it and rename it as `.env`. You will modify this file to add your personal keys as you follow along.

`~/hardhat-truebit/.env.example`

```
INFURA_KEY=<YOUR_API_KEY>
ACCOUNT_PRIVATE_KEY1 = <YOUR ETHEREUM PRIVATE KEY>
ACCOUNT_PRIVATE_KEY2 = <YOUR ETHEREUM PRIVATE KEY>
ACCOUNT_PRIVATE_KEY3 = <YOUR ETHEREUM PRIVATE KEY>
API_URL=<YOUR URL AND PORT>
```

**Note:** As API_URL example, need to change it by your Docker address and port

# Configure Infura

In order to fork from an Ethereum Goerli or Mainnet, you will need a free account with Infura. Create an account before continuing: [Ethereum API | IPFS API & Gateway | ETH Nodes as a Service](https://www.infura.io/)

Create a New Project

![Infura 01](/doc/images/infura01.png)

Then press **Create**

After the creation, click on MANAGE YOUR KEYS button.

![Infura 02](/doc/images/infura02.png)

Copy the API KEY string, something like this `<38c9e686f44946c3 .... f24d664799d1>`

![Infura 03](/doc/images/infura03.png)

Insert your API KEY in the `.env` file

```
INFURA_KEY=<YOUR_API_KEY>
ACCOUNT_PRIVATE_KEY1 = <YOUR ETHEREUM PRIVATE KEY>
ACCOUNT_PRIVATE_KEY2 = <YOUR ETHEREUM PRIVATE KEY>
ACCOUNT_PRIVATE_KEY3 = <YOUR ETHEREUM PRIVATE KEY>
API_URL=<YOUR URL AND PORT>
```

# Create your Ethereum accounts

During TruebitOS setup, you had the chance to create multiple accounts using clef; we will extract the private keys from the JSON files generated by clef. [(Please look into TruebitOS Docker setup for more details)](https://truebit.io/guide/create-a-wallet/)

# Export Private Keys

TruebitOS accounts are located inside the folder `/root/.ethereum/[goerli | mainnet]/keystore` depending on which network you connected to while creating the accounts with clef. Alternatively, they can be located in the shared folder that you defined when launching the `docker run --network host  -v $YYY/docker-geth:/root/.ethereum -v  .....`

For example, for Goerli, you will find:

`ls -l /root/.ethereum/goerli/keystore`

```
-rw------- 1 root root  491 Apr 26 13:57 UTC--2022-04-26T13-57-55.369487731Z--2f25f5df360305977fef8f6730883a787785b802
-rw------- 1 root root  491 Apr 27 12:48 UTC--2022-04-27T12-48-24.658746176Z--353510ef7b01b4baad9616ae23d344c5945c6771
-rw------- 1 root root  491 Apr 28 12:13 UTC--2022-04-28T12-13-13.380635292Z--1da28542742614b3ca2941f9dfcd23ffc3cb0071
-rw------- 1 root root  491 May  5 14:27 UTC--2022-05-05T14-27-07.990563701Z--40641bc33cc3b30ab84473b95ca4bbd2ce8a015c
```

Once you have all the keystore JSON files located you can run the following command for each keystore JSON private key file:

`npx hardhat pk --file <RELATIVE_PATH_TO_KEYSTORE_JSON_FILE> --password <PASSWORD_TO_DECRYPT_JSON_PK>`

You will receive the address and the private key as the output in string hex format.

![Export PK](/doc/images/exportpk01.png)

# Share your accounts with your environment

You can use as many accounts as you want (create accounts with clef inside the TruebitOS docker), and insert your Ethereum private keys in the file .env. Account #0 corresponds to KEY1, account #1 to KEY2, and so on. You can use as many keys as you need. In the example below we set up accounts: #0, #1, and #2.

```
INFURA_KEY=38c9e686f4aaaaaaaaa4d664799d1
ACCOUNT_PRIVATE_KEY1 = 2b40c512afsfasf2342aaaaaade5afb3b19af599461e814afab7175e5f6e
ACCOUNT_PRIVATE_KEY2 = 2b30c5dfa3r2g232d32bbbbbbde5afb3b19af599461e814afab7175e5aae
ACCOUNT_PRIVATE_KEY3 = 2b90c5liu23j23'k142ccccccce5afb3b19af599461e814afab7175e5bbe
API_URL=http://localhost:3000
```

# Share your accounts with Hardhat

Once you setup your process.env, we need to make Hardhat aware of these accounts; we will modify `hardhat.config.js`

Look into the networks section, and add the accounts you created in .env; below is an example with the three accounts we created previously. Note that you can reference to the private keys using:
`${process.env.ACCOUNT_PRIVATE_KEYn};`
where "n" needs to match the numbers you used in `.env`.

```javascript

networks: {
  mainnet: {
    chainId: 1,
    url: `<https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,> // ${INFURA_KEY} - must be your API key in process.env

    // include your accounts PK
    accounts: [`${process.env.ACCOUNT_PRIVATE_KEY1}`, `${process.env.ACCOUNT_PRIVATE_KEY2}`, `${process.env.ACCOUNT_PRIVATE_KEY3}`],
  },

  goerli: {
    chainId: 5,
    url: `<https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,> // ${INFURA_KEY} - must be your API key in process.env

    // include your accounts PK
    accounts: [`${process.env.ACCOUNT_PRIVATE_KEY1}`, `${process.env.ACCOUNT_PRIVATE_KEY2}`, `${process.env.ACCOUNT_PRIVATE_KEY3}`],
  },
}
```

# Dependencies: Install libraries

Before you can use hardhat, you need to install npm package dependencies; move inside the folder where you cloned hardhat-truebit:

```
cd hardhat-truebit
npm install
```

# Environment: Test Accounts

## Account setup

Test the local hardhat environment you should see the accounts you created and configured in the previous step [(Share your accounts with Hardhat)](#Share-your-accounts-with-Hardhat):

`npx hardhat accounts --network localhost`

![Accounts Localhost](/doc/images/tbcmds-01-accounts01.png)

## Test account access to Goerli Testnet

You should see the account you configure in the previous step [(Create your Ethereum accounts)](#Create-your-Ethereum-accounts)

`npx hardhat accounts --network goerli`

![Accounts Goerli](/doc/images/tbcmds-01-accounts02.png)

## Test account access to Ethereum Mainnet

You should see the account you configure in the previous step [(Create your Ethereum accounts)](#Create-your-Ethereum-accounts)

`npx hardhat accounts --network mainnet`

![Accounts Mainnet](/doc/images/tbcmds-01-accounts03.png)

# Truebit Commands

TruebitOS Smart Contracts have an installation on the Goerli Testnet. Using a faucet, you can get Goerli ETH to run Truebit in the Goerli. [Goerli PoW Faucet](https://goerli-faucet.pk910.de/)

For every command, you can select the network with the flag `--network` and values `localhost / goerli / mainnet` in order to connect the desired network. For this guide purpose, we will execute commands on Ganache local fork network (localhost).

## Accounts List

`npx hardhat accounts --network localhost`

This command will display the fork accounts created by Ganache

![Commands Accounts](/doc/images/tbcmds-01-accounts01.png)

## Account Balance

`npx hardhat balance --a 0 --network localhost`

This command will display the account selected balance

![Commands Balance](/doc/images/tbcmds-02-balance01.png)

## Bonus

`npx hardhat bonus --network localhost`

This command will display Truebit bonus incentives

![Commands Bonus](/doc/images/tbcmds-03-bonus01.png)

## License Price

`npx hardhat license price --network localhost`

This command will display the Solver license price in ETH.

![Commands License](/doc/images/tbcmds-04-licenseprice01.png)

## License Check

`npx hardhat license check --a 0 --network localhost`

This command will display if the selected account, owns a Solver license or not

![Commands License](/doc/images/tbcmds-05-licensecheck01.png)

## License Purchase

`npx hardhat license purchase --a 0 --network localhost`

This command will purchase a Solver license for the selected account

![Commands License](/doc/images/tbcmds-06-licensepurchase01.png)

## Token Price

`npx hardhat token price --network localhost`

This command will display the TRU token price on ETH, for purchasing and retiring

![Commands Token](/doc/images/tbcmds-07-tokenprice01.png)

## Token Purchase

`npx hardhat token purchase --v 1000 --a 0 --network localhost`

This command will purchase the desired amount of TRU (--v) into the selected account (--a)

![Commands Token](/doc/images/tbcmds-08-tokenpurchase01.png)

## Token Retire

`npx hardhat token retire --v 500 --a 0 --network localhost`

This command will retire the desired amount of TRU (--v) from the selected account (--a)

![Commands Token](/doc/images/tbcmds-09-tokenretire01.png)

## Token Deposit

`npx hardhat token deposit --v 300 --a 0 --network localhost`

This command will deposit TRU tokens into your account, to be used for task execution purposes

![Commands Token](/doc/images/tbcmds-10-tokendeposit01.png)

## Token Withdraw

`npx hardhat token withdraw --v 100 --a 0 --network localhost`

This command will withdraw TRU tokens from your deposited balance

![Commands Token](/doc/images/tbcmds-11-tokenwithdraw01.png)

## Token Transfer-ETH

`npx hardhat token transfer-eth --v 3 --a 0 --t 1 --network localhost`

This command will transfer the desired amount of ETH (-v) from account (--a) X to account (--t) Y.

![Commands Token](/doc/images/tbcmds-12-tokentrfETH01.png)

## Token Transfer-TRU

`npx hardhat token transfer-tru --v 100 --a 0 --t 1 --network localhost`

This command will transfer the desired amount of TRU (-v) from account (--a) X to account (--t) Y.

![Commands Token](/doc/images/tbcmds-13-tokentrfTRU01.png)

## Solver Start

`npx hardhat start solver --a 0 --network localhost`

This command will initialize a Solver process in the desired account (the account must have a Solver license to act as Solver)

![Commands Solver](/doc/images/tbcmds-14-solverstart01.png)

## Verifier Start

`npx hardhat start verifier --a 1 --network localhost`

This command will initialize a Verifier process in the desired account

![Commands Verifier](/doc/images/tbcmds-15-verifierstart01.png)

## Process Status

`npx hardhat ps --network localhost`

This command will display initialized process for Solver’s and Verifier’s with a process index (used to stop the current process)

![Commands Process Status](/doc/images/tbcmds-16-ps01.png)

## Solver Stop

`npx hardhat stop solver --p 0 --network localhost`

This command will stop the Solver process (--p) initialized before

![Commands Solver](/doc/images/tbcmds-17-solverstop01.png)

## Verifier Stop

`npx hardhat stop verifier --p 0 --network localhost`

This command will stop the Verifier process (--p) initialized before

![Commands Verifier](/doc/images/tbcmds-18-verifierstop01.png)

## Solver Process Status

`npx hardhat process-status solver --p 0 --network localhost`

This command will display Solver process logs of the desired process index (--p)

![Commands Solver](/doc/images/tbcmds-19-solverps01.png)

## Verifier Process Status

`npx hardhat process-status verifier --p 0 --network localhost`

This command will display Verifier process logs of the desired process index (--p)

![Commands Verifier](/doc/images/tbcmds-20-verifierps01.png)

## Task List

`npx hardhat task list --network localhost`

This command will display Task Giver account logs of tasks submitted in TruebitOS

![Commands Task](/doc/images/tbcmds-21-tasklist01.png)

## Task Submit

`npx hardhat task submit --a 2 --f factorial.json --network localhost`

This command will submit desired task execution (--f) from the desired account (--a). [Here](#Task-execution-using-Ganache) will find detailed information about Task Submit command.

# Forking with Ganache

<span style="color:red">**NOTE REGARDING HARDHAT FORKS:** <span>
Technically Hardhat also allows forking (without Ganache), but the current implementation has some issues with event propagation, and these are needed during task execution so we will only use Ganache for the time being.

Truebit-Hardhat allows you to fork Goerli or Mainnet in a local blockchain that you can use for development. Doing this has several advantages: a) you don’t need to request test tokens on a faucet which can be challenging at times, b) you will get better error reporting from the local fork, and c) transactions are mined and finalized much faster.

Below is a diagram that shows the relationship between Ethereum Goerli or Mainnet with your local fork. It’s important to note that once you stop your local fork all the transactions recorded in it will be lost and a new fork will commence on the latest block of the corresponding Ethereum chain (Goeli or Mainnet).

Ganache communicates with both: Hardhat and TruebitOS Docker through RPC, it in turn communicates with the upstream chain using Infura and the key you created previously.

Before you can use Ganache for local development, you need to install it and launch it; instructions for both tasks are detailed below.

![Ganache 01](/doc/images/forkganache01.png)

## Install Ganache

Ganache is distributed as an npm package, you can refer to [Ganache’s web page](https://trufflesuite.com/ganache/) for more details about its configuration and use; to install it, use this command:

`npm install ganache --global`

## Launch Ganache local fork

To launch Ganache you need to specify two command options:

- **Fork URL:** This is your Infura endpoint, you should include your Infura API key
- **Block Production Time interval:** This is needed because TruebitOS assumes that blocks are being produced to calculate timeouts. You can customize this value to your needs; during testing, we found that a 5s interval works in most situations.

You can launch your local blockchain fork like so:

`ganache --fork.url https://goerli.infura.io/v3/<YOUR_INFURA_API_KEY> --miner.blockTime 5`

<span style="color:red">**NOTE:** <span>
if your task needs more than 5 seconds to execute, you can modify the option `--miner.blockTime 5`

## Using Ganache local fork for Hardhat commands

Hardhat commands accept a “network” optional parameter that allows you to indicate which network should resolve the request. you can use any hardhat command with --network localhost to indicate that the command should be directed to Ganache's local fork. For example, to get the token price from your local fork you can use the following:

```
#token price
npx hardhat token price --network localhost
```

## Docker TruebitOS: Connecting to Ganache local fork

Normally TruebitOS will connect to either Goerli or Mainnet using a local geth instance; it is possible to direct geth to use your local fork; this will allow you to start and stop solvers and verifiers on the local fork and to submit a task that is resolved using the local fork as well.

To use TruebitOS inside of Docker, start the service like this:

`./goerli.sh` (then stop it, you can also use mainnet.sh instead)

Then execute the next command on directory `/truebit-eth/` to start TurebitOS with API flag:

`script -efq /ethereum/consensus/stdout.log -c "./truebit-os --api -p ws://host.docker.internal:8545"`

<span style="color:red">**NOTE:** <span>
Start goerli.sh or mainnet.sh and stop it, this will set some environment variables and start a demon required for the task execution.

Ganache on Host PC

![Ganache 02](/doc/images/forkganache02.png)

TruebitOS on Docker

![Ganache 03](/doc/images/forkganache03.png)

# Hardhat: interacting with Truebit Smart Contracts

If you need to interact with TruebitOS smart contracts from `ethers.js` or `web3.js`, you can find the ABIs in the following directories:

`/client/goerli.json`

`/client/mainnet.json`

# Hardhat Test structure for Truebit

You can write unit tests that interact with Truebit’s Smart Contracts; here is an example of how you could write tests; note the use of Truebit’s Smart Contract ABIs for either Goeli or Mainnet.

`/test/truebitLicense.js`

![Test Structure 01](/doc/images/teststructure01.png)

## To run tests

First, [run a local instance of ethereum blockchain with ganache](#launch-ganache-local-fork)

### Execute tests command:

### Dependencies

- mocha
- chai
- sinon

# Task execution using Ganache

In the current version of Hardhat Truebit, you need to launch task executions from within TruebitOS (Docker). However, the execution of these tasks can use your local fork if you started TruebitOS as directed above (See: [Docker TruebitOS: Connecting to Ganache local fork)](#Docker-TruebitOS:-Connecting-to-Ganache-local-fork).

You should have access to Ganache’s default accounts and their funding (1000 ETH each by default, configurable in ganache).

Test that you can access them by issuing the `accounts` command from within TruebitOS. Ganache start showing your nine available accounts with From TruebitOS:

![Task Execution 01](/doc/images/taskexecution01.png)

Check the account balance:

![Task Execution 02](/doc/images/taskexecution02.png)

Quick setup for a task execution: Before issuing a task, make sure you have the appropriate setup, you can type these commands in your hardhat prompt:

```
npx hardhat token purchase --a 0 --v 1000
npx hardhat token deposit --a 0 --v 1000
npx hardhat token purchase --a 1 --v 1000
npx hardhat token deposit --a 1 --v 1000
npx hardhat token purchase --a 2 --v 1000
npx hardhat token deposit --a 2 --v 1000
npx hardhat license purchase --a 0
npx hardhat start solver --a 0
npx hardhat start verifier --a 1
```

You can submit a task from Hardhat like so:

`npx hardhat task submit --a 2 --f factorial.json --network localhost`

This command will submit desired task execution (--f) from the desired account (--a).

![Task Execution 03](/doc/images/taskexecution03.png)

In TruebitOS CLI, will display the entire execution, with Task Giver, Solver, and Verifier logs

![Task Execution 04](/doc/images/taskexecution04.png)

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

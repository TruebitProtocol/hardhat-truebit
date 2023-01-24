import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-web3';
import * as dotenv from 'dotenv';
dotenv.config();
import './tasks/truebit';

const config: HardhatUserConfig = {
  defaultNetwork: 'localhost',
  networks: {
    goerli: {
      // ${INFURA_KEY} - must be your API key in process.env
      // include your accounts PK
      accounts: [`${process.env.ACCOUNT_PRIVATE_KEY1}`, `${process.env.ACCOUNT_PRIVATE_KEY2}`, `${process.env.ACCOUNT_PRIVATE_KEY3}`],
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
    },
    mainnet: {
      // ${INFURA_KEY} - must be your API key in process.env
      // include your accounts PK
      accounts: [`${process.env.ACCOUNT_PRIVATE_KEY1}`, `${process.env.ACCOUNT_PRIVATE_KEY2}`, `${process.env.ACCOUNT_PRIVATE_KEY3}`],
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.5.0',
      },
      {
        version: '0.8.17',
      },
    ],
  },
};

export default config;

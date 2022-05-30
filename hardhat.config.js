require("@nomiclabs/hardhat-waffle");
//require('dotenv').config();
require('dotenv').config({ path: require('find-config')('process.env') });

require("./truebit");


task("accounts", "Prints the  of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const CHAIN_IDS = {
  hardhat: 31337, // chain ID for hardhat testing
};
const accountss = process.env.ACCOUNT_PRIVATE_KEY;
console.log(accountss);

module.exports = {
  
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: CHAIN_IDS.hardhat,
      forking: {
             accounts: [`${process.env.ACCOUNT_PRIVATE_KEY}`],
        // Using Infura
        
        //url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, // ${INFURA_KEY} - must be your API key in process.env
        url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`, // ${INFURA_KEY} - must be your API key in process.env
        
        //blockNumber: 14821000, // a specific block number with which you want to work
      },
    },
    
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, // ${INFURA_KEY} - must be your API key in process.env
      //accounts: ["2b40c513f6df81142d0c8bfaa573cde5ffb3b19af566463e814afab7175e4f6e"],
      accounts: [`${process.env.ACCOUNT_PRIVATE_KEY}`],
    }
    
    
  }
}
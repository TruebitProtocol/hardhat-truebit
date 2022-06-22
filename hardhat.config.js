
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


module.exports = {
  
  solidity: "0.8.4",
  networks: {
    hardhat: {
      //chainId: CHAIN_IDS.hardhat,
      forking: {
        // Forking Goerli or Mainnet
        // Select the network to fork and un comment and modify /util/networkSelector.js  

        //url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, // ${INFURA_KEY} - must be your API key in process.env
        url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`, // ${INFURA_KEY} - must be your API key in process.env
        
      },
    },
    
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`, // ${INFURA_KEY} - must be your API key in process.env
      // include your accounts PK
      accounts: [`${process.env.ACCOUNT_PRIVATE_KEY1}`, `${process.env.ACCOUNT_PRIVATE_KEY2}`, `${process.env.ACCOUNT_PRIVATE_KEY3}`],
    },

    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`, // ${INFURA_KEY} - must be your API key in process.env
      // include your accounts PK
      accounts: [`${process.env.ACCOUNT_PRIVATE_KEY1}`, `${process.env.ACCOUNT_PRIVATE_KEY2}`, `${process.env.ACCOUNT_PRIVATE_KEY3}`],             
    },
    
  }
}
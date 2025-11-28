require('dotenv').config();
const { MNEMONIC, PROJECT_ID } = process.env;

// Uncomment if you want to deploy to public/test networks using mnemonic + Infura
// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    // Local Ganache (recommended for development)
    development: {
      host: "127.0.0.1",
      port: 7545,          // Ganache GUI/CLI default (change if your Ganache uses 8545)
      network_id: "*",     // Match any network id
      // gas: 6721975,     // Optional: set a gas limit
      // gasPrice: 20000000000, // Optional: 20 gwei
    },

    // Example: using HDWalletProvider + Infura for Goerli / Sepolia (uncomment to use)
    // goerli: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 5,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },

    // Example: another public network template
    // sepolia: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://sepolia.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 11155111,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // }
  },

  // Mocha test options
  mocha: {
    timeout: 200000
  },

  // Solidity compiler settings
  compilers: {
    solc: {
      version: "0.8.21", // exact version; change if you need a different one
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
        // evmVersion: "london" // optional
      }
    }
  },

  // Truffle DB (disabled by default)
  // db: {
  //   enabled: false
  // }
};

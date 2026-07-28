require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 2026001
    },
    piso: {
      url: process.env.RPC_URL || "http://localhost:8545",
      chainId: 2026001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      piso: "no-api-key-needed"
    },
    customChains: [
      {
        network: "piso",
        chainId: 2026001,
        urls: {
          apiURL: "https://piso-explorer.loca.lt/api",
          browserURL: "https://piso-explorer.loca.lt"
        }
      }
    ]
  }
};

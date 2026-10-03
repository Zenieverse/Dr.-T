import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    hedera_testnet: {
      url: "https://testnet.hashio.io/api",
      accounts: process.env.HEDERA_EVM_PRIVATE_KEY ? [process.env.HEDERA_EVM_PRIVATE_KEY] : [],
      chainId: 296
    }
  }
};

export default config;

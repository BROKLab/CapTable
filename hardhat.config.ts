import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@typechain/hardhat";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./src/artifacts",
  },
  typechain: {
    outDir: "./src/typechain",
  },
  networks: {
    besuDev: {
      url: "http://localhost:8545",
      accounts: [
        "0xad6f29b5b5285c8137787710ebdcc5ee16a3f09598a798bee470e158ade704fc",
      ],
    },
    brokStage: {
      url: "https://arbitrum-rinkeby.infura.io/v3/eaa35471bb7947adb685b17daa1030d4",
      accounts: {
        mnemonic:
          "coffee explain often powder satoshi jeans trade gas feel solid coil scheme",
      },
    },
    brokTest: {
      url: "https://arbitrum-rinkeby.infura.io/v3/d459cbc007fc49d2a44afbccc975e35c",
      accounts: {
        mnemonic:
          "adjust power answer goat stool paper ladder alter eternal order oyster inner",
      },
    },
    arbitrum: {
      url: "https://rinkeby.arbitrum.io/rpc",
      accounts: {
        mnemonic:
          "adjust power answer goat stool paper ladder alter eternal order oyster inner",
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  // typechain: {
  //   outDir: "typechain",
  //   target: "ethers-v5",
  // },
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
        },
      },
      {
        version: "0.7.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
      {
        version: "0.5.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
      {
        version: "0.6.2",
      },
    ],
  },
};
export default config;

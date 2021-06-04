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
      url: "https://e0ri5j5fp2:pA0jrXjkbgdltvu2iaXE7q9NjQy57S1AIF-v0FXyuJ4@e0mvr9jrs7-e0iwsftiw5-rpc.de0-aws.kaleido.io/",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
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

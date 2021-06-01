import { ethers, deployments } from "hardhat";
import { Signer } from "ethers";
import { CapTableRegistry__factory } from "../typechain/factories/CapTableRegistry__factory";
import { CapTableRegistry } from "../typechain/CapTableRegistry";
import { deployContract } from "ethereum-waffle";
import CapTableRegistryArtifact from "../artifacts/contracts/capTable/CapTableRegistry.sol/CapTableRegistry.json";
import { Wallet } from "ethers";
import { expect } from "chai";
import { CapTableFactory } from "../typechain";

describe("CapTableFactory", function () {
  beforeEach(async function () {
    await deployments.fixture();
  });

  it("should deploy capTable", async function () {
    const deployment = await deployments.getOrNull("CapTableFactory"); // Token is available because the fixture was executed
    if (!deployment) {
      throw Error("Deployment for test failed");
    }
    const capTableFactory = (await ethers.getContractAt(
      "CapTableFactory",
      deployment.address
    )) as CapTableFactory;

    const randomWallet = ethers.Wallet.createRandom();

    const tx = await capTableFactory.createCapTable(
      ethers.utils.formatBytes32String("123"),
      "Test Company",
      "TST"
    );
    await tx.wait();

    const capTableRegistryAddress =
      await capTableFactory.getCapTableRegistryAddress();

    const capTableRegistry = (await ethers.getContractAt(
      "CapTableRegistry",
      capTableRegistryAddress
    )) as CapTableRegistry;
    const capTables = await capTableRegistry.getList();
    console.log(capTables);
    expect(capTables.length > 0);
  });
});

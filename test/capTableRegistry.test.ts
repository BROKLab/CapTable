import { ethers, deployments } from "hardhat";
import { Signer } from "ethers";
import { CapTableRegistry__factory } from "./../typechain/factories/CapTableRegistry__factory";
import { CapTableRegistry } from "./../typechain/CapTableRegistry";
import { deployContract } from "ethereum-waffle";
import CapTableRegistryArtifact from "./../artifacts/contracts/capTable/CapTableRegistry.sol/CapTableRegistry.json";
import { Wallet } from "ethers";
import { expect } from "chai";

describe("CapTableRegistry", function () {
  beforeEach(async function () {
    await deployments.fixture();
  });

  it("should que contract", async function () {
    const deployment = await deployments.getOrNull("CapTableRegistry"); // Token is available because the fixture was executed
    if (!deployment) {
      throw Error("Deployment for test failed");
    }
    const capTableRegistry = (await ethers.getContractAt(
      "CapTableRegistry",
      deployment.address
    )) as CapTableRegistry;
    const randomWallet = ethers.Wallet.createRandom();
    const tx = await capTableRegistry.que(
      randomWallet.address,
      ethers.utils.formatBytes32String("123")
    );
    await tx.wait();

    const capTables = await capTableRegistry.getList();
    const activeCount = await capTableRegistry.getActiveCount();
    const quedCount = await capTableRegistry.getQuedCount();
    expect(activeCount.isZero());
    expect(quedCount.gte(ethers.constants.One));
    expect(capTables.includes(randomWallet.address));
  });

  it("should approve contract", async function () {
    const deployment = await deployments.getOrNull("CapTableRegistry"); // Token is available because the fixture was executed
    if (!deployment) {
      throw Error("Deployment for test failed");
    }
    const capTableRegistry = (await ethers.getContractAt(
      "CapTableRegistry",
      deployment.address
    )) as CapTableRegistry;
    const randomWallet = ethers.Wallet.createRandom();
    const tx = await capTableRegistry.que(
      randomWallet.address,
      ethers.utils.formatBytes32String("123")
    );
    await tx.wait();
    const txApprove = await capTableRegistry.approve(randomWallet.address);
    await txApprove.wait();
    const capTables = await capTableRegistry.getList();
    const activeCount = await capTableRegistry.getActiveCount();
    const quedCount = await capTableRegistry.getQuedCount();
    expect(quedCount.isZero());
    expect(activeCount.gte(ethers.constants.One));
    expect(capTables.includes(randomWallet.address));
  });
  it("should remove contract", async function () {
    const deployment = await deployments.getOrNull("CapTableRegistry"); // Token is available because the fixture was executed
    if (!deployment) {
      throw Error("Deployment for test failed");
    }
    const capTableRegistry = (await ethers.getContractAt(
      "CapTableRegistry",
      deployment.address
    )) as CapTableRegistry;
    const randomWallet = ethers.Wallet.createRandom();
    const tx = await capTableRegistry.que(
      randomWallet.address,
      ethers.utils.formatBytes32String("123")
    );
    await tx.wait();
    const txApprove = await capTableRegistry.approve(randomWallet.address);
    await txApprove.wait();
    const txRemove = await capTableRegistry.remove(randomWallet.address);
    await txRemove.wait();
    const capTables = await capTableRegistry.getList();
    const activeCount = await capTableRegistry.getActiveCount();
    const quedCount = await capTableRegistry.getQuedCount();
    expect(activeCount.isZero());
    expect(quedCount.isZero());
    expect(capTables.includes(randomWallet.address));
  });
  it("should decline contract", async function () {
    const deployment = await deployments.getOrNull("CapTableRegistry"); // Token is available because the fixture was executed
    if (!deployment) {
      throw Error("Deployment for test failed");
    }
    const capTableRegistry = (await ethers.getContractAt(
      "CapTableRegistry",
      deployment.address
    )) as CapTableRegistry;
    const randomWallet = ethers.Wallet.createRandom();
    const tx = await capTableRegistry.que(
      randomWallet.address,
      ethers.utils.formatBytes32String("123")
    );
    await tx.wait();
    const txDecline = await capTableRegistry.decline(
      randomWallet.address,
      ethers.utils.formatBytes32String("Some reason")
    );
    await txDecline.wait();
    const capTables = await capTableRegistry.getList();
    const activeCount = await capTableRegistry.getActiveCount();
    const quedCount = await capTableRegistry.getQuedCount();
    expect(activeCount.isZero());
    expect(quedCount.isZero());
    expect(capTables.includes(randomWallet.address));
  });
});

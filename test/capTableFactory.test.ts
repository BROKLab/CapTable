import { expect } from "chai";
import { BigNumber } from "ethers";
import { deployments, ethers } from "hardhat";
import { CapTableFactory, ERC1400, CapTableRegistry } from "./../src/typechain";

describe("CapTableFactory", function () {
  beforeEach(async function () {
    await deployments.fixture();
  });

  it("should deploy capTable, transfer rights and be issuable", async function () {
    const deployment = await deployments.getOrNull("CapTableFactory"); // Token is available because the fixture was executed
    if (!deployment) {
      throw Error("Deployment for test failed");
    }
    const capTableFactory = (await ethers.getContractAt(
      "CapTableFactory",
      deployment.address
    )) as CapTableFactory;

    const randomWallet = ethers.Wallet.createRandom();

    const capTableRegistryAddress =
      await capTableFactory.getCapTableRegistryAddress();

    const capTableRegistry = (await ethers.getContractAt(
      "CapTableRegistry",
      capTableRegistryAddress
    )) as CapTableRegistry;

    const tx = await capTableFactory.createCapTable(
      ethers.utils.formatBytes32String("456"),
      "Test Company",
      "TST"
    );
    const res = await tx.wait();
    const capTableAddress = await capTableRegistry.getLastQuedAddress(
      ethers.utils.formatBytes32String("456")
    );
    const capTables = await capTableRegistry.getList();
    console.log(capTables);
    expect(capTables.length > 0).to.be.true;
    expect(capTables.includes(capTableAddress)).to.be.true;
    const capTable = (await ethers.getContractAt(
      "ERC1400",
      capTableAddress
    )) as ERC1400;
    const owner = await capTable.owner();
    const deployerAddress = (await ethers.getSigners())[0].address;
    expect(owner === deployerAddress).to.be.true;
    const controllers = await capTable.controllers();
    expect(controllers.includes(deployerAddress)).to.be.true;
    const isMinter = await capTable.isMinter(deployerAddress);
    expect(isMinter).to.be.true;
    const mintTx = await capTable.issueByPartition(
      ethers.utils.formatBytes32String("ordinære"),
      deployerAddress,
      5000,
      "0x11"
    );
    await mintTx.wait();

    const totalSupply = await capTable.totalSupply();
    console.log(
      "total supply is ",
      totalSupply,
      totalSupply.gte(BigNumber.from(50001))
    );
    expect(totalSupply.gte(BigNumber.from(5000))).to.be.true;
  });
});

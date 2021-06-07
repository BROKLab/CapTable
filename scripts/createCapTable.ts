import { run, ethers, deployments, config, network } from "hardhat";
import { CapTableFactory, ERC1400 } from "../src/typechain";

async function main() {
  await run("compile");
  console.log("Deploying capTable on ", network.name);
  if (network.name === "hardhat") {
    await deployments.fixture();
  }
  const deployment = await deployments.getOrNull("CapTableFactory"); // Token is available because the fixture was executed
  if (!deployment) {
    throw Error("You need to run deployment for " + config.defaultNetwork);
  }
  const capTableFactory = (await ethers.getContractAt(
    "CapTableFactory",
    deployment.address
  )) as CapTableFactory;
  console.log("capTableFactory.address", deployment.address);
  const accounts = await ethers.getSigners();

  const randomNumber = Math.floor(Math.random() * 1000000000).toString();
  const uuid = ethers.utils.formatBytes32String(randomNumber);
  const companyName = "ISSUE Company " + randomNumber;
  const tx = await capTableFactory.createCapTable(
    uuid,
    companyName,
    "TEST",
    [accounts[0].address],
    [25000]
  );
  await tx.wait();
  const capTableAddress = await capTableFactory.getLastQuedAddress(uuid);
  console.log("capTableAddress", capTableAddress);
  const capTable = (await ethers.getContractAt(
    "ERC1400",
    capTableAddress
  )) as ERC1400;

  const mintTx = await capTable.issueByPartition(
    ethers.utils.formatBytes32String("ordinære"),
    accounts[0].address,
    5000,
    "0x11"
  );
  await mintTx.wait();

  // Transfer
  const randomWallet = ethers.Wallet.createRandom();
  const transferTx = await capTable.transferByPartition(
    ethers.utils.formatBytes32String("ordinære"),
    randomWallet.address,
    2000,
    "0x11"
  );
  await transferTx.wait();

  // Redeem
  const redeemTx = await capTable.redeemByPartition(
    ethers.utils.formatBytes32String("ordinære"),
    1500,
    "0x11"
  );
  await redeemTx.wait();

  const totalSupply = await capTable.totalSupply();
  console.log("Total suply is", totalSupply.toString());
  const balance = await capTable.balanceOf(accounts[0].address);
  console.log(
    "Balance of " + accounts[0].address + " is " + balance.toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

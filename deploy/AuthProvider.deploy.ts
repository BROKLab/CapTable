import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const signer = await getSigner(hre);
  let CONTROLLERS = [signer.address];
  console.log("CapTableRegistry Controllers => ", CONTROLLERS);

  const authProvider = await deploy("AuthProvider", {
    from: deployer,
    // gas: 4000000,
    args: [CONTROLLERS],
  });
  // const capTableFactoryDeploy = await deploy("RoleRegistry", {
  //   from: deployer,
  //   // gas: 4000000,
  //   args: [],
  // });
  console.log("AuthProvider deployed", authProvider.address);
};
export default func;

async function getSigner(hre: HardhatRuntimeEnvironment) {
  return (await hre.ethers.getSigners())[0];
}

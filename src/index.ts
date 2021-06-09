// import Deployments from "./deployments_chainid_7766.json";
import brokStage from "./deploymentsBrokStage.json";
import brokTest from "./deploymentsBrokTest.json";
export const Deployments = {
  brokStage,
  brokTest,
};
import CapTableRegistry from "./artifacts/contracts/capTable/CapTableRegistry.sol/CapTableRegistry.json";
import CapTableFactory from "./artifacts/contracts/capTable/CapTableFactory.sol/CapTableFactory.json";
import ERC1400 from "./artifacts/contracts/ERC1400.sol/ERC1400.json";
import AuthProvider from "./artifacts/contracts/authProvider/AuthProvider.sol/AuthProvider.json";
import ERC1400AuthValidator from "./artifacts/contracts/extensions/tokenExtensions/ERC1400AuthValidator.sol/ERC1400AuthValidator.json";

export const Artifacts = {
  CapTableRegistry,
  CapTableFactory,
  ERC1400,
  AuthProvider,
  ERC1400AuthValidator,
};
export * from "./typechain/index";

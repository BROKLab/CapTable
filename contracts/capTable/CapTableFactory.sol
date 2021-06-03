// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
import "./../ERC1400.sol";
import "./CapTableRegistry.sol";
import "./Controllable.sol";

contract CapTableFactory {
    CapTableRegistry internal _capTableRegistry;
    uint256 internal _defaultGranularity;
    address[] internal _defaultControllers;
    bytes32[] internal _defaultPartitions;

    constructor(address capTableRegistryAddress) public {
        _defaultGranularity = 1;
        _defaultControllers.push(0xbbb7a6CC5b0757d60A457f2a1A667Aa53A13F515);
        _defaultPartitions.push(
            0x6f7264696ec3a672650000000000000000000000000000000000000000000000
        ); // ordinære
        _defaultControllers.push(address(0));
        _capTableRegistry = CapTableRegistry(capTableRegistryAddress);
    }

    function getCapTableRegistryAddress()
        public
        view
        returns (address capTableRegistryAddress)
    {
        return address(_capTableRegistry);
    }

    // REVIEW : Only a helper function to retreive last qued address for an UUID. Somone can easily overwrite this, so its not safe. Can lead to confusion it result is not properly checked.
    function getLastQuedAddress(bytes32 uuid)
        external
        view
        returns (address quedCapTableRegistryAddress)
    {
        return _capTableRegistry.getLastQuedAddress(uuid);
    }

    function createCapTable(
        bytes32 uuid,
        string calldata name,
        string calldata symbol
    ) external {
        _defaultControllers[1] = msg.sender; // REVIEW IS THIS SAFE?
        bytes32[] memory defaultPartitions = _defaultPartitions;
        ERC1400 capTable =
            new ERC1400(
                name,
                symbol,
                _defaultGranularity,
                _defaultControllers,
                defaultPartitions
            );
        capTable.addMinter(msg.sender);
        capTable.removeMinter(address(this));
        capTable.transferOwnership(msg.sender);
        _capTableRegistry.que(address(capTable), uuid);
    }
}

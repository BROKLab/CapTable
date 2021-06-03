// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./Controllable.sol";

contract CapTableRegistry is Controllable {
    address[] internal _capTables;
    mapping(address => uint256) internal _status; // 0:notUsed 1:qued 2:approved 3:declined 4:removed
    mapping(address => bytes32) internal _addressToUuid;
    mapping(bytes32 => address) internal _uuidToAddress;
    mapping(bytes32 => address) internal _uuidToQuedAddress;
    uint256 internal _activeCapTables;
    uint256 internal _quedCapTables;

    event capTableQued(address indexed capTableAddress, bytes32 indexed uuid);
    event capTableApproved(address indexed capTableAddress);
    event capTableRemoved(address indexed capTableAddress);
    event capTableDeclined(address indexed capTableAddress, bytes32 reason);

    constructor(address[] memory controllers)
        public
        Controllable(controllers)
    {}

    function que(address adr, bytes32 uuid) external {
        _queCapTable(adr, uuid);
    }

    function approve(address adr) external {
        _approveCapTable(adr);
    }

    function decline(address adr, bytes32 reason) external {
        _declineCapTable(adr, reason);
    }

    function remove(address adr) external {
        _removeCapTable(adr);
    }

    function getActiveCount() external view returns (uint256 activeCapTables) {
        return _activeCapTables;
    }

    function getQuedCount() external view returns (uint256 quedCapTables) {
        return _quedCapTables;
    }

    function getList() external view returns (address[] memory capTableList) {
        return _capTables;
    }

    function getUuid(address adr) external view returns (bytes32 uuid) {
        return _addressToUuid[adr];
    }

    function getStatus(address adr) external view returns (uint256 status) {
        return _status[adr];
    }

    function getAddress(bytes32 uuid)
        external
        view
        returns (address capTableAddress)
    {
        return _uuidToAddress[uuid];
    }

    // REVIEW : Only a helper function to retreive last qued address for an UUID. Somone can easily overwrite this, so its not safe. Can lead to confusion it result is not properly checked.
    function getLastQuedAddress(bytes32 uuid)
        external
        view
        returns (address capTableAddress)
    {
        return _uuidToQuedAddress[uuid];
    }

    function info(address adr)
        external
        view
        returns (bytes32 uuid, uint256 active)
    {
        return (_addressToUuid[adr], _status[adr]);
    }

    function _queCapTable(address adr, bytes32 uuid) internal {
        require(
            _status[adr] != 1,
            "Qued capTables must be declined before reQue"
        );
        require(_status[adr] != 2, "Cannot que active capTable");
        _capTables.push(adr);
        _status[adr] = 1;
        _addressToUuid[adr] = uuid;
        _uuidToQuedAddress[uuid] = adr;
        _quedCapTables++;
        emit capTableQued(adr, uuid);
    }

    function _approveCapTable(address adr) internal {
        require(_status[adr] == 1, "Only qued capTables can be approved");
        require(isController(msg.sender), "msg.sender is not controller");
        _status[adr] = 2;
        bytes32 uuid = _addressToUuid[adr];
        _uuidToAddress[uuid] = adr;
        _uuidToQuedAddress[uuid] = address(0);
        _quedCapTables--;
        _activeCapTables++;
        emit capTableApproved(adr);
    }

    function _declineCapTable(address adr, bytes32 reason) internal {
        require(_status[adr] == 1, "Only qued capTables can be declined");
        require(isController(msg.sender), "msg.sender is not controller");
        _status[adr] = 3;
        _quedCapTables--;
        bytes32 uuid = _addressToUuid[adr];
        _uuidToQuedAddress[uuid] = address(0);
        emit capTableDeclined(adr, reason);
    }

    function _removeCapTable(address adr) internal {
        require(_status[adr] == 2, "Only approved capTables can be removed");
        require(isController(msg.sender), "msg.sender is not controller");
        _status[adr] = 4;
        bytes32 uuid = _addressToUuid[adr];
        _uuidToAddress[uuid] = address(0);
        _activeCapTables--;
        emit capTableRemoved(adr);
    }
}

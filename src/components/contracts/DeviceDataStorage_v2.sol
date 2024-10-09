// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeviceDataStorage {

    struct Device {
        string data;
        address[] owners;
    }

    // Use uint as the deviceId
    mapping(uint => Device) private devices;
    uint256 public constant fee = 0.0001 ether; // 100000000000000 WEI

    // List to store all registered device IDs
    uint[] private deviceIds;

    event DeviceRegistered(uint indexed deviceId, address owner);
    event DataChecked(uint indexed deviceId, address indexed checker);
    event FeeSent(uint indexed deviceId, address indexed owner, uint256 amount);
    event OwnerAdded(uint indexed deviceId, address indexed newOwner);

    error NotEnoughEtherSent();
    error DeviceNotFound();
    error OnlyOwnerCanUpdate();

    // Register a new device with the sender as the first owner
       function registerDevice(uint deviceId, string memory data) external {
        require(bytes(devices[deviceId].data).length == 0, "Device already exists");

        // Declare and initialize an empty array to store owners
        address[] memory newOwners = new address[](1); // Array size 1 for first owner

        // Assign msg.sender as the first owner in the array
        newOwners[0] = msg.sender;

        // Register the device with the initialized owners array
        devices[deviceId] = Device({
            data: data,
            owners: newOwners
        });

        // Add the new deviceId to the list of device IDs
        deviceIds.push(deviceId);

        emit DeviceRegistered(deviceId, msg.sender);
    }

    // Add a new owner (only existing owners can add new owners)
    function addOwner(uint deviceId, address newOwner) external {
        Device storage device = devices[deviceId];

        if (!_isFirstOwner(deviceId, msg.sender)) {
            revert OnlyOwnerCanUpdate();
        }

        device.owners.push(newOwner);

        emit OwnerAdded(deviceId, newOwner);
    }

    // Update device data (only the first owner can update)
    function updateDeviceData(uint deviceId, string memory newData) external {
        if (!_isFirstOwner(deviceId, msg.sender)) {
            revert OnlyOwnerCanUpdate();
        }

        devices[deviceId].data = newData;
    }

    // Check device data and pay the owner
    function checkDeviceData(uint deviceId) external payable returns (string memory) {
    Device storage device = devices[deviceId];

    if (bytes(device.data).length == 0) {
        revert DeviceNotFound();
    }

    if (msg.value < fee) {
        revert NotEnoughEtherSent();
    }

    // Transfer fee to the first owner as an example (you could split this between all owners)
    payable(device.owners[0]).transfer(fee);
    emit FeeSent(deviceId, device.owners[0], fee);

    // Add the checker as a new owner
    device.owners.push(msg.sender);
    emit OwnerAdded(deviceId, msg.sender);

    // Emit event for checking data
    emit DataChecked(deviceId, msg.sender);

    return device.data;
}


    // Function to retrieve the device data (only the first owner can retrieve it without paying)
 function getDeviceData(uint deviceId) external view returns (string memory) {
    Device storage device = devices[deviceId];

    // Check if the caller is an owner of the device
    if (!_isOwner(deviceId, msg.sender)) {
        revert OnlyOwnerCanUpdate();
    }

    return device.data;
}

    // Function to check if an address is the first owner of the device
    function _isFirstOwner(uint deviceId, address addr) internal view returns (bool) {
        Device storage device = devices[deviceId];
        return device.owners.length > 0 && device.owners[0] == addr;
    }

    // Function to check if an address is an owner of the device
    function _isOwner(uint deviceId, address addr) internal view returns (bool) {
        Device storage device = devices[deviceId];

        for (uint i = 0; i < device.owners.length; i++) {
            if (device.owners[i] == addr) {
                return true;
            }
        }
        return false;
    }

    // Function to return all registered device IDs
    function getAllDeviceIds() external view returns (uint[] memory) {
        return deviceIds;
    }
}

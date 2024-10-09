// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeviceDataStorage {

    struct Device {
        string data;
        address owner;
    }

    // Use uint as the deviceId
    mapping(uint => Device) private devices;
    uint256 public constant fee = 0.0001 ether; //100000000000000 WEI

    // List to store all registered device IDs
    uint[] private deviceIds;

    event DeviceRegistered(uint indexed deviceId, address  owner);
    event DataChecked(uint indexed deviceId, address indexed checker);
    event FeeSent(uint indexed deviceId, address indexed owner, uint256 amount);

    error NotEnoughEtherSent();
    error DeviceNotFound();
    error OnlyOwnerCanUpdate();

    // Register a new device
    function registerDevice(uint deviceId, string memory data) external {
        require(bytes(devices[deviceId].data).length == 0, "Device already exists");

        devices[deviceId] = Device({
            data: data,
            owner: msg.sender
        });

        // Add the new deviceId to the list of device IDs
        deviceIds.push(deviceId);

        emit DeviceRegistered(deviceId, msg.sender);
    }

    // Update device data (only the owner can update)
    function updateDeviceData(uint deviceId, string memory newData) external {
        Device storage device = devices[deviceId];
        if (device.owner != msg.sender) {
            revert OnlyOwnerCanUpdate();
        }

        device.data = newData;
    }

    // Check device data and pay the owner
    function checkDeviceData(uint deviceId) external   payable returns (string memory) {
        Device storage device = devices[deviceId];

        if (bytes(device.data).length == 0) {
            revert DeviceNotFound();
        }

        if (msg.value < fee) {
            revert NotEnoughEtherSent();
        }

        // Transfer fee to the device owner
        payable(device.owner).transfer(fee);
        emit FeeSent(deviceId, device.owner, fee);

        // Emit event for checking data
        emit DataChecked(deviceId, msg.sender);

        return device.data;
    }

    // Function to retrieve the device data (for owner use only)
    function getDeviceData(uint deviceId) external view returns (string memory) {
        Device storage device = devices[deviceId];

        if (bytes(device.data).length == 0) {
            revert DeviceNotFound();
        }

        // Only the owner can retrieve the data using this function
        if (msg.sender != device.owner) {
            revert OnlyOwnerCanUpdate();
        }

        return device.data;
    }

    // Function to return all registered device IDs
    function getAllDeviceIds() external view returns (uint[] memory) {
        return deviceIds;
    }
}



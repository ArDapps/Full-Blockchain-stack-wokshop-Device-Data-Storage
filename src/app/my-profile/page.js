"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import contrcatAbis from "../../contants/abis.json";
import { SMART_CONTRACT_ADDRESS } from "@/contants/smart_contracts_address";
import { DeviceIdesComponent } from "@/components/device_ides_component";

const MyProfile = () => {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [devicesIds, setDevicesIds] = useState([]);

  useEffect(() => {
    connetWalletHandeler();
  }, []);

  useEffect(() => {
    if (signer) {
      fetchIdsWithSmartContrract();
    }
  }, [signer]);

  const connetWalletHandeler = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const loginUsers = await provider.send("eth_requestAccounts", []);

      setSigner(signer);
      setAccount(loginUsers[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIdsWithSmartContrract = async () => {
    try {
      if (signer) {
        const contract = new ethers.Contract(
          SMART_CONTRACT_ADDRESS,
          contrcatAbis,
          signer
        );
        const allDevicesIds = await contract.getDeviceIdsByOwner();
        setDevicesIds(allDevicesIds);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-500 flex flex-col items-center justify-center text-white">
      <header className="w-full text-center py-8 bg-gradient-to-r from-teal-400 via-blue-500 to-green-600 shadow-lg">
        <h1 className="text-4xl font-bold">Tecno Blocks Profile</h1>
        <p className="text-lg mt-2">
          Manage your devices and view your profile
        </p>
      </header>

      <div className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-lg shadow-xl w-3/4 max-w-4xl flex flex-col items-center">
          <h2 className="text-3xl font-semibold mb-6">Your Wallet & Devices</h2>

          {/* Wallet Section */}
          {account.length > 0 ? (
            <div className="flex flex-col items-center bg-gray-800 bg-opacity-60 p-6 rounded-lg mb-8 w-full">
              <p className="text-xl font-medium">
                Wallet: {account.substring(0, 6)}...
                {account.substring(account.length - 4)}
              </p>
              <p className="text-sm text-gray-300 mt-2">Connected Wallet</p>
            </div>
          ) : (
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all"
              onClick={connetWalletHandeler}
            >
              Connect Wallet
            </button>
          )}

          {/* Devices Section */}
          <div className="w-full mt-6">
            <h3 className="text-2xl font-semibold text-center mb-4">
              Your Devices
            </h3>
            {devicesIds.length > 0 ? (
              <div className="max-h-64 overflow-y-auto w-full p-4 bg-gray-700 bg-opacity-50 rounded-lg">
                <DeviceIdesComponent ids={devicesIds} />
              </div>
            ) : (
              <p className="text-center text-gray-300">
                No devices found. Connect your wallet to view your devices.
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="w-full py-4 bg-gray-900 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Tecno Blocks. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MyProfile;

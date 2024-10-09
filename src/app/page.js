"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import contrcatAbis from "../contants/abis.json"; // kept original spelling
import { SMART_CONTRACT_ADDRESS } from "@/contants/smart_contracts_address"; // kept original spelling
import { DeviceIdesComponent } from "@/components/device_ides_component"; // kept original spelling

export default function Home() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [devicesIds, setDevicesIds] = useState([]);

  useEffect(() => {
    connetWalletHandeler(); // kept original spelling
  }, []);

  useEffect(() => {
    fetchIdsWithSmartContrract(); // kept original spelling
  }, []);

  const connetWalletHandeler = async () => {
    // kept original spelling
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

  // Connect WIth Smart Contract
  const fetchIdsWithSmartContrract = async () => {
    // kept original spelling
    console.log("we are at contrcat"); // kept original spelling

    const rpc = "https://sepolia.infura.io/v3/2DAWGvVXOCNIC399kGfZ64Wwcpc";

    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      if (provider) {
        const contract = new ethers.Contract(
          SMART_CONTRACT_ADDRESS,
          contrcatAbis, // kept original spelling
          provider
        );

        const allDevicesIds = await contract.getAllDeviceIds();

        setDevicesIds(allDevicesIds);

        console.log(allDevicesIds, "smart contrcat"); // kept original spelling
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 transform transition-transform duration-500 hover:scale-105">
        {/* Hero Section */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Tecno Blocks Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome to Tecno Blocks, your one-stop solution for managing and
            monitoring all your IoT devices. Easily connect your wallet and view
            all your registered devices.
          </p>
          <p className="mt-2 text-gray-600">
            The market fee to view device data is{" "}
            <strong className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white px-4 py-1 rounded m-3">
              0.0001 ETH
            </strong>
            .
          </p>
        </header>

        {/* Wallet Section */}
        <section className="flex flex-col items-center mb-8">
          {account ? (
            <div className="flex flex-col items-center">
              {/* Display Account */}
              <span className="text-lg font-bold text-gray-800 bg-gray-100 p-3 rounded-lg">
                {account.substring(0, 6)}...
                {account.substring(account.length - 4)}
              </span>
              <p className="text-sm text-gray-500 mt-2">Connected Wallet</p>
            </div>
          ) : (
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
              onClick={connetWalletHandeler} // kept original spelling
            >
              Connect Wallet
            </button>
          )}
        </section>

        {/* Device IDs Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Registered Devices
          </h2>
          {devicesIds.length > 0 ? (
            <div className="max-h-400 overflow-y-scroll">
              <DeviceIdesComponent ids={devicesIds} />
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              No devices found. Please register a device.
            </p>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Tecno Blocks. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

"use client";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import contrcatAbis from "@/contants/abis.json";
import { SMART_CONTRACT_ADDRESS } from "@/contants/smart_contracts_address";

const SingleDevice = () => {
  const params = useParams();
  const { id } = params; // Device ID from URL
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [deviceData, setDeviceData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    connectWalletHandler();
  }, []);

  const connectWalletHandler = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const loginUsers = await provider.send("eth_requestAccounts", []);
      setSigner(signer);
      setAccount(loginUsers[0]);
    } catch (error) {
      console.error("Wallet connection error:", error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (signer) {
      fetchSingleDeviceForOwnerWithSmartContract();
      getDeviceEvents();
    }
  }, [id, signer]);

  const fetchSingleDeviceForOwnerWithSmartContract = async () => {
    try {
      const contract = new ethers.Contract(
        SMART_CONTRACT_ADDRESS,
        contrcatAbis,
        signer
      );

      const singleDevice = await contract.getDeviceData(id);
      setDeviceData(singleDevice);
      console.log("Single device data:", singleDevice);
    } catch (error) {
      console.error("Error fetching device data:", error);
      setErrorMessage("You Should Pay 0.001 ETh To View Data");
    }
  };

  const payAndViewHandeler = async () => {
    const contract = new ethers.Contract(
      SMART_CONTRACT_ADDRESS,
      contrcatAbis,
      signer
    );

    const fees = await contract.fee();
    const tx = await contract.checkDeviceData(id, {
      value: fees,
    });
    await tx.wait();
    console.log(tx, "");
  };

  const getDeviceEvents = async () => {
    try {
      const contract = new ethers.Contract(
        SMART_CONTRACT_ADDRESS,
        contrcatAbis,
        signer
      );
      const deviceCreatedFilter = contract.filters.DeviceRegistered(id);
      const eventData = await contract.queryFilter(deviceCreatedFilter);
      const allEvents = [...eventData].sort(
        (a, b) => a.blockNumber - b.blockNumber
      );
      setEventData(allEvents);
    } catch (error) {
      console.error("Error fetching device events:", error);
      setErrorMessage("Failed to fetch device events.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg p-8 max-w-3xl w-full text-center">
        {/* Error Message with Payment Handler */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span>{errorMessage}</span>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
              onClick={payAndViewHandeler}
            >
              Pay and View
            </button>
          </div>
        )}

        {/* Device Data Section */}
        <div className="bg-white bg-opacity-40 p-6 rounded-lg shadow-md mb-6 text-left">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Device Data</h1>
          <p className="text-lg text-gray-700">
            {deviceData || "No device data available."}
          </p>
        </div>

        {/* Events Table */}
        <div className="bg-white bg-opacity-40 p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            Device Registration Events
          </h2>
          {eventData.length > 0 ? (
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Block Number
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Serial Number
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Owner Account
                  </th>
                </tr>
              </thead>
              <tbody>
                {eventData.map((event, index) => (
                  <tr
                    key={index}
                    className="bg-gray-50 border-b border-gray-200"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {event.blockNumber}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {event.args.deviceId.toString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {event.args.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No events found for this device.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleDevice;

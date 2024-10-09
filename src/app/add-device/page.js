"use client";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import contrcatAbis from "@/contants/abis.json";
import { SMART_CONTRACT_ADDRESS } from "@/contants/smart_contracts_address";
import { useRouter } from "next/navigation";

const AddDevice = () => {
  const [serial, setSerial] = useState("");
  const [deviceData, setDeviceData] = useState("");
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    connetWalletHandeler();
  }, []);

  const connetWalletHandeler = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await provider.send("eth_requestAccounts", []);

      setSigner(signer);
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  const addDeviceWithSmartContrract = async () => {
    console.log("we are at contrcat");

    try {
      if (signer) {
        setLoading(true); // Show loading spinner

        const contract = new ethers.Contract(
          SMART_CONTRACT_ADDRESS,
          contrcatAbis,
          signer
        );

        const tx = await contract.registerDevice(serial, deviceData);

        await tx.wait();
        setLoading(false); // Hide loading spinner
        router.push("/");

        console.log(tx);
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Hide loading spinner in case of error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 via-blue-500 to-green-500 p-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full transform transition-transform duration-500 hover:scale-105 animate-slideInUp">
        <h2 className="text-center text-3xl font-bold text-teal-700 mb-8 animate-bounce">
          Add Your Device
        </h2>

        <div className="mb-6">
          <label
            htmlFor="serial-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Device Serial Number
          </label>
          <input
            type="number"
            id="serial-input"
            onChange={(e) => setSerial(e.target.value)}
            className="bg-teal-50 border border-teal-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
          />
        </div>

        {/* Textarea for Device Description */}
        <div className="mb-6">
          <label
            htmlFor="deviceData-textarea"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Device Description
          </label>
          <textarea
            id="deviceData-textarea"
            rows="5" // Set the number of visible rows
            onChange={(e) => setDeviceData(e.target.value)}
            className="bg-teal-50 border border-teal-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
            placeholder="Enter device details or description..."
          />
        </div>

        {/* Add Device Button with Loading Spinner */}
        <button
          type="button"
          className={`w-full py-2.5 text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm flex justify-center items-center ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={addDeviceWithSmartContrract}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            "Add Device"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddDevice;

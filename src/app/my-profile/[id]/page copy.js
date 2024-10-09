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
  const [events, setEvents] = useState([]);

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
      getDeviceEvents(); // Renamed to plural for clarity
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
      setErrorMessage("Could not fetch device data.");
    }
  };

  // Get Device registration events
  const getDeviceEvents = async () => {
    console.log("Fetching device events...");
    try {
      const contract = new ethers.Contract(
        SMART_CONTRACT_ADDRESS, // Your contract address
        contrcatAbis, // Your contract ABI
        signer
      );

      // Create filters for the relevant events
      const registeredFilter = contract.filters.DeviceRegistered(id);
      const registeredEvents = await contract.queryFilter(registeredFilter);

      const checkedFilter = contract.filters.DataChecked(id);
      const checkedEvents = await contract.queryFilter(checkedFilter);

      const feeSentFilter = contract.filters.FeeSent(id);
      const feeSentEvents = await contract.queryFilter(feeSentFilter);

      // Combine all events
      const allEvents = [
        ...registeredEvents,
        ...checkedEvents,
        ...feeSentEvents,
      ];

      // Sort events by block number
      allEvents.sort((a, b) => a.blockNumber - b.blockNumber);

      // Update state with fetched events
      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching device events:", error);
      setErrorMessage("Failed to fetch device events.");
    }
  };

  // Log events for debugging
  console.log(events);

  return (
    <div>
      {errorMessage && <div>{errorMessage}</div>}
      <div className="bg-green-50 p-4 m-3">
        <h1>{deviceData}</h1>
        <div>
          {events.map((event, index) => (
            <li key={index}>
              <strong>Event:</strong> {event.event} |
              <strong> Device ID:</strong> {event.args.deviceId.toString()} |
              <strong> Owner:</strong> {event.args.owner} |
              <strong> Block Number:</strong> {event.blockNumber}
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleDevice;

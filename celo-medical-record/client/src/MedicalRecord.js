import React, { useState, useEffect } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import MedicalRecordContract from "/home/lanacreates/celo-medical-record/client/src/build/contracts/MedicalRecord.json";
import Web3 from "web3";

const MedicalRecord = () => {
  const { address, network, kit, connect } = useContractKit();
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [records, setRecords] = useState([]);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [medicalData, setMedicalData] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize the smart contract instance
  useEffect(() => {
    if (kit) {
      const web3 = new Web3(kit.connection.web3.currentProvider);
      const instance = new web3.eth.Contract(
        MedicalRecordContract.abi,
        MedicalRecordContract.networks[network.chainId].address
      );
      setContract(instance);
    }
  }, [kit, network]);

  // Fetch records associated with the current address
  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      if (contract) {
        const totalSupply = await contract.methods.totalSupply().call();
        const recordPromises = [];
        for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
          if (await contract.methods.ownerOf(tokenId).call() === address) {
            recordPromises.push(contract.methods.viewRecord(tokenId).call());
          }
        }
        try {
          const fetchedRecords = await Promise.all(recordPromises);
          setRecords(fetchedRecords);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchRecords();
  }, [contract, address]);

  const handleConnect = async () => {
    try {
      await connect();
      setIsConnected(true);

      // Grant DOCTOR_ROLE to the connected address
      await contract.methods.grantDoctorRole(address).send({ from: address });
    } catch (error) {
      console.error('Error connecting to wallet:', error.message);
    }
  };

  const createNewRecord = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('Address:', address);
    console.log('Name:', name);
    console.log('Birthdate:', birthdate);
    console.log('Medical Data:', medicalData);

    try {
      const receipt = await contract.methods
        .createRecord(address, name, birthdate, medicalData)
        .send({ from: address });
      if (receipt.status) {
        const tokenId = receipt.events.RecordCreated.returnValues.tokenId;
        const newRecord = await contract.methods.viewRecord(tokenId).call();
        setRecords([...records, newRecord]);
        setName("");
        setBirthdate("");
        setMedicalData("");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExistingRecord = async (e) => {
    e.preventDefault();
    const tokenId = parseInt(selectedRecordId);
    setIsLoading(true);
    setError(null);
    try {
      await contract.methods.updateRecord(tokenId, medicalData).send({ from: address });
      const updatedRecords = records.map((record, index) =>
        index + 1 === tokenId ? { ...record, medicalData } : record
      );
      setRecords(updatedRecords);
      setMedicalData("");
      setSelectedRecordId(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const MedicalRecordList = ({ records, onSelect }) => {
    return (
      <ul>
        {records.map((record, index) => (
          <li key={index} onClick={() => onSelect(index + 1)}>
            {record.name} - {record.birthdate}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {!isConnected && (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
      {isConnected && (
        <>
          <h1>My Medical Records</h1>
          <form onSubmit={selectedRecordId ? updateExistingRecord : createNewRecord}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!!selectedRecordId}
                />
              </label>
            </div>
            <div>
              <label>
                Birthdate:
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  disabled={!!selectedRecordId}
                />
              </label>
            </div>
            <div>
              <label>
                Medical Data:
                <textarea
                  value={medicalData}
                  onChange={(e) => setMedicalData(e.target.value)}
                />
              </label>
            </div>
            {selectedRecordId ? (
              <div>
                <button type="submit">Update Record</button>
                <button type="button" onClick={() => setSelectedRecordId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button type="submit">Create Record</button>
            )}
          </form>
          <div>
            <h2>Your Medical Records</h2>
            <MedicalRecordList records={records} onSelect={setSelectedRecordId} />
          </div>
          {error && <p>Error: {error}</p>}
          {isLoading && <p>Loading...</p>}
        </>
      )}
    </div>
  );
};

export default MedicalRecord;

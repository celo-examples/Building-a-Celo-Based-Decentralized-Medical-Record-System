import React from "react";
import { ContractKitProvider } from "@celo-tools/use-contractkit";
import { Buffer } from 'buffer';
import MedicalRecord from "./MedicalRecord";
import "./App.css";

window.Buffer = Buffer; // This line should be placed after importing Buffer

function App() {
  return (
    <ContractKitProvider
    dapp={{
        name: "Celo Medical Record",
        icon: "/home/lanacreates/celo-medical-record/client/public/MEDICAL.png",
      }}
      network={{
        name: "Alfajores",
        chainId: 44787,
        rpcUrl: "https://alfajores-forno.celo-testnet.org",
      }}
    >
      <div className="App">
        <MedicalRecord />
      </div>
    </ContractKitProvider>
  );
}
export default App;

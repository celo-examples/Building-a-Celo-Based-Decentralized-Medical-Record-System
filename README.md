# Decentralized Medical Record System on Celo

This repository contains the source code for a decentralized medical record system built on the Celo blockchain. The application allows doctors to create, view, and update medical records for patients while ensuring data integrity and privacy.

The system utilizes smart contracts written in Solidity, a frontend built using React, and integration with the Celo network through the Celo SDK and Celo Extension Wallet.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Built With](#built-with)
- [Next Steps](#next-steps)

## Getting Started

These instructions will guide you through the process of setting up and running the decentralized medical record system on your local machine for development and testing purposes.

### Prerequisites

Before you proceed, ensure that you have the following software installed on your system:

- Node.js (v12.0.1 or later) - https://nodejs.org/
- Truffle - https://www.trufflesuite.com/
- Celo Extension Wallet - https://chrome.google.com/webstore/detail/celo-extension-wallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh
- A DataHub account for accessing the Celo network - https://datahub.figment.io/

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/decentralized-medical-record-celo.git
cd decentralized-medical-record-celo
```

2. Install the dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory of the project and add your Celo private key and DataHub RPC URL:

```bash
CELO_PRIVATE_KEY=<your-celo-private-key>
CELO_RPC_URL=<your-datahub-rpc-url>
```

### Running the Application

1. Compile and deploy the smart contracts

```bash
truffle compile
truffle migrate --network celo
```

2. Start the React development server

```bash
npm start
```

3. Open a browser and navigate to `http://localhost:3000`. Make sure you have the Celo Extension Wallet installed and configured with a Celo account.

4. Interact with the application to create, view, and update medical records.

## Built With

- [Celo](https://celo.org/) - The blockchain platform
- [Solidity](https://soliditylang.org/) - The smart contract programming language
- [React](https://reactjs.org/) - The frontend library
- [Truffle](https://www.trufflesuite.com/) - The development and testing framework
- [OpenZeppelin](https://openzeppelin.com/contracts/) - The library for reusable smart contract components

## Next Steps

Refer to the [Next Steps](#next-steps) section in the tutorial for ideas on how to expand and improve the application.

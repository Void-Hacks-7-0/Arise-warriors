const Web3 = require('web3');
const path = require('path');
const fs = require('fs');

// Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');

// Load Contract ABI
const contractPath = path.resolve(__dirname, '../../blockchain/build/contracts/SecureFinLedger.json');
let contractABI;
let contractAddress;
let contract;

const initBlockchain = async () => {
    try {
        if (fs.existsSync(contractPath)) {
            const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = contractJSON.networks[networkId];

            if (deployedNetwork) {
                contractABI = contractJSON.abi;
                contractAddress = deployedNetwork.address;
                contract = new web3.eth.Contract(contractABI, contractAddress);
                console.log(`✅ Connected to Smart Contract at ${contractAddress}`);
            } else {
                console.error('❌ Smart contract not deployed to detected network.');
            }
        } else {
            console.error('❌ Contract build file not found. Run truffle migrate first.');
        }
    } catch (error) {
        console.error('❌ Blockchain connection error:', error);
    }
};

// Initialize connection
initBlockchain();

async function pushHashToBlockchain(transactionId, blockchainHash) {
    if (!contract) {
        throw new Error('Smart contract not connected');
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const sender = accounts[0]; // Use the first account from Ganache

        const receipt = await contract.methods
            .storeTransactionHash(transactionId, blockchainHash)
            .send({ from: sender, gas: 3000000 });

        return {
            success: true,
            txHash: receipt.transactionHash,
            blockNumber: Number(receipt.blockNumber) // Convert BigInt to Number
        };
    } catch (error) {
        console.error('Blockchain Transaction Error:', error);
        throw error;
    }
}

module.exports = { pushHashToBlockchain };

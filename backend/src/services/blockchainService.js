const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

const rpc = process.env.BLOCKCHAIN_RPC || "http://127.0.0.1:7545";
const web3 = new Web3(rpc);

// load ABI + addresses (example path)
const ledgerJson = require("../../securefin-blockchain/build/contracts/TransactionLedger.json");
const oracleJson = require("../../securefin-blockchain/build/contracts/FraudDetectionOracle.json");
// or load from backend/config/contracts.json if you created it

const ledgerAddress = ledgerJson.networks ? Object.values(ledgerJson.networks)[0].address : process.env.LEDGER_ADDRESS;
const oracleAddress = oracleJson.networks ? Object.values(oracleJson.networks)[0].address : process.env.ORACLE_ADDRESS;

const ledger = new web3.eth.Contract(ledgerJson.abi, ledgerAddress);
const oracle = new web3.eth.Contract(oracleJson.abi, oracleAddress);

const fromAccount = process.env.BLOCKCHAIN_ACCOUNT || (async()=>{let a=await web3.eth.getAccounts(); return a[0];})();

async function recordTransaction(txIdHex, userAddress, amountInWei, category) {
  const accounts = await web3.eth.getAccounts();
  const from = process.env.BLOCKCHAIN_ACCOUNT || accounts[0];

  const receipt = await ledger.methods.recordTransaction(txIdHex, userAddress, amountInWei, category)
    .send({ from, gas: 300000 });
  return receipt; // includes transactionHash, events, status
}

async function reportAnomaly(txIdHex, userAddress, reason) {
  const accounts = await web3.eth.getAccounts();
  const from = process.env.BLOCKCHAIN_ACCOUNT || accounts[0];

  const receipt = await oracle.methods.reportAnomaly(txIdHex, userAddress, reason)
    .send({ from, gas: 200000 });
  return receipt;
}

module.exports = { recordTransaction, reportAnomaly };

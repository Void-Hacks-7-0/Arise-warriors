const TransactionLedger = artifacts.require("TransactionLedger");
const FraudDetectionOracle = artifacts.require("FraudDetectionOracle");

module.exports = async function(deployer) {
  await deployer.deploy(TransactionLedger);
  const ledger = await TransactionLedger.deployed();
  await deployer.deploy(FraudDetectionOracle);
  const oracle = await FraudDetectionOracle.deployed();

  // Optional: print addresses
  console.log("TransactionLedger deployed at:", ledger.address);
  console.log("FraudDetectionOracle deployed at:", oracle.address);
};

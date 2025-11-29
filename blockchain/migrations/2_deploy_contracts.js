const SecureFinLedger = artifacts.require("SecureFinLedger");

module.exports = function (deployer) {
  deployer.deploy(SecureFinLedger);
};

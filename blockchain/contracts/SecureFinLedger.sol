// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureFinLedger {
    struct TransactionRecord {
        string transactionId;
        string blockchainHash;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => TransactionRecord) public transactions;

    event TransactionRecorded(string indexed transactionId, string blockchainHash, uint256 timestamp);

    function storeTransactionHash(string memory _transactionId, string memory _blockchainHash) public {
        require(!transactions[_transactionId].exists, "Transaction already recorded");

        transactions[_transactionId] = TransactionRecord({
            transactionId: _transactionId,
            blockchainHash: _blockchainHash,
            timestamp: block.timestamp,
            exists: true
        });

        emit TransactionRecorded(_transactionId, _blockchainHash, block.timestamp);
    }

    function getTransaction(string memory _transactionId) public view returns (string memory, string memory, uint256) {
        require(transactions[_transactionId].exists, "Transaction not found");
        TransactionRecord memory record = transactions[_transactionId];
        return (record.transactionId, record.blockchainHash, record.timestamp);
    }
}

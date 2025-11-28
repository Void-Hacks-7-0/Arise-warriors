// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionLedger {
    event TransactionRecorded(bytes32 indexed txId, address indexed user, uint256 amount, string category, uint256 timestamp);

    struct TxMeta { address user; uint256 amount; string category; uint256 timestamp; }

    mapping(bytes32 => TxMeta) public transactions;

    function recordTransaction(bytes32 txId, address user, uint256 amount, string calldata category) external returns (bool) {
        require(transactions[txId].user == address(0), "tx exists");
        transactions[txId] = TxMeta({ user: user, amount: amount, category: category, timestamp: block.timestamp });
        emit TransactionRecorded(txId, user, amount, category, block.timestamp);
        return true;
    }

    function getTransaction(bytes32 txId) external view returns (address, uint256, string memory, uint256) {
        TxMeta storage m = transactions[txId];
        return (m.user, m.amount, m.category, m.timestamp);
    }
}

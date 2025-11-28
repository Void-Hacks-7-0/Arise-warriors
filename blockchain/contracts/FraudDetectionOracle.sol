// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FraudDetectionOracle {
    event AnomalyReported(bytes32 indexed txId, address indexed user, string reason, uint256 timestamp);

    function reportAnomaly(bytes32 txId, address user, string calldata reason) external {
        emit AnomalyReported(txId, user, reason, block.timestamp);
    }
}

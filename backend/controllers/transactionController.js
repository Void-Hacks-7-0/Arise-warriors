const Transaction = require('../models/Transaction');
const { pushHashToBlockchain } = require('../blockchain/connect');
const crypto = require('crypto');

exports.verifyTransaction = async (req, res) => {
    const { transactionId } = req.body;

    if (!transactionId) {
        return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    try {
        // 1. Find or Create Transaction in MongoDB
        // For the demo, since we use mock data in frontend, we might receive IDs that don't exist in DB.
        // We will upsert to ensure it exists.

        let transaction = await Transaction.findOne({ transactionId });

        if (!transaction) {
            // Create a dummy transaction record if it doesn't exist (for demo purposes)
            transaction = new Transaction({
                transactionId,
                amount: Math.floor(Math.random() * 10000),
                type: Math.random() > 0.5 ? 'income' : 'expense',
                description: 'Demo Transaction',
                category: 'General'
            });
            await transaction.save();
        }

        // 2. Check if already verified
        if (transaction.txHash) {
            return res.json({
                success: true,
                message: 'Already verified',
                txHash: transaction.txHash,
                blockNumber: transaction.blockNumber,
                blockchainHash: transaction.blockchainHash
            });
        }

        // 3. Generate pseudo blockchain hash if missing
        const blockchainHash = crypto.createHash('sha256').update(transactionId + Date.now()).digest('hex');

        // 4. Call pushHashToBlockchain()
        const result = await pushHashToBlockchain(transactionId, blockchainHash);

        // 5. Save details to MongoDB
        transaction.blockchainHash = blockchainHash;
        transaction.txHash = result.txHash;
        transaction.blockNumber = result.blockNumber;
        transaction.verifiedAt = new Date();

        await transaction.save();

        // 6. Return result
        res.json({
            success: true,
            txHash: result.txHash,
            blockNumber: result.blockNumber,
            blockchainHash: blockchainHash
        });

    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

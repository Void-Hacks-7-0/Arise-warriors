const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    description: String,
    category: String,
    date: {
        type: Date,
        default: Date.now
    },
    blockchainHash: String,
    txHash: String,
    blockNumber: Number,
    verifiedAt: Date
});

module.exports = mongoose.model('Transaction', TransactionSchema);

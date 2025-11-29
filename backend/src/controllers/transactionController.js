const Transaction = require("../models/Transaction");
const { v4: uuidv4 } = require("uuid");

exports.createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.userId; // from JWT middleware
    const {
      type,
      category,
      amount,
      currency,
      description,
      paymentMethod,
      sourceAccount,
      destinationAccount,
      tags,
      notes,
      attachments
    } = req.body;

    // Generate transactionId
    const transactionId = `TXN_${Date.now()}_${uuidv4().slice(0, 6)}`;

    const tx = await Transaction.create({
      transactionId,
      userId,
      type,
      category,
      amount,
      currency,
      description,
      paymentMethod,
      sourceAccount,
      destinationAccount,
      tags,
      notes,
      attachments,

      // Placeholder until blockchain integration
      blockchainHash: "",
      blockchainConfirmed: false,

      metadata: {
        location: req.headers["x-location"] || "Unknown",
        deviceId: req.headers["x-device-id"] || "Unknown",
        ipAddress: req.ip
      }
    });

    res.json({
      success: true,
      message: "Transaction created successfully",
      data: tx
    });

  } catch (err) {
    next(err);
  }
};

exports.getUserTransactions = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const list = await Transaction.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: list.length,
      data: list
    });

  } catch (err) {
    next(err);
  }
};

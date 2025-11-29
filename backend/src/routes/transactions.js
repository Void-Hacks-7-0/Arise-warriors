const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createTransaction, getUserTransactions } = require("../controllers/transactionController");

router.post("/", authMiddleware, createTransaction);      // Create transaction
router.get("/", authMiddleware, getUserTransactions);     // List user transactions

module.exports = router;


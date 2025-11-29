const express = require('express');
const router = express.Router();
const { verifyTransaction } = require('../controllers/transactionController');

router.post('/verify', verifyTransaction);

module.exports = router;

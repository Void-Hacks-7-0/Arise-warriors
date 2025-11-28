const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/authValidator");
const { validationResult } = require("express-validator");

// Register
router.post("/register", registerValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  authController.register(req, res, next);
});

// Login
router.post("/login", loginValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  authController.login(req, res, next);
});

module.exports = router;

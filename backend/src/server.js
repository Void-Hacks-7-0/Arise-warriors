require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");

// Routes
const authRoutes = require("./routes/auth");

const app = express();

// ---------------------
// Middlewares
// ---------------------
app.use(helmet());                                     // Security headers
app.use(cors());                                       // CORS
app.use(express.json());                               // JSON parser
app.use(morgan("combined", { stream: logger.stream })); // Logging

// ---------------------
// Connect MongoDB
// ---------------------
connectDB();

// ---------------------
// API Routes
// ---------------------
app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SecureFin Backend Running...",
        time: new Date().toISOString()
    });
});

// ---------------------
// Error Handler (must be last)
// ---------------------
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));

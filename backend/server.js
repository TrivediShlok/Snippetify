const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const snippetRoutes = require("./routes/snippets");
const userRoutes = require("./routes/users");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/snippetify").then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/collections", require("./routes/collectionRoutes"));
app.use("/api/shared", require("./routes/sharedRoutes"));



// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Snippetify Backend is running!",
        timestamp: new Date().toISOString(),
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle 404 routes - FIXED VERSION
app.use("/*path", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

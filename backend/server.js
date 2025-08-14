const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const app = express();

// Debug environment variables
console.log("Environment variables loaded:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
console.log("PORT:", process.env.PORT || "NOT SET");

// CORS Configuration
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ✅ FIXED: Enhanced MongoDB Connection Function (No Deprecated Options)
const connectDB = async () => {
    try {
        // Check if MONGO_URI is defined
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI environment variable is not defined. Please check your .env file."
            );
        }

        console.log("Attempting to connect to MongoDB...");
        console.log(
            "Connection string:",
            process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
        );

        // ✅ FIXED: Removed deprecated options - they're not needed in MongoDB Driver 4.0+
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `✅ MongoDB Connected Successfully: ${conn.connection.host}`
        );
        console.log(`Database Name: ${conn.connection.name}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);

        // Provide helpful error messages
        if (error.message.includes("ENOTFOUND")) {
            console.error(
                "💡 Network Error: Check your internet connection and MongoDB server status."
            );
        } else if (error.message.includes("ECONNREFUSED")) {
            console.error(
                "💡 Connection Refused: MongoDB server is not running. Please start MongoDB service."
            );
            console.error(
                '💡 Windows: Run "net start MongoDB" as administrator'
            );
            console.error(
                '💡 Or start manually: mongod --dbpath "C:\\data\\db"'
            );
        } else if (error.message.includes("Authentication failed")) {
            console.error(
                "💡 Authentication Error: Check your username and password in the connection string."
            );
        } else if (error.message.includes("undefined")) {
            console.error(
                "💡 Configuration Error: Make sure MONGO_URI is set in your .env file."
            );
        }

        process.exit(1);
    }
};

// Connect to Database
connectDB();

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        mongodb:
            mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        environment: process.env.NODE_ENV || "development",
    });
});

// API Routes
try {
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/users", require("./routes/users"));
    app.use("/api/snippets", require("./routes/snippets"));

    app.use("/api/collections", require("./routes/collectionRoutes"));
} catch (error) {
    console.error("Route loading error:", error.message);
}

// Express 5 compatible catch-all route
app.use("/*splat", (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({
        success: false,
        message: "Server Error",
        error:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Internal server error",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${
            process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
    );
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

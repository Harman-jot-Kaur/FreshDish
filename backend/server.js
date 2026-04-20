// Health check route for /api
app.get("/api", (req, res) => {
  res.send("API is running");
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const suggestionsRoutes = require("./routes/suggestions");
const combosRoutes = require("./routes/combos");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const app = express();
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
// Rate limiting removed for development/testing convenience
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "FreshDish API is running" });
});

app.get("/api/status", (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    message: "MongoDB connection status",
    readyState: state,
    state: states[state] || "unknown",
    host: mongoose.connection.host || null,
    port: mongoose.connection.port || null,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/combos", combosRoutes);

app.use(errorHandler);

// Global error handlers to prevent server from crashing
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally: process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally: process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

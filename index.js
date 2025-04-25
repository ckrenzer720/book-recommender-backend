require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const knex = require("knex");
const knexConfig = require("./knexfile");
const { defaultLimiter } = require("./middleware/rateLimiter");
const { validate } = require("./middleware/validators");

// Import routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize database connection
const db = knex(knexConfig[process.env.NODE_ENV || "development"]);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(defaultLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

module.exports = app;

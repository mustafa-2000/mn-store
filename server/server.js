
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const app = express();
const PORT = process.env.PORT || 5000;

// Check database configuration
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Check server/.env");
  process.exit(1);
}

// Connect to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");
const reviewsRouter = require("./routes/reviews");

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewsRouter);

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test route works!",
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the MN Store API!",
    status: "running",
  });
});

// Database health check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database() AS database"
    );

    res.json({
      success: true,
      message: "MN Store backend and database are connected!",
      database: result.rows[0].database,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

// Handle unexpected database connection errors
pool.on("error", (error) => {
  console.error("Unexpected database pool error:", error.message);
});

// Start the server locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`MN Store API running at http://localhost:${PORT}`);
  });
}

// Export Express app for Netlify
module.exports = app;
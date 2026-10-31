const express = require("express");
const router = express.Router();
const pool = require("../db");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Create a new order
router.post("/", protect, async (req, res) => {
  try {
    const { id, customer, items, subtotal, createdAt } = req.body;

    if (!id || !customer || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order information is incomplete.",
      });
    }

    if (!Number.isFinite(Number(subtotal)) || Number(subtotal) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order total.",
      });
    }

    const result = await pool.query(
      `INSERT INTO orders
       (order_id, customer, items, subtotal, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        id,
        JSON.stringify(customer),
        JSON.stringify(items),
        Number(subtotal),
        "Placed",
        createdAt || new Date().toISOString(),
      ],
    );

    res.status(201).json({
      success: true,
      message: "Order saved successfully.",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save order.",
    });
  }
});

// Get all orders (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC",
    );

    res.json({
      success: true,
      count: result.rows.length,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
});

// Update order status (admin only)
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE order_id = $2
       RETURNING *`,
      [status, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully.",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
});

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Orders route is connected!",
  });
});

module.exports = router;
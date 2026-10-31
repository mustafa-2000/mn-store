const express = require("express");
const pool = require("../db");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Submit or update a product review
router.post("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!/^\d+$/.test(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write a review.",
      });
    }

    const result = await pool.query(
      `INSERT INTO product_reviews
        (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id, user_id)
       DO UPDATE SET
         rating = EXCLUDED.rating,
         comment = EXCLUDED.comment
       RETURNING *`,
      [productId, userId, rating, comment.trim()]
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Submit review error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
});

// Get all reviews for a product
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!/^\d+$/.test(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const result = await pool.query(
      `SELECT
         r.id,
         r.product_id,
         r.user_id,
         r.rating,
         r.comment,
         r.created_at,
         u.name AS customer_name
       FROM product_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      reviews: result.rows,
    });
  } catch (error) {
    console.error("Fetch reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product reviews.",
    });
  }
});

module.exports = router;
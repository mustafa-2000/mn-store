
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
     "SELECT id, name, description, price, category, image_url, stock, old_price, rating, reviews, badge, sizes, colors, created_at FROM products ORDER BY id ASC"
    );

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve products.",
    });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const result = await pool.query(
      `SELECT id, name, description, price, category, image_url,
              stock, old_price, rating, reviews, badge, sizes,
              colors, created_at
       FROM products
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to fetch product:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve product.",
    });
  }
});

// Admin: Create a new product
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image_url,
      stock,
      old_price,
      rating,
      reviews,
      badge,
      sizes,
      colors,
    } = req.body;

    if (!name || price === undefined || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product name and price are required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
       (name, description, price, category, image_url, stock,
        old_price, rating, reviews, badge, sizes, colors)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        name.trim(),
        description || "",
        Number(price),
        category || null,
        image_url || null,
        Number(stock) || 0,
        old_price ?? null,
        Number(rating) || 0,
        Number(reviews) || 0,
        badge || null,
        sizes || [],
        colors || [],
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
});

// Admin: Update an existing product
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const {
      name,
      description,
      price,
      category,
      image_url,
      stock,
      old_price,
      rating,
      reviews,
      badge,
      sizes,
      colors,
    } = req.body;

    if (!name || price === undefined || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product name and price are required.",
      });
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           category = $4,
           image_url = $5,
           stock = $6,
           old_price = $7,
           rating = $8,
           reviews = $9,
           badge = $10,
           sizes = $11,
           colors = $12
       WHERE id = $13
       RETURNING *`,
      [
        name.trim(),
        description || "",
        Number(price),
        category || null,
        image_url || null,
        Number(stock) || 0,
        old_price ?? null,
        Number(rating) || 0,
        Number(reviews) || 0,
        badge || null,
        sizes || [],
        colors || [],
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully.",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
});

// Admin: Delete a product
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully.",
      productId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete product error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
});
module.exports = router;

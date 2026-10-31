import { useState, useEffect } from "react";
import { submitReview, getProductReviews } from "../../services/api";


function ProductDetails({ product, onAddToCart, onBack, onAddedToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [reviews, setReviews] = useState([]);
const [reviewRating, setReviewRating] = useState(5);
const [reviewComment, setReviewComment] = useState("");
const [reviewLoading, setReviewLoading] = useState(false);
const [reviewMessage, setReviewMessage] = useState("");
const [reviewError, setReviewError] = useState("");

useEffect(() => {
  if (!product?.id) return;

  const loadReviews = async () => {
    try {
      const data = await getProductReviews(product.id);
      setReviews(data);
    } catch (error) {
      console.error("Unable to load reviews:", error);
    }
  };

  loadReviews();
}, [product?.id]);

const handleSubmitReview = async (event) => {
  event.preventDefault();

  setReviewLoading(true);
  setReviewMessage("");
  setReviewError("");

  try {
    await submitReview(
      product.id,
      reviewRating,
      reviewComment
    );

    const updatedReviews = await getProductReviews(product.id);
    setReviews(updatedReviews);
    setReviewComment("");
    setReviewRating(5);
    setReviewMessage("Your review was submitted successfully!");
  } catch (error) {
    setReviewError(error.message);
  } finally {
    setReviewLoading(false);
  }
};

  if (!product) {
    return (
      <section className="mn-product-details">
        <h2>Product not found</h2>
        <button type="button" onClick={onBack}>
          Back to shopping
        </button>
      </section>
    );
  }

  return (
    <section className="mn-product-details">
      <button type="button" className="mn-details-back" onClick={onBack}>
        ← Back to shopping
      </button>

      <div className="mn-details-layout">
        <div className="mn-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="mn-details-info">
          <span className="mn-details-category">{product.category}</span>

          <h1>{product.name}</h1>

          <p className="mn-details-price">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="mn-details-description">
            Discover quality, style, and everyday convenience with this
            selection from MN Store.
          </p>

          {product.sizes?.length > 0 && (
            <div className="mn-product-option">
              <label className="mn-option-label">Select Size</label>
              <div className="mn-size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`mn-size-box ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mn-product-option">
              <label className="mn-option-label">
                Select Color{selectedColor ? `: ${selectedColor}` : ""}
              </label>
              <div className="mn-color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`mn-color-box ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    style={{
                      backgroundColor:
                        {
                          White: "#FFFFFF",
                          Black: "#171717",
                          Red: "#E53935",
                          Blue: "#2563EB",
                          Gray: "#808080",
                          Cream: "#F3E9D2",
                          Brown: "#795548",
                        }[color.trim()] || "#CCCCCC",
                    }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    aria-pressed={selectedColor === color}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="mn-details-quantity">
            <span>Quantity</span>

            <div className="mn-quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => current - 1)}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((current) => current + 1)}
              >
                +
              </button>
            </div>
          </div>

        
<button
  type="button"
  className="mn-add-to-cart"
  onClick={() => {
    if (product.sizes?.length > 0 && !selectedSize) {
      window.alert("Please select a size.");
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      window.alert("Please select a color.");
      return;
    }

    const productToAdd = {
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    };

    console.log("DETAILS BUTTON:", productToAdd);
    onAddToCart(productToAdd);

    if (onAddedToCart) {
      onAddedToCart(productToAdd);
    }
  }}
>
  Add {quantity} to cart ↗
</button>

        </div>
           </div>

      {/* PRODUCT REVIEWS */}
      <div className="mn-product-reviews">
        <h2>Customer Reviews</h2>

        <form onSubmit={handleSubmitReview}>
          <label htmlFor="review-rating">Your Rating</label>

          <select
            id="review-rating"
            value={reviewRating}
            onChange={(event) =>
              setReviewRating(Number(event.target.value))
            }
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>

          <label htmlFor="review-comment">Your Review</label>

          <textarea
            id="review-comment"
            value={reviewComment}
            onChange={(event) =>
              setReviewComment(event.target.value)
            }
            placeholder="Share your experience with this product..."
            required
            minLength={2}
          />

          <button type="submit" disabled={reviewLoading}>
            {reviewLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {reviewMessage && <p>{reviewMessage}</p>}
        {reviewError && <p>{reviewError}</p>}

        <div className="mn-review-list">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="mn-review-item">
                <h3>{review.customer_name}</h3>
                <p>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                <p>{review.comment}</p>
                <small>
                  {new Date(review.created_at).toLocaleDateString()}
                </small>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;

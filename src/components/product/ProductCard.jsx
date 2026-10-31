
function ProductCard({
  product,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  onViewProduct,
}) {
  return (
    <article className="mn-product-card">
      <div className="mn-product-image-wrap">
        <button
          type="button"
          className="mn-product-view"
          onClick={() => onViewProduct?.(product)}
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="mn-product-image"
            loading="lazy"
          />
        </button>

        {product.badge && (
          <span
            className={`mn-product-badge ${
              product.badge === "SALE" ? "sale" : ""
            }`}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          className={`mn-wishlist-btn ${
            isWishlisted ? "is-wishlisted" : ""
          }`}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          onClick={() => onToggleWishlist?.(product)}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

        <button
          type="button"
          className="mn-quick-add"
          title="Quick add to cart"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAddToCart(product)}
        >
          +
        </button>
      </div>

      <div className="mn-product-details">
        <span className="mn-product-category">
          {product.category}
        </span>

        <h3>
          <button
            type="button"
            className="mn-product-name-link"
            onClick={() => onViewProduct?.(product)}
          >
            {product.name}
          </button>
        </h3>

        <div className="mn-product-rating">
          <span className="mn-star">★</span>
          <strong>{product.rating.toFixed(1)}</strong>
          <span className="mn-review-count">
            ({product.reviews} reviews)
          </span>
        </div>

        <div className="mn-product-price">
          <span>${product.price.toFixed(2)}</span>

          {product.oldPrice && (
            <del>${product.oldPrice.toFixed(2)}</del>
          )}
        </div>

        <button
          type="button"
          className="mn-add-to-cart"
          onClick={() => onAddToCart(product)}
        >
          Add to cart <span>↗</span>
        </button>
      </div>
    </article>
  );
}

export default ProductCard;

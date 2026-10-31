
import ProductGrid from "./product/ProductGrid";

function WishlistSection({
  wishlist,
  products,
  onAddToCart,
  onToggleWishlist,
}) {
  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <section className="mn-wishlist-section" id="wishlist">
      <div className="mn-wishlist-heading">
        <span className="mn-products-eyebrow">YOUR PERSONAL COLLECTION</span>
        <h2>My <span>Wishlist.</span></h2>
        <p>
          Keep the things you love in one place.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="mn-wishlist-empty">
          <div className="mn-wishlist-empty-icon">♡</div>
          <h3>Your wishlist is waiting</h3>
          <p>
            Explore our collection and tap the heart on products
            you would love to save.
          </p>
          <a href="#products" className="mn-wishlist-shop-btn">
            Explore products →
          </a>
        </div>
      ) : (
        <>
          <div className="mn-wishlist-toolbar">
            <p>
              You have <strong>{savedProducts.length}</strong>{" "}
              saved {savedProducts.length === 1 ? "product" : "products"}.
            </p>
          </div>

          <ProductGrid
            products={savedProducts}
            onAddToCart={onAddToCart}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
          />
        </>
      )}
    </section>
  );
}

export default WishlistSection;

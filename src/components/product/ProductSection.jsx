import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";

const PRODUCTS_PER_PAGE = 12;

function ProductSection({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  sortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  setSortBy,
  visibleProducts,
  addToCart,
  wishlist,
  toggleWishlist,
  onViewProduct,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, sortBy]);

  const totalPages = Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE);

  // Keep the current page valid if the product count changes.
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = visibleProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE,
  );

  function goToPage(page) {
    setCurrentPage(Math.max(1, Math.min(page, Math.max(totalPages, 1))));
  }

  return (
    <section className="mn-products" id="products">
      <div className="mn-products-heading">
        <div>
          <span className="mn-products-eyebrow">THE EVERYDAY EDIT</span>

          <h2>
            Good finds.
            <br />
            <span>Great feeling.</span>
          </h2>
        </div>

        <p>
          Thoughtful picks, timeless essentials, and everyday favorites—all in
          one place.
        </p>
      </div>

      <div className="mn-search" id="search">
        <span aria-hidden="true">⌕</span>

        <input
          id="product-search"
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search products"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mn-price-filters">
        <label>
          Min price
          <input
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
        </label>

        <label>
          Max price
          <input
            type="number"
            min="0"
            placeholder="No limit"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </label>

        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setActiveFilter("All");
            setSortBy("featured");
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Clear filters
        </button>
      </div>

      <div className="mn-products-toolbar">
        <div className="mn-product-filters">
          {[
            "All",
            "Fashion",
            "Technology",
            "Accessories",
            "Lifestyle",
            "Wishlist",
          ].map((category) => (
            <button
              key={category}
              type="button"
              className={`mn-filter-btn ${
                activeFilter === category ? "active" : ""
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="mn-sort-control">
          <span>Sort by</span>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
            <option value="name-az">Name: A–Z</option>
          </select>
        </label>
      </div>

      {visibleProducts.length === 0 ? (
        <p className="mn-no-products">No products found in this category.</p>
      ) : (
        <>
          <p style={{ padding: "10px", background: "#fff3cd" }}></p>
          <ProductGrid
            products={currentProducts}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onViewProduct={onViewProduct}
          />

          {totalPages > 1 && (
            <nav className="mn-pagination" aria-label="Product pages">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)}
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={safePage === page ? "active" : ""}
                    aria-current={safePage === page ? "page" : undefined}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => goToPage(safePage + 1)}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}

      <div className="mn-products-footer">
        <span>
          SHOWING {visibleProducts.length === 0 ? 0 : startIndex + 1}
          {"–"}
          {Math.min(
            startIndex + PRODUCTS_PER_PAGE,
            visibleProducts.length,
          )} OF {visibleProducts.length} PRODUCTS
        </span>

        <span>SELECTED WITH CARE · MN STORE</span>
      </div>
    </section>
  );
}

export default ProductSection;

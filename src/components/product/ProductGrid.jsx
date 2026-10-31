
import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  onViewProduct,
}) {
  return (
    <div className="mn-products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isWishlisted={wishlist.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
          onViewProduct={onViewProduct}
        />
      ))}
    </div>
  );
}

export default ProductGrid;

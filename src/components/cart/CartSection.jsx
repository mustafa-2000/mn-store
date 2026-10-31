function CartSection({
  cart,
  cartCount,
  updateCartQuantity,
  removeFromCart,
  onCheckout,
}) {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <section className="mn-cart" id="cart">
      <div className="mn-cart-header">
        <div>
          <span className="mn-eyebrow">YOUR SELECTION</span>
          <h2>Your Shopping Cart</h2>
        </div>

        <span className="mn-cart-items">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="mn-cart-empty">
          <div className="mn-cart-empty-icon">♧</div>
          <h3>Your cart is waiting</h3>
          <p>Discover something you love and add it to your cart.</p>
          <a href="#products" className="mn-cart-continue">
            Explore products ↗
          </a>
        </div>
      ) : (
        <div className="mn-cart-layout">
          <div className="mn-cart-list">
            {cart.map((item) => (
              <article
  className="mn-cart-item"
  key={`${item.id}-${item.selectedSize || ""}-${item.selectedColor || ""}`}
>
                <img src={item.image} alt={item.name} />

                <div className="mn-cart-item-info">
                  <span>{item.category}</span>

                  <h3>{item.name}</h3>

              {item.selectedSize && (
  <p>Size: {item.selectedSize}</p>
)}

{item.selectedColor && (
  <p>Color: {item.selectedColor}</p>
)}
                  <p>${Number(item.price).toFixed(2)}</p>

                  <div className="mn-quantity">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() => updateCartQuantity(item, -1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => updateCartQuantity(item, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mn-cart-item-end">
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>

                  <button
                    type="button"
                    className="mn-remove-item"
                    onClick={() => removeFromCart(item)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="mn-cart-summary">
            <h3>Order summary</h3>

            <div className="mn-summary-line">
              <span>Items ({cartCount})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mn-summary-line">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="mn-summary-total">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <button
              type="button"
              className="mn-checkout-button"
              onClick={onCheckout}
            >
              Proceed to checkout ↗
            </button>
            <a href="#products" className="mn-cart-back">
              ← Continue shopping
            </a>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartSection;

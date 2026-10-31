function CartDrawer({
  isOpen,
  cart,
  cartCount,
  onClose,
  onCheckout,
  updateCartQuantity,
  removeFromCart,
}) {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      {isOpen && (
        <div
          className="mn-cart-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`mn-cart-drawer ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="mn-cart-drawer-header">
          <div>
            <h2>Your Cart</h2>
            <p>
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            className="mn-cart-close"
            onClick={onClose}
            aria-label="Close shopping cart"
            tabIndex={isOpen ? 0 : -1}
          >
            ×
          </button>
        </div>

        <div className="mn-cart-drawer-body">
          {cart.length === 0 ? (
            <div className="mn-cart-empty">
              <span className="mn-cart-empty-icon">🛍</span>
              <h3>Your cart is empty</h3>
              <p>Discover something you'll love.</p>
              <button type="button" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <article
                className="mn-cart-drawer-item"
                key={`${item.id}-${item.selectedSize || ""}-${item.selectedColor || ""}`}
              >
                <img src={item.image} alt={item.name} />

                <div className="mn-cart-item-info">
                  <h3>{item.name}</h3>

                  {item.selectedSize && (
                    <p className="mn-cart-item-option">
                      Size: {item.selectedSize}
                    </p>
                  )}

                  {item.selectedColor && (
                    <p className="mn-cart-item-option">
                      Color: {item.selectedColor}
                    </p>
                  )}

                  <p className="mn-cart-item-price">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  <div className="mn-cart-item-actions">
                    <div
                      className="mn-cart-quantity"
                      aria-label={`Quantity for ${item.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item, -1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item, 1)}
                      >
                        +
                      </button>
                    </div>

                    <button type="button" onClick={() => removeFromCart(item)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="mn-cart-drawer-footer">
            <div className="mn-cart-subtotal">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <p className="mn-cart-shipping-note">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              type="button"
              className="mn-cart-checkout"
              onClick={() => {
                onCheckout();
                document.activeElement?.blur();
              }}
            >
              Continue to checkout <span>↗</span>
            </button>

            <button
              type="button"
              className="mn-cart-continue"
              onClick={onClose}
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;

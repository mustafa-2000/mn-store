
function CheckoutSection({
  cart,
  onBack,
  onPlaceOrder,
}) {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8.99;
  const total = subtotal + shipping;

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());

    onPlaceOrder(customer);
  }

  return (
    <section className="mn-checkout">
      <button
        type="button"
        className="mn-checkout-back"
        onClick={onBack}
      >
        ← Continue shopping
      </button>

      <div className="mn-checkout-heading">
        <span>MN STORE / CHECKOUT</span>
        <h1>Complete your order.</h1>
        <p>Just a few details, and you're all set.</p>
      </div>

      {cart.length === 0 ? (
        <div className="mn-checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add something to your cart before checking out.</p>
          <button type="button" onClick={onBack}>
            Return to shopping
          </button>
        </div>
      ) : (
        <div className="mn-checkout-layout">
          <form
            className="mn-checkout-form"
            onSubmit={handleSubmit}
          >
            <div className="mn-checkout-card">
              <h2>01. Contact information</h2>

              <label htmlFor="checkout-email">Email address</label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="checkout-phone">Phone number</label>
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                autoComplete="tel"
                required
              />
            </div>

            <div className="mn-checkout-card">
              <h2>02. Shipping address</h2>

              <div className="mn-checkout-fields">
                <div>
                  <label htmlFor="checkout-first">First name</label>
                  <input
                    id="checkout-first"
                    name="firstName"
                    autoComplete="given-name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="checkout-last">Last name</label>
                  <input
                    id="checkout-last"
                    name="lastName"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <label htmlFor="checkout-address">Street address</label>
              <input
                id="checkout-address"
                name="address"
                autoComplete="street-address"
                placeholder="House number and street"
                required
              />

              <div className="mn-checkout-fields">
                <div>
                  <label htmlFor="checkout-city">City</label>
                  <input
                    id="checkout-city"
                    name="city"
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="checkout-postal">Postal code</label>
                  <input
                    id="checkout-postal"
                    name="postalCode"
                    autoComplete="postal-code"
                    required
                  />
                </div>
              </div>

              <label htmlFor="checkout-country">Country</label>
              <select
                id="checkout-country"
                name="country"
                autoComplete="country-name"
                defaultValue=""
                required
              >
                <option value="" disabled>Select your country</option>
                <option value="Canada">Canada</option>
                <option value="Pakistan">Pakistan</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mn-checkout-card">
              <h2>03. Delivery method</h2>

              <label className="mn-delivery-option">
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  defaultChecked
                />
                <span>
                  <strong>Standard delivery</strong>
                  <small>Delivery timing will be confirmed later</small>
                </span>
                <strong>Standard</strong>
              </label>
            </div>

            <button
              type="submit"
              className="mn-place-order"
            >
              Place demo order · ${total.toFixed(2)}
              <span>↗</span>
            </button>

            <p className="mn-checkout-disclaimer">
              Demo checkout only. No payment will be collected.
            </p>
          </form>

          <aside className="mn-checkout-summary">
            <h2>Your order</h2>

            {cart.map((item) => (
              <div className="mn-checkout-product" key={item.id}>
                <div className="mn-checkout-product-image">
                  <img src={item.image} alt={item.name} />
                  <span>{item.quantity}</span>
                </div>

                
<div className="mn-checkout-product-info">
  <strong>{item.name}</strong>

  {item.selectedSize && (
    <span>Size: {item.selectedSize}</span>
  )}

  {item.selectedColor && (
    <span>Color: {item.selectedColor}</span>
  )}

  <span>
    ${Number(item.price).toFixed(2)} each
  </span>
</div>


                <strong>
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}

            <div className="mn-checkout-total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mn-checkout-total-row">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="mn-checkout-grand-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <p className="mn-checkout-summary-note">
              {subtotal >= 100
                ? "Your order qualifies for free shipping."
                : "Free shipping on orders of $100 or more."}
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CheckoutSection;

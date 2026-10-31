
function Order({ order, onBack }) {
  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  if (!order) {
    return (
      <main className="mn-order-page">
        <button
          type="button"
          className="mn-order-back"
          onClick={onBack}
        >
          ← Back to My Orders
        </button>
        <div className="mn-order-empty">
          <h2>Order not found</h2>
          <p>We couldn't load these order details.</p>
        </div>
      </main>
    );
  }

  const items = order.items || [];
  const subtotal =
    Number(order.subtotal) ||
    items.reduce(
      (total, item) =>
        total +
        (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );

  return (
    <main className="mn-order-page">
      <button
        type="button"
        className="mn-order-back"
        onClick={onBack}
      >
        <span aria-hidden="true">←</span> Back to My Orders
      </button>

      <header className="mn-order-heading">
        <p className="mn-order-eyebrow">MN STORE / ORDER HISTORY</p>
        <h1>Order details</h1>
        <p>Review your purchase and order information.</p>
      </header>

      <section className="mn-order-overview">
        <div>
          <span className="mn-order-label">ORDER NUMBER</span>
          <h2>#{order.id}</h2>
          <p className="mn-order-date">
            Placed on{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date unavailable"}
          </p>
        </div>

        <span className="mn-order-status-badge">
          <span className="mn-order-status-dot" />
          {order.status || "Placed"}
        </span>
      </section>

      <div className="mn-order-layout">
        <section className="mn-order-products">
          <div className="mn-order-section-heading">
            <h2>Items ordered</h2>
            <span>
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {items.length === 0 ? (
            <p className="mn-order-empty-text">
              No items are available for this order.
            </p>
          ) : (
            <div className="mn-order-product-list">
              {items.map((item, index) => (
                <article
                  className="mn-order-product"
                  key={`${order.id}-${item.id ?? item.name}-${index}`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "Product"}
                      className="mn-order-product-image"
                    />
                  ) : (
                    <div className="mn-order-product-placeholder">
                      <span>MN</span>
                    </div>
                  )}

                  <div className="mn-order-product-info">
                    <h3>{item.name || "Product"}</h3>

                    {item.selectedSize && (
                      <p>Size: {item.selectedSize}</p>
                    )}

                    {item.selectedColor && (
                      <p>Color: {item.selectedColor}</p>
                    )}

                    <p>Quantity: {Number(item.quantity) || 0}</p>
                  </div>

                  <div className="mn-order-product-price">
                    <strong>
                      {formatPrice(
                        (Number(item.price) || 0) *
                          (Number(item.quantity) || 0)
                      )}
                    </strong>
                    <span>{formatPrice(item.price)} each</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="mn-order-summary">
          <h2>Order summary</h2>

          <div className="mn-order-summary-row">
            <span>Items subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {order.shippingCost != null && (
            <div className="mn-order-summary-row">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
          )}

          {order.discount != null && Number(order.discount) > 0 && (
            <div className="mn-order-summary-row mn-order-discount">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}

          <div className="mn-order-summary-total">
            <span>Total</span>
            <strong>
              {formatPrice(
                order.total != null
                  ? order.total
                  : subtotal +
                      (Number(order.shippingCost) || 0) -
                      (Number(order.discount) || 0)
              )}
            </strong>
          </div>

          <p className="mn-order-summary-note">
            Your order information is shown above for your records.
          </p>
        </aside>
      </div>

      {order.customer && (
        <section className="mn-order-customer">
          <h2>Customer information</h2>
          <div className="mn-order-customer-grid">
            {Object.entries(order.customer)
              .filter(
                ([key, value]) =>
                  value != null &&
                  value !== "" &&
                  !/password/i.test(key) &&
                  typeof value !== "object"
              )
              .map(([key, value]) => (
                <div className="mn-order-customer-field" key={key}>
                  <span>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) =>
                      c.toUpperCase()
                    )}
                  </span>
                  <strong>{String(value)}</strong>
                </div>
              ))}
          </div>
        </section>
      )}

      <div className="mn-order-footer">
        <p>Thank you for shopping with MN Store.</p>
        <button
          type="button"
          className="mn-order-continue"
          onClick={onBack}
        >
          Return to My Orders
        </button>
      </div>
    </main>
  );
}

export default Order;

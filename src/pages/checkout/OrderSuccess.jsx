
function OrderSuccess({ order, onContinueShopping }) {
  if (!order) {
    return (
      <section className="mn-order-success-page">
        <h1>No order found</h1>
        <button type="button" onClick={onContinueShopping}>
          Continue shopping
        </button>
      </section>
    );
  }

  const subtotal = order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8.99;

  return (
    <section className="mn-order-success-page">
      <div className="mn-order-success-card">
        <div className="mn-order-success-icon">✓</div>

        <span className="mn-eyebrow">MN STORE / ORDER CONFIRMED</span>

        <h1>Thank you for your order!</h1>

        <p className="mn-order-success-message">
          Your demo order has been placed successfully.
          We appreciate you shopping with MN Store.
        </p>

        <div className="mn-order-number">
          <span>Order number</span>
          <strong>{order.id}</strong>
        </div>

        <div className="mn-order-success-details">
          <div>
            <span>Customer</span>
            <strong>
              {order.customer?.firstName} {order.customer?.lastName}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{order.customer?.email}</strong>
          </div>

          <div>
            <span>Order date</span>
            <strong>
              {new Date(order.createdAt).toLocaleDateString()}
            </strong>
          </div>
        </div>

       
<div className="mn-order-success-items">
  <h2>Order summary</h2>

  {order.items.map((item, index) => (
    <div
      className="mn-order-success-item"
      key={`${item.id}-${item.selectedSize || ""}-${item.selectedColor || ""}-${index}`}
    >
      <img src={item.image} alt={item.name} />

      <div className="mn-order-success-item-info">
        <strong>{item.name}</strong>

        {item.selectedSize && (
          <span>Size: {item.selectedSize}</span>
        )}

        {item.selectedColor && (
          <span>Color: {item.selectedColor}</span>
        )}

        <span>Quantity: {item.quantity}</span>

        <span>Price per item: ${Number(item.price).toFixed(2)}</span>
      </div>

      <strong>
        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
      </strong>
    </div>
  ))}

  <div className="mn-order-success-total">
    <span>Subtotal</span>
    <span>${subtotal.toFixed(2)}</span>
  </div>

  <div className="mn-order-success-total">
    <span>Shipping</span>
    <span>
      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
    </span>
  </div>

  <div className="mn-order-success-grand-total">
    <span>Total</span>
    <strong>${(subtotal + shipping).toFixed(2)}</strong>
  </div>
</div>


        <button
          type="button"
          className="mn-order-continue-button"
          onClick={onContinueShopping}
        >
          Continue shopping <span>↗</span>
        </button>

        <p className="mn-order-demo-note">
          Portfolio demo · No payment was collected.
        </p>
      </div>
    </section>
  );
}

export default OrderSuccess;

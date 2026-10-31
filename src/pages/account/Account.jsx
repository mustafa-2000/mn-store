import React, { useState } from "react";
import Order from "./Order";

function Account({
  wishlist = [],
  products = [],
  orders = [],
  onToggleWishlist,
  onAddToCart,
  onContinueShopping,
  onLogout,
}) {
  const [activeSection, setActiveSection] = useState("Overview");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [profile, setProfile] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("mn-store-profile")) || {
          name: "",
          email: "",
          phone: "",
        }
      );
    } catch {
      return { name: "", email: "", phone: "" };
    }
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mn-store-addresses")) || [];
    } catch {
      return [];
    }
  });

  const [addressMessage, setAddressMessage] = useState("");

  const [profileMessage, setProfileMessage] = useState("");

  const sections = [
    {
      title: "My Orders",
      description: "View and track your orders",
      icon: "📦",
    },
    {
      title: "My Profile",
      description: "Manage your personal information",
      icon: "👤",
    },
    {
      title: "My Addresses",
      description: "Manage your delivery addresses",
      icon: "📍",
    },
    {
      title: "My Wishlist",
      description: "View your saved products",
      icon: "♡",
    },
  ];

  if (selectedOrder) {
    return (
      <Order order={selectedOrder} onBack={() => setSelectedOrder(null)} />
    );
  }

  return (
    <section className="mn-customer-dashboard">
      <div className="mn-dashboard-heading">
        <p className="mn-dashboard-eyebrow">MN STORE / MY ACCOUNT</p>
        <h1>My Account</h1>
        <p>Manage your orders, profile, and shopping preferences.</p>

        <div className="mn-account-heading-actions">
          <button
            type="button"
            className="mn-account-home-button"
            onClick={onContinueShopping}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="mn-account-layout">
        <aside className="mn-account-sidebar">
          <p className="mn-dashboard-eyebrow">ACCOUNT MENU</p>

          <button
            type="button"
            className={`mn-sidebar-link ${
              activeSection === "Overview" ? "active" : ""
            }`}
            onClick={() => setActiveSection("Overview")}
          >
            🏠 Overview
          </button>

          {sections.map((section) => (
            <button
              type="button"
              key={section.title}
              className={`mn-sidebar-link ${
                activeSection === section.title ? "active" : ""
              }`}
              onClick={() => setActiveSection(section.title)}
            >
              <span>{section.icon}</span>
              {section.title}
            </button>
          ))}

          <button
            type="button"
            className="mn-sidebar-logout"
            onClick={onLogout}
          >
            ↪ Log Out
          </button>
        </aside>

        <main className="mn-account-content">
          {activeSection === "Overview" ? (
            <div className="mn-account-overview">
              <div className="mn-overview-intro">
                <h2>Account Overview</h2>
                <p>Here's a summary of your shopping activity.</p>
              </div>

              <div className="mn-overview-stats">
                <article className="mn-overview-card">
                  <span>📦</span>
                  <p>Total Orders</p>
                  <strong>{orders.length}</strong>
                </article>

                <article className="mn-overview-card">
                  <span>♡</span>
                  <p>Wishlist Items</p>
                  <strong>{wishlist.length}</strong>
                </article>

                <article className="mn-overview-card">
                  <span>📍</span>
                  <p>Saved Addresses</p>
                  <strong>{addresses.length}</strong>
                </article>
              </div>

              <div className="mn-recent-orders">
  <div className="mn-recent-orders-heading">
    <h3>Recent Orders</h3>
    <button
      type="button"
      onClick={() => setActiveSection("My Orders")}
    >
      View All →
    </button>
  </div>

  {orders.length === 0 ? (
    <p className="mn-empty-orders">
      You haven't placed any orders yet.
    </p>
  ) : (
    orders.slice(0, 3).map((order) => (
      <div className="mn-recent-order-item" key={order.id}>
        <div>
          <strong>Order #{order.id}</strong>
          <p>
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span>Placed</span>
      </div>
    ))
  )}
</div>
            </div>
          ) : (
            <div className="mn-account-section">
              <button
                type="button"
                className="mn-account-back"
                onClick={() => setActiveSection("Overview")}
              >
                ← Back to dashboard
              </button>

              <h2>{activeSection}</h2>

              {activeSection === "My Orders" && (
                <div className="mn-account-orders">
                  {orders.length === 0 ? (
                    <div>
                      <p>You haven't placed any orders yet.</p>
                      <button
                        type="button"
                        className="mn-account-back"
                        onClick={onContinueShopping}
                      >
                        Start shopping →
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <article className="mn-order-card" key={order.id}>
                        <div className="mn-order-card-header">
                          <div>
                            <h3>Order #{order.id}</h3>
                            <p>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="mn-order-status">Placed</span>
                        </div>

                        <div className="mn-order-items">
                          {order.items.map((item, index) => (
                            <p
                              key={`${order.id}-${item.id ?? item.name}-${index}`}
                            >
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>

                        <div className="mn-order-total">
                          <span>Order subtotal</span>
                          <strong>
                            {new Intl.NumberFormat("en-PK", {
                              style: "currency",
                              currency: "PKR",
                              maximumFractionDigits: 2,
                            }).format(order.subtotal)}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="mn-account-back"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Order Details →
                        </button>
                      </article>
                    ))
                  )}
                </div>
              )}

              {activeSection === "My Profile" && (
                <form
                  className="mn-profile-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    localStorage.setItem(
                      "mn-store-profile",
                      JSON.stringify(profile),
                    );
                    setProfileMessage("Your profile has been saved.");
                  }}
                >
                  <p>Update your personal information below.</p>

                  <label htmlFor="mn-profile-name">Full name</label>
                  <input
                    id="mn-profile-name"
                    type="text"
                    value={profile.name}
                    onChange={(event) => {
                      setProfile({ ...profile, name: event.target.value });
                      setProfileMessage("");
                    }}
                    placeholder="Enter your full name"
                    required
                  />

                  <label htmlFor="mn-profile-email">Email address</label>
                  <input
                    id="mn-profile-email"
                    type="email"
                    value={profile.email}
                    onChange={(event) => {
                      setProfile({ ...profile, email: event.target.value });
                      setProfileMessage("");
                    }}
                    placeholder="you@example.com"
                    required
                  />

                  <label htmlFor="mn-profile-phone">Phone number</label>
                  <input
                    id="mn-profile-phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(event) => {
                      setProfile({ ...profile, phone: event.target.value });
                      setProfileMessage("");
                    }}
                    placeholder="Enter your phone number"
                  />

                  <button type="submit" className="mn-profile-save">
                    Save Changes
                  </button>

                  {profileMessage && (
                    <p className="mn-profile-message" role="status">
                      {profileMessage}
                    </p>
                  )}
                </form>
              )}

              {activeSection === "My Addresses" && (
                <div className="mn-address-section">
                  <p>Add and manage your delivery addresses.</p>

                  <form
                    className="mn-address-form"
                    onSubmit={(event) => {
                      event.preventDefault();

                      const form = event.currentTarget;
                      const data = new FormData(form);

                      const newAddress = {
                        id: `${Date.now()}`,
                        fullName: data.get("fullName").trim(),
                        phone: data.get("phone").trim(),
                        street: data.get("street").trim(),
                        city: data.get("city").trim(),
                        postalCode: data.get("postalCode").trim(),
                      };

                      const updatedAddresses = [...addresses, newAddress];

                      setAddresses(updatedAddresses);
                      localStorage.setItem(
                        "mn-store-addresses",
                        JSON.stringify(updatedAddresses),
                      );

                      setAddressMessage("Address saved successfully.");
                      form.reset();
                    }}
                  >
                    <label htmlFor="mn-address-name">Full name</label>
                    <input id="mn-address-name" name="fullName" required />

                    <label htmlFor="mn-address-phone">Phone number</label>
                    <input
                      id="mn-address-phone"
                      name="phone"
                      type="tel"
                      required
                    />

                    <label htmlFor="mn-address-street">Street address</label>
                    <input id="mn-address-street" name="street" required />

                    <label htmlFor="mn-address-city">City</label>
                    <input id="mn-address-city" name="city" required />

                    <label htmlFor="mn-address-postal">Postal code</label>
                    <input id="mn-address-postal" name="postalCode" />

                    <button type="submit" className="mn-profile-save">
                      Save Address
                    </button>
                  </form>

                  {addressMessage && (
                    <p className="mn-profile-message" role="status">
                      {addressMessage}
                    </p>
                  )}

                  <div className="mn-saved-addresses">
                    <h3>Saved Addresses</h3>

                    {addresses.length === 0 ? (
                      <p>You haven't saved any addresses yet.</p>
                    ) : (
                      addresses.map((address) => (
                        <article
                          className="mn-saved-address-card"
                          key={address.id}
                        >
                          <strong>{address.fullName}</strong>
                          <p>{address.phone}</p>
                          <p>{address.street}</p>
                          <p>
                            {address.city}
                            {address.postalCode
                              ? `, ${address.postalCode}`
                              : ""}
                          </p>

                          <button
                            type="button"
                            className="mn-address-remove"
                            onClick={() => {
                              const updatedAddresses = addresses.filter(
                                (item) => item.id !== address.id,
                              );

                              setAddresses(updatedAddresses);
                              localStorage.setItem(
                                "mn-store-addresses",
                                JSON.stringify(updatedAddresses),
                              );
                              setAddressMessage("Address removed.");
                            }}
                          >
                            Remove
                          </button>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeSection === "My Wishlist" && (
                <div className="mn-account-wishlist">
                  {wishlist.length === 0 ? (
                    <p>
                      Your wishlist is empty. Save products from the shop to see
                      them here.
                    </p>
                  ) : (
                    <div className="mn-dashboard-grid">
                      {products
                        .filter((product) => wishlist.includes(product.id))
                        .map((product) => (
                          <article
                            className="mn-dashboard-card"
                            key={product.id}
                          >
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="mn-account-product-image"
                              />
                            )}
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>

                            <button
                              type="button"
                              className="mn-account-back"
                              onClick={() => onToggleWishlist?.(product)}
                            >
                              Remove from wishlist
                            </button>

                            <button
                              type="button"
                              className="mn-account-back"
                              onClick={() => onAddToCart?.(product)}
                            >
                              Add to cart
                            </button>
                          </article>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

export default Account;

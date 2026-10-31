import { useEffect, useMemo, useState } from "react";
import API_URL from "../../services/api";


const emptyProduct = {
  name: "",
  description: "",
  price: "",
  old_price: "",
  category: "",
  image_url: "",
  stock: "",
};

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("Products");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image_url: "",
    stock: "",
  });

  const [newProduct, setNewProduct] = useState(emptyProduct);

  const getToken = () => {
    const session = JSON.parse(
      localStorage.getItem("mn-store-session") || "null",
    );

    if (!session?.token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    return session.token;
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(data.orders || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setCustomersLoading(true);
    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/auth/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load customers.");
      }

      setCustomers(data.customers || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setCustomersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setError("");

      const token = getToken();

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.order_id === orderId ? data.order : order,
        ),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load products.");
        }

        setProducts(data.products || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.category, String(product.id)]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [products, searchQuery]);

  const closeModal = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setError("");
  };

  const handleEdit = (product) => {
    setError("");
    setIsAddingProduct(false);
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      category: product.category || "",
      image_url: product.image_url || "",
      stock: product.stock ?? "",
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update product.");
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProduct.id ? data.product : product,
        ),
      );

      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          old_price: newProduct.old_price ? Number(newProduct.old_price) : null,
          stock: Number(newProduct.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to add product.");
      }

      setProducts((currentProducts) => [...currentProducts, data.product]);
      setNewProduct(emptyProduct);
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    setError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete product.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const openAddModal = () => {
    setError("");
    setEditingProduct(null);
    setNewProduct(emptyProduct);
    setIsAddingProduct(true);
  };

  const navigationItems = [
    { name: "Overview", icon: "▦" },
    { name: "Products", icon: "□" },
    { name: "Orders", icon: "▤" },
    { name: "Customers", icon: "♙" },
    { name: "Analytics", icon: "▥" },
  ];

 const totalRevenue = orders.reduce((total, order) => {
  if (order.status === "Cancelled") {
    return total;
  }

  return total + Number(order.subtotal || 0);
}, 0);

const activeOrders = orders.filter(
  (order) => order.status !== "Cancelled"
);

const averageOrderValue =
  activeOrders.length > 0
    ? totalRevenue / activeOrders.length
    : 0;

const deliveredOrders = orders.filter(
  (order) => order.status === "Delivered"
).length;

const pendingOrders = orders.filter(
  (order) =>
    order.status === "Placed" ||
    order.status === "Processing"
).length;

const monthlySales = orders.reduce((sales, order) => {
  if (order.status === "Cancelled") {
    return sales;
  }

  const date = new Date(order.created_at);

  if (Number.isNaN(date.getTime())) {
    return sales;
  }

  const month = date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  sales[month] = (sales[month] || 0) + Number(order.subtotal || 0);

  return sales;
}, {});

const bestSellingProducts = orders.reduce((products, order) => {
  if (order.status === "Cancelled" || !Array.isArray(order.items)) {
    return products;
  }

  order.items.forEach((item) => {
    const productName = item.name || "Unknown Product";
    const quantity = Number(item.quantity) || 0;

    products[productName] =
      (products[productName] || 0) + quantity;
  });

  return products;
}, {});

  return (
    <div className="mn-admin">
      <aside className="mn-admin-sidebar">
        <div className="mn-admin-brand">
          <span className="mn-admin-brand-mark">MN</span>
          <span>
            MN STORE
            <small>ADMIN PANEL</small>
          </span>
        </div>

        <div className="mn-admin-nav-label">MAIN MENU</div>

        <nav className="mn-admin-nav">
          {navigationItems.map((item) => (
            <button
              type="button"
              key={item.name}
              className={
                activePage === item.name
                  ? "mn-admin-nav-link active"
                  : "mn-admin-nav-link"
              }
              onClick={() => {
                setActivePage(item.name);
                setError("");
              }}
            >
              <span className="mn-admin-nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Products" && (
                <span className="mn-admin-nav-count">{products.length}</span>
              )}

              {item.name === "Orders" && (
                <span className="mn-admin-nav-count">{orders.length}</span>
              )}

              {item.name === "Customers" && (
                <span className="mn-admin-nav-count">{customers.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mn-admin-sidebar-bottom">
          <div className="mn-admin-profile">
            <div className="mn-admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Store Manager</small>
            </div>
          </div>

          <button type="button" className="mn-admin-logout" onClick={onLogout}>
            ↪ <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="mn-admin-main">
        <header className="mn-admin-topbar">
          <div>
            <p className="mn-admin-breadcrumb">MN STORE / ADMIN</p>
            <h1>{activePage}</h1>
          </div>

          <div className="mn-admin-topbar-right">
            <span className="mn-admin-status-dot" />
            <span>System Online</span>
          </div>
        </header>

        <div className="mn-admin-page">
          {error && !isAddingProduct && !editingProduct && (
            <div className="mn-admin-alert">{error}</div>
          )}

          <section className="mn-admin-stats">
            <article className="mn-admin-stat-card">
              <div className="mn-admin-stat-top">
                <span>Total Products</span>
                <span className="mn-admin-stat-icon">□</span>
              </div>
              <strong>{loading ? "..." : products.length}</strong>
              <small>Products in your store</small>
            </article>

            <article className="mn-admin-stat-card">
              <div className="mn-admin-stat-top">
                <span>Total Orders</span>
                <span className="mn-admin-stat-icon">▤</span>
              </div>
              <strong>{orders.length}</strong>
              <small>Orders received by your store</small>
            </article>

            <article className="mn-admin-stat-card">
              <div className="mn-admin-stat-top">
                <span>Total Customers</span>
                <span className="mn-admin-stat-icon">♙</span>
              </div>
              <strong>{customersLoading ? "..." : customers.length}</strong>
              <small>Registered customers</small>
            </article>

            <article className="mn-admin-stat-card">
              <div className="mn-admin-stat-top">
                <span>Total Revenue</span>
                <span className="mn-admin-stat-icon">$</span>
              </div>
              <strong>
  ${totalRevenue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
</strong>
<small>Revenue from non-cancelled orders</small>
            </article>
          </section>

          {activePage === "Products" && (
            <section className="mn-admin-panel">
              <div className="mn-admin-panel-heading">
                <div>
                  <p className="mn-admin-eyebrow">STORE INVENTORY</p>
                  <h2>Product Management</h2>
                  <p>Manage, update, and organize your store products.</p>
                </div>

                <button
                  type="button"
                  className="mn-admin-primary-button"
                  onClick={openAddModal}
                >
                  + Add New Product
                </button>
              </div>

              <div className="mn-admin-toolbar">
                <div className="mn-admin-search">
                  <span>⌕</span>
                  <input
                    type="search"
                    placeholder="Search by product name, category or ID..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>

                <span className="mn-admin-result-count">
                  {filteredProducts.length} products
                </span>
              </div>

              {loading ? (
                <div className="mn-admin-empty">Loading products...</div>
              ) : error && !products.length ? (
                <div className="mn-admin-empty">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="mn-admin-empty">
                  No products found. Try another search.
                </div>
              ) : (
                <div className="mn-admin-table-wrap">
                  <table className="mn-admin-table">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>ID</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="mn-admin-product-cell">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                />
                              ) : (
                                <div className="mn-admin-image-placeholder">
                                  No image
                                </div>
                              )}

                              <strong>{product.name}</strong>
                            </div>
                          </td>

                          <td>#{product.id}</td>
                          <td>
                            <span className="mn-admin-category">
                              {product.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="mn-admin-price">
                            ${Number(product.price).toFixed(2)}
                          </td>
                          <td>
                            <span
                              className={
                                Number(product.stock) > 0
                                  ? "mn-admin-stock in-stock"
                                  : "mn-admin-stock out-stock"
                              }
                            >
                              {Number(product.stock) > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </span>
                          </td>
                          <td>
                            <div className="mn-admin-actions">
                              <button
                                type="button"
                                className="mn-admin-edit-button"
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="mn-admin-delete-button"
                                onClick={() => handleDelete(product.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activePage === "Overview" && (
            <section className="mn-admin-panel mn-admin-welcome">
              <p className="mn-admin-eyebrow">STORE OVERVIEW</p>
              <h2>Welcome to MN Store Admin</h2>
              <p>
                Your store control panel is ready. Use the sidebar to manage
                your products. Order and customer management will be added next.
              </p>
              <button
                type="button"
                className="mn-admin-primary-button"
                onClick={() => setActivePage("Products")}
              >
                Manage Products
              </button>
            </section>
          )}

          {activePage === "Orders" && (
            <section className="mn-admin-panel">
              <div className="mn-admin-panel-heading">
                <div>
                  <p className="mn-admin-eyebrow">CUSTOMER PURCHASES</p>
                  <h2>Order Management</h2>
                  <p>View orders placed by your customers.</p>
                </div>

                <button
                  type="button"
                  className="mn-admin-primary-button"
                  onClick={fetchOrders}
                >
                  Refresh Orders
                </button>
              </div>

              {error && <div className="mn-admin-alert">{error}</div>}

              {ordersLoading ? (
                <div className="mn-admin-empty">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="mn-admin-empty">
                  No orders have been placed yet.
                </div>
              ) : (
                <div className="mn-admin-table-wrap">
                  <table className="mn-admin-table">
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>CUSTOMER</th>
                        <th>ITEMS</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => {
                        const customerName =
                          [order.customer?.firstName, order.customer?.lastName]
                            .filter(Boolean)
                            .join(" ") || "Customer";

                        const itemSummary = Array.isArray(order.items)
                          ? order.items
                              .map((item) => `${item.name} × ${item.quantity}`)
                              .join(", ")
                          : "—";

                        return (
                          <tr key={order.order_id}>
                            <td>#{order.order_id}</td>

                            <td>
                              <strong>{customerName}</strong>
                              <br />
                              <small>{order.customer?.email || ""}</small>
                            </td>

                            <td>{itemSummary}</td>

                            <td className="mn-admin-price">
                              ${Number(order.subtotal).toFixed(2)}
                            </td>

                            <td>
                              <select
                                className="mn-admin-status-select"
                                value={order.status || "Placed"}
                                onChange={(event) =>
                                  updateOrderStatus(
                                    order.order_id,
                                    event.target.value,
                                  )
                                }
                              >
                                <option value="Placed">Placed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td>
                              {order.created_at
                                ? new Date(
                                    order.created_at,
                                  ).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activePage === "Customers" && (
            <section className="mn-admin-panel">
              <div className="mn-admin-panel-heading">
                <div>
                  <p className="mn-admin-eyebrow">CUSTOMER DIRECTORY</p>
                  <h2>Customer Management</h2>
                  <p>View registered customers in your store.</p>
                </div>

                <button
                  type="button"
                  className="mn-admin-primary-button"
                  onClick={fetchCustomers}
                >
                  Refresh Customers
                </button>
              </div>

              {customersLoading ? (
                <div className="mn-admin-empty">Loading customers...</div>
              ) : customers.length === 0 ? (
                <div className="mn-admin-empty">
                  No registered customers found.
                </div>
              ) : (
                <div className="mn-admin-table-wrap">
                  <table className="mn-admin-table">
                    <thead>
                      <tr>
                        <th>CUSTOMER ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ACCOUNT TYPE</th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id}>
                          <td>#{customer.id}</td>
                          <td>
                            <strong>{customer.name}</strong>
                          </td>
                          <td>{customer.email}</td>
                          <td>
                            <span className="mn-admin-category">
                              {customer.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

         {activePage === "Analytics" && (
  <section className="mn-admin-panel">
    <div className="mn-admin-panel-heading">
      <div>
        <p className="mn-admin-eyebrow">STORE PERFORMANCE</p>
        <h2>Analytics Dashboard</h2>
        <p>Monitor your store's orders and sales performance.</p>
      </div>
    </div>

    <div className="mn-admin-stats-grid">
      <article className="mn-admin-stat-card">
        <div className="mn-admin-stat-top">
          <span>Total Orders</span>
          <span className="mn-admin-stat-icon">#</span>
        </div>
        <strong>{orders.length}</strong>
        <small>All customer orders</small>
      </article>

      <article className="mn-admin-stat-card">
        <div className="mn-admin-stat-top">
          <span>Order Value</span>
          <span className="mn-admin-stat-icon">$</span>
        </div>
        <strong>
          ${totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>
        <small>Excluding cancelled orders</small>
      </article>

      <article className="mn-admin-stat-card">
        <div className="mn-admin-stat-top">
          <span>Average Order Value</span>
          <span className="mn-admin-stat-icon">↗</span>
        </div>
        <strong>
          ${averageOrderValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>
        <small>Per non-cancelled order</small>
      </article>

      <article className="mn-admin-stat-card">
        <div className="mn-admin-stat-top">
          <span>Delivered Orders</span>
          <span className="mn-admin-stat-icon">✓</span>
        </div>
        <strong>{deliveredOrders}</strong>
        <small>Successfully delivered</small>
      </article>

      <article className="mn-admin-stat-card">
        <div className="mn-admin-stat-top">
          <span>Pending Orders</span>
          <span className="mn-admin-stat-icon">◷</span>
        </div>
        <strong>{pendingOrders}</strong>
        <small>Placed or processing</small>
      </article>
    </div>

    <div className="mn-admin-panel" style={{ marginTop: "24px" }}>
  <div className="mn-admin-panel-heading">
    <div>
      <p className="mn-admin-eyebrow">SALES PERFORMANCE</p>
      <h2>Monthly Sales Overview</h2>
      <p>Order value from non-cancelled orders by month.</p>
    </div>
  </div>

  <div className="mn-admin-panel" style={{ marginTop: "24px" }}>
  <div className="mn-admin-panel-heading">
    <div>
      <p className="mn-admin-eyebrow">PRODUCT PERFORMANCE</p>
      <h2>Best-Selling Products</h2>
      <p>Products ranked by total quantity ordered.</p>
    </div>
  </div>

  {Object.keys(bestSellingProducts).length === 0 ? (
    <div className="mn-admin-empty">
      No product sales data available yet.
    </div>
  ) : (
    <div className="mn-admin-table-wrap">
      <table className="mn-admin-table">
        <thead>
          <tr>
            <th>RANK</th>
            <th>PRODUCT</th>
            <th>QUANTITY SOLD</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(bestSellingProducts)
            .sort((a, b) => b[1] - a[1])
            .map(([productName, quantity], index) => (
              <tr key={productName}>
                <td>#{index + 1}</td>
                <td><strong>{productName}</strong></td>
                <td>{quantity}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  {Object.keys(monthlySales).length === 0 ? (
    <div className="mn-admin-empty">
      No sales data available yet.
    </div>
  ) : (
    <div style={{ padding: "20px 0" }}>
      {Object.entries(monthlySales)
        .sort(
          ([monthA], [monthB]) =>
            new Date(monthA) - new Date(monthB)
        )
        .map(([month, amount]) => (
          <div
            key={month}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              padding: "14px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{month}</strong>
            <strong>
              ${amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        ))}
    </div>
  )}
</div>
  </section>
)}
        </div>
      </main>

      {(isAddingProduct || editingProduct) && (
        <div
          className="mn-admin-modal-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <section
            className="mn-admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mn-admin-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mn-admin-modal-heading">
              <div>
                <p className="mn-admin-eyebrow">
                  {isAddingProduct ? "INVENTORY" : "UPDATE INVENTORY"}
                </p>
                <h2 id="mn-admin-modal-title">
                  {isAddingProduct ? "Add New Product" : "Edit Product"}
                </h2>
              </div>

              <button
                type="button"
                className="mn-admin-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {error && <div className="mn-admin-alert">{error}</div>}

            {isAddingProduct ? (
              <form className="mn-admin-form" onSubmit={handleAddProduct}>
                <label>
                  Product Name
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={newProduct.description}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        description: event.target.value,
                      })
                    }
                    rows="3"
                  />
                </label>

                <div className="mn-admin-form-row">
                  <label>
                    Price ($)
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(event) =>
                        setNewProduct({
                          ...newProduct,
                          price: event.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Old Price ($)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.old_price}
                      onChange={(event) =>
                        setNewProduct({
                          ...newProduct,
                          old_price: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <div className="mn-admin-form-row">
                  <label>
                    Category
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(event) =>
                        setNewProduct({
                          ...newProduct,
                          category: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Stock
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={newProduct.stock}
                      onChange={(event) =>
                        setNewProduct({
                          ...newProduct,
                          stock: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                </div>

                <label>
                  Image URL
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newProduct.image_url}
                    onChange={(event) =>
                      setNewProduct({
                        ...newProduct,
                        image_url: event.target.value,
                      })
                    }
                  />
                </label>

                <div className="mn-admin-form-actions">
                  <button
                    type="button"
                    className="mn-admin-cancel-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="mn-admin-primary-button">
                    Save Product
                  </button>
                </div>
              </form>
            ) : (
              <form className="mn-admin-form" onSubmit={handleUpdate}>
                <label>
                  Product Name
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <div className="mn-admin-form-row">
                  <label>
                    Price ($)
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          price: event.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Stock
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          stock: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                </div>

                <label>
                  Category
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        category: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Image URL
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        image_url: event.target.value,
                      })
                    }
                  />
                </label>

                <div className="mn-admin-form-actions">
                  <button
                    type="button"
                    className="mn-admin-cancel-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="mn-admin-primary-button">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

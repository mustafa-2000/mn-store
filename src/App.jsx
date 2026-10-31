
import "./index.css";
import API_URL from "./services/api";
import { useState, useEffect } from "react";
import { getProducts, getProductById } from "./services/api";
import storeProducts from "./data/products";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import Home from "./pages/home/Home";
import ProductSection from "./components/product/ProductSection";
import CartSection from "./components/cart/CartSection";
import NewsletterSection from "./components/layout/NewsletterSection.jsx";
import WishlistSection from "./components/WishlistSection.jsx";
import ProductDetails from "./components/product/ProductDetails.jsx";
import CartDrawer from "./components/cart/CartDrawer.jsx";
import CheckoutSection from "./pages/checkout/CheckoutSection.jsx";
import OrderSuccess from "./pages/checkout/OrderSuccess.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import Account from "./pages/account/Account.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard";


function App() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleViewProduct = async (product) => {
  try {
    const databaseProduct = await getProductById(product.id);

    setSelectedProduct({
      ...databaseProduct,
      price: Number(databaseProduct.price),
      image: databaseProduct.image_url || "",
      rating: Number(databaseProduct.rating || 0),
      reviews: Number(databaseProduct.reviews || 0),
      oldPrice: databaseProduct.old_price
        ? Number(databaseProduct.old_price)
        : null,
      sizes: databaseProduct.sizes || [],
      colors: databaseProduct.colors || [],
    });
  } catch (error) {
    console.error("Unable to load product details:", error);
    setSelectedProduct(product);
  }
};
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(() => {
  try {
    const session = JSON.parse(
      localStorage.getItem("mn-store-session")
    );

    return session?.user?.role === "admin";
  } catch {
    return false;
  }
});
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("mn-store-session") !== null;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem("mn-store-session");
      return session ? JSON.parse(session).user : null;
    } catch {
      return null;
    }
  });
  const [cartMessage, setCartMessage] = useState("");
  const [checkoutAfterLogin, setCheckoutAfterLogin] = useState(false);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("mn-store-wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("mn-store-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mn-store-orders")) || [];
    } catch {
      return [];
    }
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [products, setProducts] = useState(storeProducts);

  useEffect(() => {
    try {
      localStorage.setItem("mn-store-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Unable to save the MN Store cart:", error);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("mn-store-wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Unable to save the MN Store wishlist:", error);
    }
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("mn-store-orders", JSON.stringify(orders));
  }, [orders]);

  // Load products from the MN Store backend
useEffect(() => {
  const loadProducts = async () => {
    try {
      const databaseProducts = await getProducts();

      if (databaseProducts.length > 0) {
        const formattedProducts = databaseProducts.map((product) => ({
          ...product,
          price: Number(product.price),
          image: product.image_url || "",
          rating: Number(product.rating || 0),
          reviews: Number(product.reviews || 0),
          oldPrice: product.old_price
            ? Number(product.old_price)
            : null,
          sizes: product.sizes || [],
          colors: product.colors || [],
        }));

        setProducts(formattedProducts);
      } else {
        setProducts(storeProducts);
      }
    } catch (error) {
      console.error("Unable to load database products:", error);
      setProducts(storeProducts);
    }
  };

  loadProducts();
}, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    console.log("Product received by addToCart:", {
      name: product.name,
      selectedSize: product.selectedSize,
      selectedColor: product.selectedColor,
      quantity: product.quantity,
    });

    const selectedSize = product.selectedSize || "";
    const selectedColor = product.selectedColor || "";
    const quantityToAdd = product.quantity || 1;

    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) =>
          item.id === product.id &&
          (item.selectedSize || "") === selectedSize &&
          (item.selectedColor || "") === selectedColor,
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id &&
          (item.selectedSize || "") === selectedSize &&
          (item.selectedColor || "") === selectedColor
            ? {
                ...item,
                quantity: item.quantity + quantityToAdd,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          selectedSize,
          selectedColor,
          quantity: quantityToAdd,
        },
      ];
    });
  };

  const updateCartQuantity = (product, change) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === product.id &&
        (item.selectedSize || "") === (product.selectedSize || "") &&
        (item.selectedColor || "") === (product.selectedColor || "")
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item,
      ),
    );
  };

  const removeFromCart = (product) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === product.id &&
            (item.selectedSize || "") === (product.selectedSize || "") &&
            (item.selectedColor || "") === (product.selectedColor || "")
          ),
      ),
    );
  };


const handlePlaceOrder = async (customer) => {
  try {
    const session = JSON.parse(
      localStorage.getItem("mn-store-session") || "null"
    );

    if (!session?.token) {
      throw new Error("Please log in before placing your order.");
    }

    if (cart.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const order = {
      id: `MN-${Date.now()}`,
      customer,
      items: cart.map((item) => ({ ...item })),
      subtotal: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to place your order.");
    }

    setOrders((currentOrders) => [order, ...currentOrders]);

    setLastOrder(order);
    setSuccessMessage(
      "✓ Order placed successfully! Your order is confirmed."
    );
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  } catch (error) {
    setCartMessage(error.message);
  }
};

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) =>
      currentWishlist.includes(product.id)
        ? currentWishlist.filter((id) => id !== product.id)
        : [...currentWishlist, product.id],
    );
  };

  const visibleProducts = (
    activeFilter === "Wishlist"
      ? products.filter((product) => wishlist.includes(product.id))
      :products.filter(
          (product) =>
            activeFilter === "All" || product.category === activeFilter,
        )
  )
    .filter((product) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesMinPrice =
        minPrice === "" || product.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || product.price <= Number(maxPrice);

      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);

      if (sortBy === "name-az") {
        return a.name.localeCompare(b.name);
      }

      // Keep the existing default order for Featured.
      return a.id - b.id;
    });

  return (
    <div
      className={`store ${
        isLoginOpen ||
           isAdminDashboardOpen ||
        isRegisterOpen ||
        isForgotPasswordOpen ||
        isResetPasswordOpen ||
        isCheckoutOpen ||
        lastOrder
          ? "store-no-navbar"
          : ""
      }`}
    >
      {cartMessage && (
        <div className="mn-cart-success" role="status">
          ✓ {cartMessage}
        </div>
      )}

      {/* Keep the rest of your existing content here */}
      {!isLoginOpen &&
      !isAdminDashboardOpen &&
        !isRegisterOpen &&
        !isForgotPasswordOpen &&
        !isResetPasswordOpen &&
        !isCheckoutOpen &&
        !isAccountOpen &&
        !lastOrder && (
          <>
            <AnnouncementBar />

            <Header
              cartCount={cartCount}
              wishlistCount={wishlist.length}
              onCartClick={() => setIsCartOpen(true)}
              onAccountClick={() => {
                setIsCartOpen(false);

                if (isLoggedIn) {
                  setIsLoginOpen(false);
                  setIsAccountOpen(true);
                } else {
                  setIsAccountOpen(false);
                  setIsLoginOpen(true);
                }
              }}
            />
          </>
        )}

      {successMessage && (
        <div className="mn-success-message" role="status">
          <div className="mn-success-message-icon">✓</div>

          <div className="mn-success-message-content">
            <strong>Order placed successfully!</strong>
            <p>
              Your order is confirmed. Thank you for shopping with MN Store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      <main>
        {isResetPasswordOpen ? (
          <ResetPassword
            onBack={() => setIsResetPasswordOpen(false)}
            onShowLogin={() => {
              setIsResetPasswordOpen(false);
              setIsLoginOpen(true);
            }}
          />
        ) : isForgotPasswordOpen ? (
          <ForgotPassword
            onBack={() => setIsForgotPasswordOpen(false)}
            onShowLogin={() => {
              setIsForgotPasswordOpen(false);
              setIsLoginOpen(true);
            }}
            onShowResetPassword={() => {
              setIsForgotPasswordOpen(false);
              setIsResetPasswordOpen(true);
            }}
          />
        ) : isRegisterOpen ? (
          <Register
            onBack={() => setIsRegisterOpen(false)}
            onShowLogin={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true);
            }}
           onRegister={async (formData) => {
  try {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed.");
    }

    window.alert("Account created successfully! Please sign in.");

    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  } catch (error) {
    window.alert(error.message || "Unable to create your account.");
  }
}}
          />
        ) : isLoginOpen ? (
          <Login
            onBack={() => setIsLoginOpen(false)}
            onShowRegister={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
            onShowForgotPassword={() => {
              setIsLoginOpen(false);
              setIsForgotPasswordOpen(true);
            }}
          onLogin={(data) => {
  const user = data.user;

  const session = {
    user,
    token: data.token,
    isLoggedIn: true,
  };

  localStorage.setItem(
    "mn-store-session",
    JSON.stringify(session)
  );

  setIsLoggedIn(true);
  setCurrentUser(user);
  setIsLoginOpen(false);

  if (user.role === "admin") {
    setIsAccountOpen(false);
    setIsAdminDashboardOpen(true);
  } else if (checkoutAfterLogin) {
    setCheckoutAfterLogin(false);
    setIsAccountOpen(false);
    setIsCheckoutOpen(true);
  } else {
    setIsAccountOpen(true);
  }
}}
          />
    ) : isAdminDashboardOpen ? (
  <AdminDashboard
    onLogout={() => {
      localStorage.removeItem("mn-store-session");
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsAdminDashboardOpen(false);
      setIsLoginOpen(false);
      setIsAccountOpen(false);
    }}
  />
) : isAccountOpen ? (
  <Account
            wishlist={wishlist}
            products={storeProducts}
            orders={orders}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onContinueShopping={() => setIsAccountOpen(false)}
            onLogout={() => {
              localStorage.removeItem("mn-store-session");
              setIsLoggedIn(false);
              setCurrentUser(null);
              setIsAccountOpen(false);
            }}
          />
        ) : lastOrder ? (
          <OrderSuccess
            order={lastOrder}
            onContinueShopping={() => {
              setLastOrder(null);
              setIsCheckoutOpen(false);
              setActiveFilter("All");
            }}
          />
        ) : isCheckoutOpen ? (
          <CheckoutSection
            cart={cart}
            onBack={() => setIsCheckoutOpen(false)}
            onPlaceOrder={handlePlaceOrder}
          />
        ) : (
          <>
            <Home setActiveFilter={setActiveFilter} />

            {selectedProduct ? (
              <ProductDetails
                product={selectedProduct}
                onAddToCart={(product) => {
                  addToCart(product);
                  setSelectedProduct(null);
                  setCartMessage(`${product.name} added to cart successfully!`);

                  window.setTimeout(() => {
                    setCartMessage("");
                  }, 3000);
                }}
                onBack={() => setSelectedProduct(null)}
              />
            ) : (
              <ProductSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                visibleProducts={visibleProducts}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                onViewProduct={handleViewProduct}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            )}

            <WishlistSection
              wishlist={wishlist}
              products={storeProducts}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
            />

            <CartSection
              cart={cart}
              cartCount={cartCount}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              onCheckout={() => {
                if (isLoggedIn) {
                  setIsCheckoutOpen(true);
                } else {
                  setCheckoutAfterLogin(true);
                  setIsLoginOpen(true);
                }
              }}
            />

            <NewsletterSection />
          </>
        )}
      </main>

      {selectedProduct && !isLoginOpen && (
        <div
          className="mn-product-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="mn-product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="mn-modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              ×
            </button>

            <ProductDetails
              product={selectedProduct}
              onAddToCart={addToCart}
              onBack={() => setSelectedProduct(null)}
              onAddedToCart={(product) => {
                setSelectedProduct(null);
                setCartMessage(`${product.name} added to cart successfully!`);

                window.setTimeout(() => {
                  setCartMessage("");
                }, 3000);
              }}
            />
          </div>
        </div>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        cartCount={cartCount}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);

          if (isLoggedIn) {
            setCheckoutAfterLogin(false);
            setIsCheckoutOpen(true);
          } else {
            setCheckoutAfterLogin(true);
            setIsLoginOpen(true);
          }
        }}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
      />

      <Footer />
    </div>
  );
}

export default App;

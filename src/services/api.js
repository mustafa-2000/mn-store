
const API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "/api";

// Fetch products from the MN Store backend
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load products.");
  }

  return data.products;
};
// Fetch one product from the MN Store backend
export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load product.");
  }

  return data.product;
};

// Login using the MN Store backend
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
};

// Fetch reviews for a product
export const getProductReviews = async (productId) => {
  const response = await fetch(`${API_URL}/reviews/${productId}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load reviews.");
  }

  return data.reviews;
};

// Submit or update a product review
export const submitReview = async (productId, rating, comment) => {
  const session = JSON.parse(
    localStorage.getItem("mn-store-session") || "null"
  );

  const token = session?.token;

  if (!token) {
    throw new Error("Please log in to submit a review.");
  }

  const response = await fetch(`${API_URL}/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, comment }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to submit review.");
  }

  return data.review;
};
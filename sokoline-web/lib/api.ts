import { Product, Review, Cart, Order, Shop, Category } from "./types";

const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app";
  // Remove trailing slash if exists, then add /api
  return `${envUrl.replace(/\/$/, "")}/api`;
};

const API_BASE_URL = getApiUrl();

async function authenticatedFetch(endpoint: string, token?: string | null, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createProduct(token: string, data: any): Promise<Product | null> {
  try {
    const response = await authenticatedFetch("/products/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}/`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

export async function getProducts(params?: Record<string, string>): Promise<Product[]> {
  try {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await fetch(`${API_BASE_URL}/products/${query}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getRelatedProducts(productId: number): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/related_products/`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error);
    return [];
  }
}

export async function getReviews(productId: number, limit = 10, offset = 0): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/?product=${productId}&limit=${limit}&offset=${offset}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data; // Handle paginated response
  } catch (error) {
    console.error(`Error fetching reviews for ${productId}:`, error);
    return [];
  }
}

// --- Authenticated Services ---

export async function fetchMyShop(token: string): Promise<Shop | null> {
  try {
    const response = await authenticatedFetch("/shops/", token);
    if (!response.ok) return null;
    const shops = await response.json();
    const shopList = shops.results || shops;
    return shopList[0] || null; 
  } catch (error) {
    console.error("Error fetching user shop:", error);
    return null;
  }
}

export async function createShop(token: string, data: Partial<Shop>): Promise<Shop | null> {
  try {
    const response = await authenticatedFetch("/shops/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error creating shop:", error);
    return null;
  }
}

export async function updateShop(token: string, shopId: number, data: Partial<Shop>): Promise<Shop | null> {
  try {
    const response = await authenticatedFetch(`/shops/${shopId}/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error updating shop:", error);
    return null;
  }
}

export async function fetchCart(token: string): Promise<Cart | null> {
  try {
    const response = await authenticatedFetch("/cart/my_cart/", token);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function addToCart(token: string, productId: number, quantity: number = 1): Promise<boolean> {
  try {
    const response = await authenticatedFetch("/cart-items/", token, {
      method: "POST",
      body: JSON.stringify({ product: productId, quantity }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
}

export async function updateCartItem(token: string, itemId: number, quantity: number): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`/cart-items/${itemId}/`, token, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return false;
  }
}

export async function removeFromCart(token: string, itemId: number): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`/cart-items/${itemId}/`, token, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return false;
  }
}

export async function checkoutCart(token: string, phoneNumber: string): Promise<Order | null> {
  try {
    const response = await authenticatedFetch("/cart/checkout/", token, {
      method: "POST",
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Checkout failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
}

export async function getOrderPaymentStatus(token: string, orderId: number): Promise<{ payment_status: string, status: string } | null> {
  try {
    const response = await authenticatedFetch(`/orders/${orderId}/payment_status/`, token);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching order payment status:", error);
    return null;
  }
}

export async function submitReview(token: string, data: { product: number, rating: number, comment: string }): Promise<Review | null> {
  try {
    const response = await authenticatedFetch("/reviews/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData[0] || errorData.detail || "Failed to submit review");
    }
    return response.json();
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}

export async function fetchOrders(token: string): Promise<Order[]> {
  try {
    const response = await authenticatedFetch("/orders/", token);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function fetchShopOrders(token: string): Promise<Order[]> {
  try {
    const response = await authenticatedFetch("/orders/shop_orders/", token);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    return [];
  }
}

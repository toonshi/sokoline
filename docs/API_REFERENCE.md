# Sokoline API Reference

This document provides a detailed list of all available endpoints in the Sokoline Backend and their authentication requirements.

## 🔑 Authentication
- **Method**: Bearer Token (JWT from Clerk)
- **Header**: `Authorization: Bearer <your_clerk_token>`
- **JWT Template**: `django-backend`

---

## 👤 Users
Endpoints for managing user profiles and identity.

### `GET /api/users/me/`
- **Description**: Returns the currently authenticated user's profile.
- **Access**: `IsAuthenticated` (Requires Bearer Token)

---

## 📦 Products & PDP
The inventory items for sale.

### `GET /api/products/`
- **Description**: List all products across all shops.
- **Query Params**: `?category=slug`, `?shop=slug`
- **Response**: Returns rich objects including `slug`, `variants`, `images`, `tags`, and `average_rating`.

### `GET /api/products/{id}/related_products/`
- **Description**: Returns 4 recommended products based on shared category and tags.
- **Access**: `AllowAny`

### `GET /api/tags/`
- **Description**: List all available product tags.
- **Access**: `AllowAny`

---

## ⭐ Reviews
Customer feedback system.

### `GET /api/reviews/`
- **Description**: List all reviews across the marketplace.
- **Query Params**: `?product=id`
- **Pagination**: Offset-based (`?limit=10&offset=0`)
- **Access**: `AllowAny`

### `POST /api/reviews/`
- **Description**: Create a review for a product.
- **Access**: `IsAuthenticated` (One review per user per product)
- **Body**: `{ "product": 1, "rating": 5, "comment": "Great product!" }`

---

## 🛒 Shopping Cart
Manage your personal cart.

### `GET /api/cart/my_cart/`
- **Description**: Retrieves the authenticated user's active cart.
- **Access**: `IsAuthenticated`

### `POST /api/cart/checkout/`
- **Description**: Converts the current cart into a formal Order and clears the cart.
- **Access**: `IsAuthenticated`

---

## 🏪 Shops
The core entities representing vendors.

### `GET /api/shops/`
- **Description**: List all shops in the marketplace.

---

## 🧾 Orders
Review purchase history.

### `GET /api/orders/`
- **Description**: List all previous orders for the authenticated user.
- **Access**: `IsAuthenticated`

---
*Last Updated: April 18, 2026 (Post-PDP Architecture Upgrade)*

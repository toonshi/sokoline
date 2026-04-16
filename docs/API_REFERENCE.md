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
- **Response**:
  ```json
  {
    "id": 1,
    "username": "user_id_from_clerk",
    "email": "user@example.com",
    "first_name": "Mike",
    "last_name": "Agoya"
  }
  ```

---

## 🏪 Shops
The core entities representing vendors.

### `GET /api/shops/`
- **Description**: List all shops in the marketplace.
- **Access**: `AllowAny` (Public)

### `POST /api/shops/`
- **Description**: Create a new shop for the authenticated user.
- **Access**: `IsAuthenticated`
- **Body**: `{ "name": "My Shop", "description": "Short bio..." }`

---

## 📦 Products
The inventory items for sale.

### `GET /api/products/`
- **Description**: List all products across all shops.
- **Access**: `AllowAny` (Public)

### `POST /api/products/`
- **Description**: Add a product to your own shop.
- **Access**: `IsAuthenticated` (Must own the specified shop)
- **Body**: `{ "name": "Shirt", "price": 20.00, "shop": 1, "category": 1 }`

---

## 🛒 Shopping Cart
Manage your personal cart.

### `GET /api/cart/my_cart/`
- **Description**: Retrieves the authenticated user's active cart.
- **Access**: `IsAuthenticated`

### `POST /api/cart/checkout/`
- **Description**: Converts the current cart into a formal Order and clears the cart.
- **Access**: `IsAuthenticated`
- **Returns**: The created `Order` object.

---

## 🧾 Orders
Review purchase history.

### `GET /api/orders/`
- **Description**: List all previous orders for the authenticated user.
- **Access**: `IsAuthenticated`

---
*Last Updated: April 16, 2026*

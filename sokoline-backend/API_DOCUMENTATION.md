# Sokoline API Documentation

Welcome to the Sokoline API. This is a headless RESTful backend designed for student-run e-commerce platforms.

## Data Models and Relationships

The system is built on a relational database with the following core entities:

### 1. User
- **Source**: Django Auth User
- **Role**: Can be a Shop Owner (Seller) or a Shopper (Buyer).
- **Relationships**:
  - One-to-Many with **Shop** (One user can own multiple shops).
  - One-to-One with **Cart** (Each user has exactly one active shopping cart).

### 2. Shop
- **Fields**: `name`, `description`, `owner`, `logo`, `slug`.
- **Relationships**:
  - Many-to-One with **User** (The owner).
  - One-to-Many with **Product** (A shop contains many products).

### 3. Product
- **Fields**: `name`, `description`, `price`, `stock`, `image`.
- **Relationships**:
  - Many-to-One with **Shop** (Belongs to a specific shop).
  - Many-to-One with **Category** (Optional categorization).

### 4. Category
- **Fields**: `name`, `slug`.
- **Relationships**:
  - One-to-Many with **Product**.

### 5. Shopping Cart
- **Entities**: `Cart` (the container) and `CartItem` (the items inside).
- **Relationships**:
  - **Cart** is One-to-One with **User**.
  - **CartItem** is Many-to-One with **Cart** and Many-to-One with **Product**.

---

## Authentication and Security

The API uses **JSON Web Tokens (JWT)** for authentication.

### 1. Obtain Token (Login)
To access protected endpoints, you must first obtain an `access` token.

- **Endpoint**: POST /api/token/
- **Payload**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
- **Response**:
```json
{
  "refresh": "eyJhbG...",
  "access": "eyJhbG..."
}
```

### 2. Use the Token
Include the access token in the `Authorization` header of your requests:
`Authorization: Bearer your_access_token`

### 3. Refresh Token
When the access token expires, use the refresh token to get a new one.

- **Endpoint**: POST /api/token/refresh/
- **Payload**: `{"refresh": "your_refresh_token"}`

---

## User Management

### 1. Register a New Student Account
Create a new student entrepreneur account. This is an open endpoint (no login required).

- **Endpoint**: POST /api/users/
- **Payload**:
```json
{
  "username": "student_name",
  "password": "secure_password123",
  "email": "student@university.edu",
  "first_name": "First",
  "last_name": "Last"
}
```
- **Success (201 Created)**: Returns the user object (excluding password).
- **Security**: GET, PUT, and DELETE are disabled on this endpoint for privacy.

---

## Shop Management

### 1. List All Shops
Browse all available shops on campus.

- **Endpoint**: GET /api/shops/
- **Auth**: Not Required (Public)

### 2. Create a Shop
Start a new business. The logged-in user automatically becomes the owner.

- **Endpoint**: POST /api/shops/
- **Payload**:
```json
{
  "name": "Campus Threads",
  "description": "Custom university apparel."
}
```
- **Note**: The slug is automatically generated from the name (e.g., campus-threads).

---

## Product Management

### 1. List All Products
View every product available across all shops.

- **Endpoint**: GET /api/products/
- **Auth**: Not Required (Public)
- **Query Parameters**:
  - `search`: Keyword search across `name` and `description` (e.g., `/api/products/?search=hoodie`).
  - `category`: Filter by category ID (e.g., `/api/products/?category=2`).
  - `shop`: Filter by shop ID (e.g., `/api/products/?shop=1`).
  - `ordering`: Sort by price or date (e.g., `/api/products/?ordering=-price` for descending order).

### 2. Add a Product to Your Shop
List a new item for sale. Only the shop owner can add products.

- **Endpoint**: POST /api/products/
- **Payload**:
```json
{
  "name": "University Hoodie",
  "description": "A warm and comfy hoodie.",
  "price": "45.00",
  "shop": 2,
  "stock": 100,
  "category": null
}
```
- **Validation**: If the shop ID does not belong to you, the API will return 403 Forbidden.

---

## Categories

### 1. List Categories
Retrieve categories to filter products.

- **Endpoint**: GET /api/categories/
- **Auth**: Not Required (Public)

---

## Shopping Cart

### 1. View My Cart
Retrieve the current user's shopping cart and its total price.

- **Endpoint**: GET /api/cart/my_cart/
- **Auth**: Required

### 2. Add Item to Cart
Add a specific product to the cart. If the item exists, the quantity will be increased.

- **Endpoint**: POST /api/cart-items/
- **Payload**:
```json
{
  "product": 1,
  "quantity": 2
}
```

### 3. Update Item Quantity
Change the quantity of an item already in the cart.

- **Endpoint**: PATCH /api/cart-items/<item_id>/
- **Payload**:
```json
{
  "quantity": 5
}
```

### 4. Remove Item from Cart
Delete a specific item from the cart.

- **Endpoint**: DELETE /api/cart-items/<item_id>/

---

## Orders and Checkout

### 1. Checkout
Convert your current shopping cart into a permanent order. This will clear your cart.

- **Endpoint**: POST /api/cart/checkout/
- **Auth**: Required
- **Success (201 Created)**: Returns the newly created order object with all items and total price.

### 2. View Order History
Retrieve a list of all your previous orders.

- **Endpoint**: GET /api/orders/
- **Auth**: Required

---

## Technical Recommendations for Frontend Integration

1.  **Slugs for Routing**: Use the slug field from the Shop or Category response to build SEO-friendly URLs (e.g., /shop/jessies-jewelry).
2.  **Asset Handling**: Shop logos and product images are served via the /media/ path. Ensure the frontend handles null values for these fields.
3.  **Data Precision**: Prices are returned as strings (e.g., "15.00") to maintain decimal precision. Convert them to appropriate numeric types in the UI layer.

---

## User Journeys & Frontend Integration

This backend is designed as a "headless" service for a Next.js frontend. The following journeys define the core integration points.

### 1. Journey A: Onboarding & Auth
*   **Next.js Role**: Handling Clerk/JWT sessions and syncing user profiles.
*   **Key Endpoints**: `POST /api/token/`, `GET /api/users/me/`.
*   **Best Practice**: Store tokens in `HttpOnly` cookies and use `refresh` tokens to maintain long-lived student sessions.

### 2. Journey B: The Buyer Journey (Browse & Buy)
*   **Next.js Role**: Dynamic product grids, search, and a persistent cart UI.
*   **Key Endpoints**:
    *   `GET /api/products/` (with query params for search/filter).
    *   `GET /api/cart/my_cart/` (for navbar cart counts).
    *   `POST /api/cart/checkout/` (atomic conversion of cart to order).
*   **Best Practice**: Use `SWR` or `React Query` for the product feed to ensure fast, cached browsing.

### 3. Journey C: The Seller Journey (Merchant Dashboard)
*   **Next.js Role**: Protected `/dashboard` area for shop management.
*   **Key Endpoints**:
    *   `POST /api/shops/` (create vendor profile).
    *   `POST /api/products/` (inventory management).
*   **Best Practice**: Utilize the `slug` fields for SEO-friendly, shareable shop links (e.g., `/shop/campus-threads`).

---

## Technical Specifications for Frontend Developers

| Feature | Requirement |
| :--- | :--- |
| **CORS** | Ensure `CORS_ALLOWED_ORIGINS` in `settings.py` matches your production Next.js domain. |
| **Images** | Served via **DigitalOcean Spaces**. Add the Spaces domain to `images.remotePatterns` in `next.config.js`. |
| **Price Data** | Prices are returned as **Strings** (e.g., `"19.99"`) to maintain decimal precision. |
| **Atomicity** | The `checkout` endpoint is a single atomic transaction. It either succeeds fully or rolls back. |

---

## Deployment & Environment Configuration

The backend is optimized for deployment on platforms like **DigitalOcean App Platform** or **Heroku**. It uses a robust environment variable parsing system to handle platform-specific quirks (like quoted strings or missing URL schemes).

### 1. Database Configuration
The system attempts to connect to the database in two stages:

**Primary (Individual Variables):** Recommended for DigitalOcean.
- `DB_HOST`: The database hostname.
- `DB_PORT`: Database port (defaults to `25060` for DO).
- `DB_DATABASE`: The database name (e.g., `defaultdb`).
- `DB_USERNAME`: Database user.
- `DB_PASSWORD`: Database password.

**Fallback (Connection String):**
- `DATABASE_URL` or `DB_CONNECTION_STRING`: A standard URI (e.g., `postgresql://user:pass@host:port/db`).

### 2. Robust Parsing Logic
To prevent deployment failures, the application implements **Robust Variable Sanitation**:
- **Quote Stripping**: Automatically removes leading/trailing single (`'`) or double (`"`) quotes from environment variables.
- **Scheme Validation**: Validates that connection strings start with `postgres://` or `postgresql://`.
- **Build-time Fallback**: If no valid PostgreSQL configuration is found, the app falls back to an internal **SQLite** instance. This allows `collectstatic` and build-phase checks to pass even before the database is attached.

### 3. Essential Variables
| Key | Required | Description |
| :--- | :--- | :--- |
| `DEBUG` | Yes | Set to `False` in production. |
| `SECRET_KEY` | Yes | A unique, secret string for cryptographic signing. |
| `CLERK_JWKS_URL` | Yes | Your Clerk instance JWKS endpoint for Auth validation. |
| `ALLOWED_HOSTS` | Yes | Comma-separated list of your app's domains. |
| `USE_LOCAL_DB` | No | Set to `True` to force **SQLite** for local development (bypasses remote DB connection timeouts). |

---

*Last Updated: April 16, 2026*

# Carts & Checkout

This domain handles the transaction loop where students convert cart items into orders.

## 🛒 Cart Management
- **State**: Managed via a global React Context (`CartProvider.tsx`).
- **Persistence**: Operations (`addItem`, `removeItem`, `updateQuantity`) are synced to the Django backend (`/api/cart-items/`) using Clerk tokens.
- **Sync**: The UI updates and then refreshes the backend state to ensure data consistency.

## 💳 Checkout Process
- **Endpoint**: `POST /api/cart/checkout/`
- **Execution**:
  1. Frontend submits a checkout request.
  2. Backend executes an atomic transaction.
  3. An `Order` is created with current pricing.
  4. The user's `Cart` is cleared.
- **Outcome**: The user is redirected to the `/orders` page.

## 🧾 Order History
- **Access**: Private to the authenticated user.
- **Features**: Includes order ID, purchase date, status, and itemized list.

---
*Last Updated: April 18, 2026*

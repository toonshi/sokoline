# Domain: Carts & Checkout

This domain handles the critical transaction loop where students turn their selections into orders. It uses a synchronous state architecture to ensure data integrity.

## 🛒 Global Cart Management
- **Provider**: `components/providers/CartProvider.tsx`
- **State**: Centralized in React Context. 
- **Persistence**: Every change (`addItem`, `removeItem`, `updateQuantity`) is instantly synced to the Django backend (`/api/cart-items/`) using the user's authenticated Clerk token.
- **Optimistic Updates**: The UI responds immediately to user actions, refreshing the backend state in the background for a snappy "rebellious" feel.

## 💳 Checkout Logic
- **Endpoint**: `POST /api/cart/checkout/`
- **Process**:
  1. Frontend sends a checkout request.
  2. Backend starts an **Atomic Transaction**.
  3. A new `Order` is created with a snapshot of the current product prices.
  4. `OrderItem` entries are created for every item in the cart.
  5. The `Cart` is cleared.
  6. The transaction is committed.
- **Outcome**: The user is redirected to `/orders` once the order is finalized.

## 🧾 Order History
- **Access**: Private to the authenticated student.
- **Data**: Orders include ID, date, status (`PENDING`, `COMPLETED`, `CANCELLED`), and a list of purchased items.
- **Invoices**: Support for downloadable invoices is scaffolded for future implementation.

---
*Last Updated: April 18, 2026*

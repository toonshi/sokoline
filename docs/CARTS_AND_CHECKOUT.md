# Domain: Carts & Checkout

This domain handles the transition from browsing to buying.

## 🛒 Shopping Cart
- **Model**: `Cart` & `CartItem`
- **Owner**: Each `User` has one `Cart`.
- **Function**: Persistently stores products the user intends to purchase.
- **Rules**:
  - `IsAuthenticated`: Creating and editing your cart.

## 💳 Checkout & Orders
- **Model**: `Order` & `OrderItem`
- **Checkout Process**:
  1. User hits `POST /api/carts/checkout/`.
  2. Django validates the cart items.
  3. A new `Order` is created, and the `Cart` is cleared.
- **Rules**:
  - `IsAuthenticated`: Can only check out your own cart.

## 🧪 Testing the Domain
### Backend
- `CartViewSet`: Endpoint for `my_cart/` and `checkout/`.
- `OrderViewSet`: Read-only access to user orders.

---
*Last Updated: April 16, 2026*

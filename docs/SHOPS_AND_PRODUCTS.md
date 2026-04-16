# Domain: Shops & Products

This domain handles the core structure of the marketplace: Vendors (Shops) and their Inventory (Products).

## 🏪 Shops
- **Model**: `Shop`
- **Owner**: Linked to a Django `User`.
- **Function**: Users can create their own shops and manage their inventory.
- **Rules**:
  - `AllowAny`: Browsing shops.
  - `IsAuthenticated`: Creating and editing your own shop.

## 📦 Products
- **Model**: `Product`
- **Shop**: Each product belongs to a specific `Shop`.
- **Category**: Products are organized by `Category`.
- **Function**: Vendors add products to their shops; customers browse and buy.
- **Rules**:
  - `AllowAny`: Browsing products and categories.
  - `IsAuthenticated`: Only the shop owner can add/edit products for their shop.

## 🧪 Testing the Domain
### Backend
- `ShopViewSet`: CRUD operations for shops.
- `ProductViewSet`: CRUD operations for products (enforces shop ownership).

### Frontend
- Product listing pages (PLP).
- Product details pages (PDP).
- Shop dashboards for vendors.

---
*Last Updated: April 16, 2026*

# Domain: Shops & Products (PDP Upgrade)

This domain handles the core structure of the marketplace: Vendors (Shops) and their multi-variant Inventory (Products).

## 🏪 Shops
- **Model**: `Shop`
- **SEO**: Every shop has a unique `slug` (e.g. `api.sokoline.app/api/shops/tech-gadgets/`).
- **Owner**: Linked to a Django `User`.

## 📦 Products & Variants
- **Model**: `Product`
- **Variants**: Supports multiple `ProductVariant` objects per product (e.g. Red Shirt, Blue Shirt).
- **SEO**: Uses auto-generated unique slugs from product names.
- **Images**: Supports `ProductImage` sets with a dedicated `is_feature` flag.
- **Attributes**:
    - `shipping_info`: Dedicated details for frontend shipping tabs.
    - `return_policy`: Dedicated details for frontend returns tabs.
    - `discount_price`: Supports sales and promotion logic.

## ⭐ Social Proof (Reviews)
- **Model**: `Review`
- **Logic**: Users can leave one review per product. Ratings are aggregated on the Product object as `average_rating`.
- **Pagination**: The API supports offset-based pagination to handle "Load More" logic on the frontend.

## 🏷️ Discovery (Tags)
- **Model**: `Tag`
- **Recommendation Engine**: The `related_products` action on the Product ViewSet uses shared tags and categories to suggest similar items to users.

---
*Last Updated: April 18, 2026 (Post-PDP Architecture Upgrade)*

# Sokoline Implementation Journeys

This document details the 5 technical journeys implemented to transform Sokoline into a reliable, campus-ready commerce platform.

## 1. The Transaction Journey (M-Pesa)
**Objective:** Replace mock checkout with real financial plumbing via Safaricom Daraja.

### Technical Implementation
- **Daraja Client:** Located in `sokoline-backend/shops/daraja.py`. Handles OAuth2 token generation and STK Push requests.
- **Polling System:** The frontend (`app/checkout/page.tsx`) uses a 3-second interval to hit `/api/orders/<id>/payment_status/`.
- **Callback Webhook:** `shops/payment_views.py` handles the unauthenticated POST from Safaricom to update order status and save the M-Pesa Receipt Number.

## 2. The Vendor Launch Journey (Seller Flow)
**Objective:** Enable student founders to manage their business professionally.

### Key Components
- **Add Product Form:** A multi-section, corporate-style form in `app/dashboard/products/new`.
- **Inventory Management:** A dense, Shopify-style table in `app/dashboard/products` with "Active/Draft" status badges.
- **Security:** Backend `ProductViewSet` enforces ownership; users can only modify products belonging to their shop.

## 3. The Deep Search Journey
**Objective:** Make product discovery instant and reliable.

### Implementation
- **Backend:** Integrated `SearchFilter` in Django Rest Framework to query `name`, `description`, `category`, and `tags`.
- **Frontend:** A persistent, integrated search bar in the `Navbar`.
- **Dynamic Routing:** The products page uses Next.js `searchParams` to re-fetch data based on the query.

## 4. The Post-Purchase Engagement Journey
**Objective:** Build trust through verified student reviews.

### Rules & Logic
- **Purchase Verification:** The backend `ReviewViewSet` verifies that a user has a `COMPLETED` order containing the specific product before allowing a review.
- **Interactive UI:** A clean `ReviewModal` with a 5-star rating system and neutral typography.

## 5. The Interactive Support Journey (AI)
**Objective:** Provide 24/7 campus shopping assistance.

### AI Stack
- **Engine:** Google Gemini 1.5 Pro via Vercel AI SDK 6.x.
- **Tools:** The AI has a `searchProducts` tool. It can query the Django API and return mini-product cards directly in the chat.
- **Style:** A professional Zendesk-style support widget in the bottom right corner.

---

## UI/UX: Corporate Reliability Refactor
The entire platform was refactored to follow an **Institutional Reliability** aesthetic (Shopify/Stripe style):
- **Typography:** Sentence case, `font-medium/semibold`, standard tracking.
- **Geometry:** `rounded-lg` (12px) for cards/modals, `rounded-md` (8px) for buttons/inputs.
- **Palette:** `bg-zinc-50` backgrounds with subtle `zinc-200` borders. No glows, no emojis, no playful animations.

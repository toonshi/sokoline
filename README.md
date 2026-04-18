# Sokoline: Modern Marketplace 🚀

Sokoline is a high-end, full-stack marketplace built for **student entrepreneurs**. It balances minimalist utility with the raw energy of the campus ecosystem.

## 🏗️ Project Architecture
The project is split into two primary components:
- **`sokoline-backend`**: A Django 6 (DRF) powerhouse. Upgraded for "Production Grade" reliability with support for multi-variant products, automated SEO slugs, and relational discovery.
- **`sokoline-web`**: A Next.js 16 (App Router) frontend. Built with **Space Grotesque** typography and a **Rebellious Purple** aesthetic. Features a global synchronous cart and a professional vendor dashboard.

## 🎨 Design Language: "Minimalist x Rebellious"
- **Typography**: Space Grotesque (Geometric & Edge).
- **Palette**: Near-Black (#1A1A1A) on Pure White (#FFFFFF) with a Digital Violet (#7C3AED) accent.
- **Vibe**: Reliable and professional, but built strictly for the new generation of founders.

## 🚀 Key User Journeys
### The Buyer Loop (Complete ✅)
- **Discovery**: SEO-friendly product browsing by slug.
- **Selection**: Dynamic variant selection (color/size) with stock tracking.
- **Cart**: Synchronous `CartProvider` ensuring bag state matches the backend in real-time.
- **Checkout**: Atomic transaction handling from Cart -> Order.

### The Seller Loop (In Progress 🏗️)
- **Dashboard**: Professional vendor portal with sales analytics and health insights.
- **Inventory**: High-end data table for managing student ventures.
- **Venture Settings**: Brand management (Logo, Bio, SEO URL).

## 🛠️ Technical Stack
- **Frontend**: Next.js 16, Framer Motion, Tailwind 4, Clerk Auth, Vitest.
- **Backend**: Django 6, DRF, PostgreSQL (Production) / SQLite (Local), Whitenoise.
- **Auth**: Clerk (Keyless mode enabled for rapid local dev).

## 📖 Detailed Documentation
- [API Reference](./docs/API_REFERENCE.md) - All endpoints and auth requirements.
- [Authentication](./docs/AUTHENTICATION.md) - Clerk handshake and JWT logic.
- [Shops & Products](./docs/SHOPS_AND_PRODUCTS.md) - Multi-variant architecture and SEO logic.
- [Carts & Checkout](./docs/CARTS_AND_CHECKOUT.md) - Synchronous state management.

---
*Last Updated: April 18, 2026 (Major Platform Overhaul)*

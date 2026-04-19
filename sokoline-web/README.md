# Sokoline Frontend ⚡

This is the Next.js frontend for the Sokoline marketplace, built for student entrepreneurs and student ventures.

## 🚀 Features
- **Shopping Cart**: Synchronous system that persists to the Django backend.
- **Product Pages**: Support for variants (color/size) and student reviews.
- **Vendor Dashboard**: Private area for sellers to manage their shop profile and inventory.
- **Search Optimization**: Slug-based routing for all products and shops.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Auth**: Clerk (Integrated via `proxy.ts`)
- **Testing**: Vitest

## 🚦 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment
Add your Clerk keys to `.env.local`:
```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_API_URL=https://api.sokoline.app/api
```

### 3. Run
```bash
npm run dev
```

---
*Marketplace for student ventures.*

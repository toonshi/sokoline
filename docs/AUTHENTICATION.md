# Domain: Authentication & User Sync

Sokoline uses **Clerk** for identity management, integrated via a specialized `proxy.ts` architecture for Next.js 16 and a custom JWT-backend for Django.

## 🚀 The Handshake
1. **Frontend (Next.js)**: Obtains a short-lived (60s) JWT token from Clerk using `useAuth().getToken()`.
2. **Authorization**: This token is injected into the `Authorization: Bearer <token>` header for all API calls in `lib/api.ts`.
3. **Backend (Django)**: 
   - `sokoline.authentication.ClerkAuthentication` intercepts the token.
   - It validates the token against your Clerk JWKS endpoint.
   - If valid, it retrieves or creates the user in the Django database.

## 🛠️ Middleware Strategy (`proxy.ts`)
Unlike standard Next.js projects using `middleware.ts`, Sokoline uses **`proxy.ts`** to handle Clerk's authentication logic. This is optimized for Node.js runtimes and prevents the common "Infinite Redirect Loop" by explicitly managing session refreshes.

## 🔑 Development Modes
- **Keyless Mode**: Enabled by default for local development. Clerk auto-generates a temporary instance in the `.clerk/` directory (DO NOT COMMIT).
- **Production Mode**: Uses `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` pointing to the official `needed-wahoo-23` instance.

## 🛡️ Security Rules
- **Public Routes**: `/api/products/`, `/api/shops/`, `/api/tags/`.
- **Protected Routes**: `/api/cart/`, `/api/orders/`, and all `POST/PATCH/DELETE` actions on inventory.
- **Ownership**: The backend strictly validates that users can only edit products belonging to a `Shop` they personally own.

---
*Last Updated: April 18, 2026*

# Authentication & User Sync

Sokoline uses **Clerk** for identity management, integrated via a specialized `proxy.ts` architecture for Next.js 16 and a custom JWT-backend for Django.

## 🚀 The Handshake
1. **Frontend**: Obtains a short-lived JWT token from Clerk using `useAuth().getToken()`.
2. **Authorization**: Token is sent in the `Authorization: Bearer <token>` header for all authenticated API calls.
3. **Backend**: 
   - `sokoline.authentication.ClerkAuthentication` validates the token against the Clerk JWKS endpoint.
   - It retrieves or creates the user in the Django database.

## 🛠️ Middleware Strategy (`proxy.ts`)
Sokoline uses **`proxy.ts`** to handle Clerk's authentication logic. This is optimized for Node.js runtimes and manages session refreshes explicitly.

## 🔑 Development
- **Keyless Mode**: Used for rapid local development.
- **Production Mode**: Uses the official Clerk instance keys.

## 🛡️ Permissions
- **Public**: Browsing products and shops.
- **Protected**: Cart management, orders, and shop inventory management.
- **Ownership**: Sellers can only modify products belonging to their own Shop.

---
*Last Updated: April 18, 2026*

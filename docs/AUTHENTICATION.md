# Domain: Authentication & User Sync

This domain handles the integration with **Clerk** (Next.js) and the **Django Backend** using JWT (JSON Web Tokens).

## 🚀 The Handshake
- **Frontend (Next.js)**: Obtains a short-lived (60s) JWT token using `getToken({ template: 'django-backend' })`.
- **Backend (Django)**: Intercepts the token, verifies it against Clerk's **JWKS endpoint**, and extracts user claims.

## ⚙️ Configuration
- **Provider**: Clerk
- **Method**: RS256 JWT
- **JWKS URL**: `https://needed-wahoo-23.clerk.accounts.dev/.well-known/jwks.json`
- **Django Auth Class**: `sokoline.authentication.ClerkAuthentication`

## 📦 Data Sync (Clerk -> Django)
On every authenticated request, the backend automatically syncs the following from the Clerk JWT:
- `sub` (Clerk ID) -> `User.username`
- `email` -> `User.email`
- `first_name` -> `User.first_name`
- `last_name` -> `User.last_name`

## 🧪 Testing the Domain
### Frontend Manual Test
1. Go to `http://localhost:3000/test`.
2. Click **"Verify with Django Backend"**.
3. Success: A JSON response with your profile data is returned from Django.

### Backend Automated Tests
- `sokoline.authentication.ClerkAuthentication`: Verifies token signature and expiration.
- `UserViewSet.me`: Returns the current authenticated user's profile.

---
*Last Updated: April 16, 2026*

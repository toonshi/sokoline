# Sokoline: Modern Marketplace 🚀

Sokoline is a full-stack marketplace built with **Next.js 16 (App Router)** and **Django 6 (DRF)**.

## 🏗️ Project Architecture
The project is split into two main components:
- **`sokoline-backend/`**: Django REST Framework API with PostgreSQL.
- **`sokoline-web/`**: Next.js frontend with Tailwind CSS and Clerk Auth.

## 🔐 Authentication (Clerk Integration)
Sokoline uses **Clerk** for session management and user identity.

### ⚙️ Setup
1. **Frontend**: The `sokoline-web` app uses `@clerk/nextjs` for the UI.
2. **Backend**: The `sokoline-backend` app uses a custom `ClerkAuthentication` class to verify JWT tokens.
3. **Data Sync**: Clerk ID, Email, and Name are automatically synced to the Django `User` table on every request.

**JWT Template Config:**
In the Clerk Dashboard, create a `django-backend` template with these claims:
```json
{
  "email": "{{user.primary_email_address}}",
  "first_name": "{{user.first_name}}",
  "last_name": "{{user.last_name}}"
}
```

## 📂 Domain Documentation
For detailed information on each system domain, see:
- [Authentication & User Sync](docs/AUTHENTICATION.md)
- [Shops & Products](docs/SHOPS_AND_PRODUCTS.md)
- [Carts & Checkout](docs/CARTS_AND_CHECKOUT.md)

## 🛠️ Getting Started
### Prerequisites
- Python 3.12+
- Node.js 20+

### Setup Backend
```bash
cd sokoline-backend
source env/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### Setup Frontend
```bash
cd sokoline-web
npm install
npm run dev
```

---
*Created with ❤️ for Sokoline*

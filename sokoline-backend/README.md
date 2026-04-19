# Sokoline API (Production Grade) 🚀

Sokoline is a high-performance RESTful API designed to empower student entrepreneurs. It provides the robust backbone for multi-vendor storefronts, secure campus transactions, and relational product discovery.

## 🛠️ Tech Stack
- **Framework**: Django 6.0 + Django REST Framework (DRF)
- **Database**: PostgreSQL (Production) / SQLite (Local)
- **Auth**: Clerk JWT Integration
- **Storage**: DigitalOcean Spaces (S3 Compatible)
- **Deployment**: DigitalOcean App Platform

## 💎 Architectural Upgrades (April 2026)
This backend has been recently upgraded from a basic CRUD skeleton to a professional e-commerce engine:
- **Product Variants**: Full support for color/size options with unique stock and images.
- **Data Hydration**: Single-object PDP responses including shipping info, return policies, and average ratings.
- **Automated SEO**: Intelligent data migrations that generate unique slugs for all products and shops.
- **Relational Discovery**: A recommendation engine using shared tags and categories.
- **Performance**: Optimized ViewSets using `select_related` and `prefetch_related` to eliminate N+1 bottlenecks.

## 🚀 Local Development

### 1. Setup Environment
```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### 2. Configure Database
By default, the backend tries to connect to PostgreSQL. To use SQLite locally, add this to your `.env`:
```text
USE_LOCAL_DB=True
```

### 3. Run Migrations & Server
```bash
python manage.py migrate
python manage.py runserver
```

## 🛡️ Production Deployment Note
**Safety First**: This project uses "Smart Migrations." When adding unique fields (like slugs), we use `RunPython` scripts to populate existing data before enforcing constraints. This prevents deployment crashes on DigitalOcean.

---
*Maintained by the Sokoline Team. Built strictly for rebels.*

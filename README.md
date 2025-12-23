# Sokoline API

Sokoline is a RESTful API backend for an e-commerce platform designed to empower student entrepreneurs on campus. It provides the necessary infrastructure for students to create their own shops, list products, and manage their business.

This backend is built using Django and the Django REST Framework.

## Features

- **Shop Management**: Create, read, update, and delete shops. Each shop is owned by a user.
- **Product Management**: Create, read, update, and delete products within a shop.
- **Category Management**: Organize products into categories.
- **Authentication**: Endpoints for creating shops and products are protected and require user authentication.
- **Permissions**: Ensures that only the owner of a shop can add products to it.

## Project Setup

### 1. Prerequisites

- Python 3.10+
- `pip`
- `venv` for creating virtual environments

### 2. Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd sokoline
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv env
    source env/bin/activate
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the database migrations:**
    ```bash
    python manage.py migrate
    ```

### 3. Running the Development Server

Once the setup is complete, you can run the development server:

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

## API Usage

### Create a Superuser

To test the authenticated endpoints, you first need a user. Create one with the following command and follow the prompts:

```bash
python manage.py createsuperuser
```

### API Endpoints

The following endpoints are available:

-   `/api/categories/`
-   `/api/shops/`
-   `/api/products/`

### Example `curl` Commands

Here are some examples of how to interact with the API using `curl`. Replace `testuser:testpassword123` with the credentials you created.

**1. Create a new category:**
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"name": "Apparel"}' http://127.0.0.1:8000/api/categories/
```

**2. Create a new shop (authentication required):**
```bash
curl -u testuser:testpassword123 -X POST -H "Content-Type: application/json" \
-d '{"name": "Campus Threads", "description": "Custom university apparel."}' \
http://127.0.0.1:8000/api/shops/
```

**3. Create a new product for a shop (authentication required):**
(Assuming the shop created above has an `id` of 2 and the category has an `id` of 2)
```bash
curl -u testuser:testpassword123 -X POST -H "Content-Type: application/json" \
-d '{"name": "University Hoodie", "description": "A warm and comfy hoodie.", "price": "45.00", "shop": 2, "category": 2, "stock": 100}' \
http://127.0.0.1:8000/api/products/
```

**4. View a specific shop and its products (authentication required):**
```bash
curl -u testuser:testpassword123 http://127.0.0.1:8000/api/shops/2/
```


#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- STEP 1: Ensuring permissions on public schema (optional) ---"
python manage.py shell -c "
from django.db import connection
import os

# Check if we are using PostgreSQL
if connection.vendor != 'postgresql':
    print(f'Database engine is {connection.vendor}, skipping permission grant.')
    exit(0)

# Try to get the user from various platform-standard variables
user = os.environ.get('DB_USERNAME') or os.environ.get('DB_USER')

if user:
    with connection.cursor() as cursor:
        try:
            print(f'Attempting to grant CREATE on public to {user}...')
            cursor.execute(f'GRANT ALL ON SCHEMA public TO \"{user}\"')
            print('GRANT successful')
        except Exception as e:
            print(f'GRANT skip/fail: {e}')
else:
    print('No DB user found in environment, skipping permission grant.')
"

echo "--- STEP 2: Running migrations ---"
python manage.py migrate

echo "--- STEP 3: Starting Gunicorn ---"
gunicorn sokoline.wsgi --bind 0.0.0.0:8080

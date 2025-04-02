#!/bin/sh

echo "Waiting for database..."
while ! nc -z db 5432; do
    sleep 1
done
echo "Database is ready!"

echo "Criando as migracoes..."
# Create migrations
python manage.py makemigrations

echo "Aplicando as migracoes..."
# Apply migrations
python manage.py migrate

# Start server
gunicorn contas_backend.wsgi:application --bind 0.0.0.0:8000
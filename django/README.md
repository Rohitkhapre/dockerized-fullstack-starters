# Python Django Docker Stack

This directory contains a production-ready, security-hardened Docker setup for Django applications with Gunicorn WSGI server.

## Features

- **Gunicorn WSGI server** for production performance
- **Non-root user** with custom user/group for security
- **Python optimization** with unbuffered output and cache removal
- **Health checks** for container monitoring
- **Security hardening** with dropped capabilities and read-only filesystem
- **Resource limits** for production deployment

## Quick Start

1. **Add your Django project** to the `app/` directory
2. **Create a `requirements.txt`** file with your dependencies
3. **Update the Dockerfile** to match your project name (replace `projectname`)
4. **Build and run** the container:

```bash
# Build the image
docker compose build

# Run the container
docker compose up

# Run in detached mode
docker compose up -d
```

Your application will be available at `http://localhost:8000`

## Directory Structure

```
django/
├── app/                 # Your Django project goes here
│   ├── requirements.txt # Required: Python dependencies
│   ├── manage.py       # Django management script
│   ├── projectname/    # Your Django project directory
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── ...             # Your Django apps
├── Dockerfile           # Production-optimized Docker configuration
├── docker-compose.yml   # Container orchestration with security settings
├── .dockerignore       # Files to exclude from Docker context
└── README.md           # This file
```

## Application Requirements

Your Django application should:

1. **Have a proper Django project structure** with `manage.py` and `wsgi.py`
2. **Include all dependencies** in `requirements.txt`
3. **Include gunicorn** in requirements.txt
4. **Update Dockerfile** with your actual project name

### Example `requirements.txt`:

```txt
Django==5.0.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
python-decouple==3.8
whitenoise==6.6.0
```

### Creating a New Django Project:

```bash
# In the app/ directory
django-admin startproject projectname .
cd projectname
python manage.py startapp myapp
```

### Example `settings.py` additions:

```python
import os
from decouple import config

# Security settings
SECRET_KEY = config('SECRET_KEY', default='your-secret-key-here')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='django_db'),
        'USER': config('DB_USER', default='django_user'),
        'PASSWORD': config('DB_PASSWORD', default='django_pass'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Middleware for static files serving
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... other middleware
]
```

## Security Features

- **Non-root execution**: Runs as `djangouser:djangogroup` (UID/GID 1000)
- **Capability dropping**: All Linux capabilities removed
- **Read-only filesystem**: Container filesystem is read-only
- **No new privileges**: Prevents privilege escalation
- **Pinned base images**: Uses specific Python version (3.12.3)
- **Strict file permissions**: Application files have 750 permissions
- **Clean environment**: Pip cache removed, minimal attack surface

## Production Configuration

### Gunicorn Settings:
- **2 workers** for handling concurrent requests
- **Bind to all interfaces** (0.0.0.0:8000)
- **Production-ready** WSGI server

### Environment Variables:
```yaml
# In docker-compose.yml
environment:
  - DJANGO_SETTINGS_MODULE=projectname.settings
  - SECRET_KEY=your-very-secret-key
  - DEBUG=False
  - DATABASE_URL=postgresql://user:pass@db:5432/django_db
```

## Database Setup

### With PostgreSQL:
```yaml
# Complete docker-compose.yml
version: '3.8'
services:
  django-app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=projectname.settings
      - DATABASE_URL=postgresql://django_user:django_pass@db:5432/django_db
    depends_on:
      - db
    cap_drop:
      - ALL
    read_only: true
    security_opt:
      - no-new-privileges:true
    tmpfs:
      - /tmp
    mem_limit: 512m
    cpus: 0.5

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: django_db
      POSTGRES_USER: django_user
      POSTGRES_PASSWORD: django_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Database Migrations:
```bash
# Run migrations
docker compose exec django-app python manage.py migrate

# Create superuser
docker compose exec django-app python manage.py createsuperuser

# Collect static files
docker compose exec django-app python manage.py collectstatic --noinput
```

## Django Apps and Models

### Example Django app structure:
```python
# models.py
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User

def health_check(request):
    return JsonResponse({'status': 'healthy', 'service': 'django-app'})

@csrf_exempt
def user_list(request):
    if request.method == 'GET':
        users = list(User.objects.values())
        return JsonResponse({'users': users})
    elif request.method == 'POST':
        # Handle POST logic
        return JsonResponse({'message': 'User created'})

# urls.py (app level)
from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health'),
    path('api/users/', views.user_list, name='user_list'),
]

# urls.py (project level)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),
]
```

## REST API with Django REST Framework

### Add to requirements.txt:
```txt
djangorestframework==3.14.0
django-cors-headers==4.3.1
```

### Example API setup:
```python
# settings.py
INSTALLED_APPS = [
    # ... default apps
    'rest_framework',
    'corsheaders',
    'myapp',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

# serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# views.py (DRF version)
from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
```

## Customization

### Update project name:
1. Replace `projectname` in Dockerfile CMD
2. Replace `projectname` in docker-compose.yml environment
3. Ensure your actual project name matches

### Change the port:
```yaml
# In docker-compose.yml
ports:
  - "8080:8000"  # External:Internal
```

### Add Redis for caching:
```yaml
# Add to docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    
  django-app:
    # ... existing config
    depends_on:
      - db
      - redis
```

```python
# Add to settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
    }
}
```

## Static Files and Media

### Production static files:
```python
# settings.py
STATIC_URL = '/static/'
STATIC_ROOT = '/app/staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = '/app/media'

# Use WhiteNoise for serving static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Collect static files:
```dockerfile
# Add to Dockerfile before USER command
RUN python manage.py collectstatic --noinput
```

## Monitoring and Logging

### Django logging configuration:
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

### Health check view:
```python
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({'status': 'healthy', 'database': 'connected'})
    except Exception as e:
        return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=500)
```

## Troubleshooting

### Migration issues:
```bash
# Check migration status
docker compose exec django-app python manage.py showmigrations

# Create new migrations
docker compose exec django-app python manage.py makemigrations

# Apply migrations
docker compose exec django-app python manage.py migrate
```

### Static files not loading:
- Ensure `STATIC_ROOT` is set correctly
- Run `collectstatic` command
- Check WhiteNoise configuration

### Database connection errors:
- Verify DATABASE_URL environment variable
- Check database service connectivity
- Ensure database user has proper permissions

### Performance optimization:
- Increase Gunicorn workers: `-w 4`
- Add database connection pooling
- Implement Redis caching
- Use database indexes on frequently queried fields

## Development vs Production

For development, consider:
- Enable DEBUG mode
- Use SQLite database
- Mount source code as volumes
- Use Django's development server instead of Gunicorn 
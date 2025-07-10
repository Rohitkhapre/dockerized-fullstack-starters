# PHP Laravel Docker Stack

Production-ready, security-hardened Docker setup for Laravel applications with PHP-FPM.

## Features

- **Multi-stage build** with Composer optimization
- **PHP-FPM** for production performance
- **Non-root user** with security hardening
- **Composer optimized** autoloader
- **Health checks** and resource limits

## Quick Start

1. Add your Laravel application to the `app/` directory
2. Ensure `composer.json` and `composer.lock` are present
3. Configure your `.env` file

```bash
docker compose build
docker compose up
```

Application available at `http://localhost:9000` (PHP-FPM)

## Application Requirements

- Laravel project with `composer.json`
- Proper `.env` configuration
- Web server setup (nginx recommended)

### Example composer.json:
```json
{
    "name": "laravel/laravel",
    "type": "project",
    "description": "The Laravel Framework.",
    "keywords": ["framework", "laravel"],
    "license": "MIT",
    "require": {
        "php": "^8.3",
        "laravel/framework": "^10.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/"
        }
    }
}
```

### Example Routes:
```php
// routes/web.php
Route::get('/', function () {
    return response()->json(['message' => 'Hello, Laravel!']);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'laravel-app',
        'timestamp' => now()->toISOString()
    ]);
});

// routes/api.php
Route::middleware('api')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
});
```

## Security Features

- Runs as `laravelusr:laravelgrp` (UID/GID 1000)
- Read-only filesystem with tmpfs
- All Linux capabilities dropped
- PHP 8.3.8-fpm-alpine3.19
- Composer cache removed

## With Nginx Web Server

### Complete Setup:
```yaml
# docker-compose.yml
version: '3.8'
services:
  laravel-app:
    build: .
    volumes:
      - ./app:/app
    environment:
      - APP_ENV=production
      - DB_CONNECTION=mysql
      - DB_HOST=db
      - DB_DATABASE=laravel
      - DB_USERNAME=laravel
      - DB_PASSWORD=secret
    depends_on:
      - db

  nginx:
    image: nginx:1.25-alpine
    ports:
      - "8080:80"
    volumes:
      - ./app:/app
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - laravel-app

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_USER: laravel
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: rootsecret
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### Nginx Configuration:
```nginx
# nginx.conf
server {
    listen 80;
    index index.php index.html;
    server_name localhost;
    root /app/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass laravel-app:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}
```

## Database Configuration

### MySQL:
```php
// config/database.php
'mysql' => [
    'driver' => 'mysql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
],
```

### PostgreSQL:
```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'schema' => 'public',
],
```

## API Development

### Controller Example:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(15);
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }
}
```

### API Routes:
```php
// routes/api.php
Route::apiResource('users', UserController::class);
Route::get('health', function() {
    return response()->json(['status' => 'healthy']);
});
```

## Environment Configuration

### .env Example:
```env
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## Artisan Commands

```bash
# Generate application key
docker compose exec laravel-app php artisan key:generate

# Run migrations
docker compose exec laravel-app php artisan migrate

# Seed database
docker compose exec laravel-app php artisan db:seed

# Clear cache
docker compose exec laravel-app php artisan cache:clear
docker compose exec laravel-app php artisan config:clear
docker compose exec laravel-app php artisan route:clear
```

## Queue Processing

### With Redis:
```yaml
# Add to docker-compose.yml
redis:
  image: redis:7-alpine

queue-worker:
  build: .
  command: php artisan queue:work
  depends_on:
    - redis
    - db
  environment:
    - QUEUE_CONNECTION=redis
```

## Customization

- PHP extensions: Add to Dockerfile
- Composer scripts: Update composer.json
- Environment variables: Configure in docker-compose.yml
- Background jobs: Add queue workers

## Troubleshooting

- Permissions: Check file ownership in /app
- Database: Verify connection and migrations
- Cache issues: Clear Laravel caches
- Logs: Check `storage/logs/laravel.log` 
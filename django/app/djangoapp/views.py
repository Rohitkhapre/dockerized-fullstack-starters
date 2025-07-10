"""
Django views for REST API endpoints
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import psutil
import platform
from datetime import datetime

# Sample data
USERS = [
    {"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin"},
    {"id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "user"},
    {"id": 3, "name": "Carol Brown", "email": "carol@example.com", "role": "user"},
    {"id": 4, "name": "David Wilson", "email": "david@example.com", "role": "manager"},
    {"id": 5, "name": "Eva Martinez", "email": "eva@example.com", "role": "user"}
]

PRODUCTS = [
    {"id": 1, "name": "Django Book", "price": 49.99, "category": "Education", "in_stock": True},
    {"id": 2, "name": "Python Laptop", "price": 899.99, "category": "Electronics", "in_stock": True},
    {"id": 3, "name": "Coding Chair", "price": 199.99, "category": "Furniture", "in_stock": False},
    {"id": 4, "name": "Web Development Course", "price": 79.99, "category": "Education", "in_stock": True}
]

def home_view(request):
    """Home endpoint with API information"""
    return JsonResponse({
        "message": "Welcome to Django Docker App! 🚀",
        "version": "1.0.0",
        "description": "A production-ready Django application running in Docker",
        "framework": "Django 5.0",
        "endpoints": {
            "health": "/health/",
            "users": "/api/users/",
            "products": "/api/products/",
            "stats": "/api/stats/"
        },
        "timestamp": datetime.now().isoformat(),
        "documentation": "Visit the endpoints above to explore the API"
    })

def health_view(request):
    """Health check endpoint"""
    try:
        # Basic health checks
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return JsonResponse({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "uptime": "Available",
            "system": {
                "platform": platform.system(),
                "python_version": platform.python_version(),
                "memory_usage": f"{memory.percent}%",
                "disk_usage": f"{disk.percent}%"
            },
            "database": "Not configured (using in-memory data)",
            "cache": "Not configured"
        })
    except Exception as e:
        return JsonResponse({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }, status=500)

def users_list_view(request):
    """Get all users with optional filtering"""
    role = request.GET.get('role')
    limit = request.GET.get('limit')
    
    filtered_users = USERS
    
    # Filter by role
    if role:
        filtered_users = [user for user in filtered_users if user['role'].lower() == role.lower()]
    
    # Apply limit
    if limit:
        try:
            limit = int(limit)
            filtered_users = filtered_users[:limit]
        except ValueError:
            pass
    
    return JsonResponse({
        "success": True,
        "count": len(filtered_users),
        "data": filtered_users,
        "filters": {
            "role": role,
            "limit": limit
        }
    })

def user_detail_view(request, user_id):
    """Get a specific user by ID"""
    try:
        user_id = int(user_id)
        user = next((user for user in USERS if user['id'] == user_id), None)
        
        if user:
            return JsonResponse({
                "success": True,
                "data": user
            })
        else:
            return JsonResponse({
                "success": False,
                "message": "User not found"
            }, status=404)
    except ValueError:
        return JsonResponse({
            "success": False,
            "message": "Invalid user ID"
        }, status=400)

def products_list_view(request):
    """Get all products with optional filtering"""
    category = request.GET.get('category')
    in_stock_only = request.GET.get('in_stock') == 'true'
    
    filtered_products = PRODUCTS
    
    # Filter by category
    if category:
        filtered_products = [p for p in filtered_products if p['category'].lower() == category.lower()]
    
    # Filter by stock status
    if in_stock_only:
        filtered_products = [p for p in filtered_products if p['in_stock']]
    
    return JsonResponse({
        "success": True,
        "count": len(filtered_products),
        "data": filtered_products,
        "filters": {
            "category": category,
            "in_stock_only": in_stock_only
        }
    })

def stats_view(request):
    """Get application statistics"""
    try:
        # System stats
        memory = psutil.virtual_memory()
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Data stats
        user_roles = {}
        for user in USERS:
            role = user['role']
            user_roles[role] = user_roles.get(role, 0) + 1
        
        product_categories = {}
        products_in_stock = 0
        for product in PRODUCTS:
            category = product['category']
            product_categories[category] = product_categories.get(category, 0) + 1
            if product['in_stock']:
                products_in_stock += 1
        
        return JsonResponse({
            "success": True,
            "data": {
                "users": {
                    "total": len(USERS),
                    "by_role": user_roles
                },
                "products": {
                    "total": len(PRODUCTS),
                    "in_stock": products_in_stock,
                    "by_category": product_categories
                },
                "system": {
                    "memory_usage": f"{memory.percent}%",
                    "cpu_usage": f"{cpu_percent}%",
                    "platform": platform.system(),
                    "python_version": platform.python_version(),
                    "django_version": "5.0"
                }
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": "Error generating stats",
            "error": str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_user_view(request):
    """Create a new user (example POST endpoint)"""
    try:
        data = json.loads(request.body)
        
        # Basic validation
        required_fields = ['name', 'email', 'role']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    "success": False,
                    "message": f"Missing required field: {field}"
                }, status=400)
        
        # Create new user
        new_id = max(user['id'] for user in USERS) + 1
        new_user = {
            "id": new_id,
            "name": data['name'],
            "email": data['email'],
            "role": data['role']
        }
        
        USERS.append(new_user)
        
        return JsonResponse({
            "success": True,
            "message": "User created successfully",
            "data": new_user
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "message": "Invalid JSON data"
        }, status=400)
    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": "Error creating user",
            "error": str(e)
        }, status=500) 
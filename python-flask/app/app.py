from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import psutil

app = Flask(__name__)
CORS(app)

# Sample data
users = [
    {"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin"},
    {"id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "user"},
    {"id": 3, "name": "Carol Brown", "email": "carol@example.com", "role": "user"},
    {"id": 4, "name": "David Wilson", "email": "david@example.com", "role": "moderator"}
]

products = [
    {"id": 1, "name": "Laptop", "price": 999.99, "category": "Electronics", "inStock": True},
    {"id": 2, "name": "Book", "price": 19.99, "category": "Education", "inStock": True},
    {"id": 3, "name": "Chair", "price": 149.99, "category": "Furniture", "inStock": False},
    {"id": 4, "name": "Phone", "price": 699.99, "category": "Electronics", "inStock": True}
]

orders = [
    {"id": 1, "userId": 1, "productId": 1, "quantity": 1, "total": 999.99, "status": "completed"},
    {"id": 2, "userId": 2, "productId": 2, "quantity": 2, "total": 39.98, "status": "pending"},
    {"id": 3, "userId": 1, "productId": 4, "quantity": 1, "total": 699.99, "status": "completed"}
]

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for container monitoring"""
    try:
        memory_info = psutil.virtual_memory()
        return jsonify({
            "status": "healthy",
            "service": "flask-docker-app",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "environment": os.getenv('FLASK_ENV', 'production'),
            "system": {
                "cpu_percent": psutil.cpu_percent(),
                "memory_percent": memory_info.percent,
                "disk_usage": psutil.disk_usage('/').percent
            }
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        "message": "Welcome to Flask Docker App!",
        "version": "1.0.0",
        "description": "A production-ready Flask API running in Docker",
        "endpoints": {
            "health": "/health",
            "users": "/api/users",
            "products": "/api/products",
            "orders": "/api/orders",
            "docs": "/api/docs"
        },
        "timestamp": datetime.now().isoformat()
    })

# API Documentation
@app.route('/api/docs', methods=['GET'])
def api_docs():
    """API documentation endpoint"""
    return jsonify({
        "title": "Flask Docker App API",
        "version": "1.0.0",
        "description": "A sample Flask API with user, product, and order management",
        "endpoints": [
            {
                "path": "/",
                "method": "GET",
                "description": "Root endpoint with app information"
            },
            {
                "path": "/health",
                "method": "GET",
                "description": "Health check endpoint"
            },
            {
                "path": "/api/users",
                "method": "GET",
                "description": "Get all users",
                "query_params": ["role", "limit"]
            },
            {
                "path": "/api/users/<int:user_id>",
                "method": "GET",
                "description": "Get user by ID"
            },
            {
                "path": "/api/products",
                "method": "GET",
                "description": "Get all products",
                "query_params": ["category", "inStock", "limit"]
            },
            {
                "path": "/api/products/<int:product_id>",
                "method": "GET",
                "description": "Get product by ID"
            },
            {
                "path": "/api/orders",
                "method": "GET",
                "description": "Get all orders",
                "query_params": ["userId", "status", "limit"]
            },
            {
                "path": "/api/orders/<int:order_id>",
                "method": "GET",
                "description": "Get order by ID"
            },
            {
                "path": "/api/stats",
                "method": "GET",
                "description": "Get application statistics"
            }
        ]
    })

# Users API
@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users with optional filtering"""
    role = request.args.get('role')
    limit = request.args.get('limit', type=int)
    
    filtered_users = users
    
    if role:
        filtered_users = [user for user in users if user['role'] == role]
    
    if limit:
        filtered_users = filtered_users[:limit]
    
    return jsonify({
        "success": True,
        "count": len(filtered_users),
        "data": filtered_users
    })

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    user = next((user for user in users if user['id'] == user_id), None)
    
    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404
    
    return jsonify({
        "success": True,
        "data": user
    })

# Products API
@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering"""
    category = request.args.get('category')
    in_stock = request.args.get('inStock')
    limit = request.args.get('limit', type=int)
    
    filtered_products = products
    
    if category:
        filtered_products = [p for p in filtered_products if p['category'].lower() == category.lower()]
    
    if in_stock is not None:
        in_stock_bool = in_stock.lower() == 'true'
        filtered_products = [p for p in filtered_products if p['inStock'] == in_stock_bool]
    
    if limit:
        filtered_products = filtered_products[:limit]
    
    return jsonify({
        "success": True,
        "count": len(filtered_products),
        "data": filtered_products
    })

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get product by ID"""
    product = next((p for p in products if p['id'] == product_id), None)
    
    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found"
        }), 404
    
    return jsonify({
        "success": True,
        "data": product
    })

# Orders API
@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders with optional filtering"""
    user_id = request.args.get('userId', type=int)
    status = request.args.get('status')
    limit = request.args.get('limit', type=int)
    
    filtered_orders = orders
    
    if user_id:
        filtered_orders = [o for o in filtered_orders if o['userId'] == user_id]
    
    if status:
        filtered_orders = [o for o in filtered_orders if o['status'] == status]
    
    if limit:
        filtered_orders = filtered_orders[:limit]
    
    # Add user and product information to orders
    enriched_orders = []
    for order in filtered_orders:
        user = next((u for u in users if u['id'] == order['userId']), None)
        product = next((p for p in products if p['id'] == order['productId']), None)
        
        enriched_order = {
            **order,
            "user": user,
            "product": product
        }
        enriched_orders.append(enriched_order)
    
    return jsonify({
        "success": True,
        "count": len(enriched_orders),
        "data": enriched_orders
    })

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get order by ID"""
    order = next((o for o in orders if o['id'] == order_id), None)
    
    if not order:
        return jsonify({
            "success": False,
            "message": "Order not found"
        }), 404
    
    # Add user and product information
    user = next((u for u in users if u['id'] == order['userId']), None)
    product = next((p for p in products if p['id'] == order['productId']), None)
    
    enriched_order = {
        **order,
        "user": user,
        "product": product
    }
    
    return jsonify({
        "success": True,
        "data": enriched_order
    })

# Statistics endpoint
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get application statistics"""
    total_revenue = sum(order['total'] for order in orders if order['status'] == 'completed')
    
    return jsonify({
        "success": True,
        "data": {
            "totalUsers": len(users),
            "totalProducts": len(products),
            "totalOrders": len(orders),
            "revenue": {
                "total": total_revenue,
                "completed_orders": len([o for o in orders if o['status'] == 'completed']),
                "pending_orders": len([o for o in orders if o['status'] == 'pending'])
            },
            "products": {
                "in_stock": len([p for p in products if p['inStock']]),
                "out_of_stock": len([p for p in products if not p['inStock']]),
                "categories": list(set(p['category'] for p in products))
            },
            "users": {
                "by_role": {
                    "admin": len([u for u in users if u['role'] == 'admin']),
                    "user": len([u for u in users if u['role'] == 'user']),
                    "moderator": len([u for u in users if u['role'] == 'moderator'])
                }
            }
        }
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "success": False,
        "message": "Endpoint not found",
        "available_endpoints": [
            "/", "/health", "/api/users", "/api/products", 
            "/api/orders", "/api/docs", "/api/stats"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500

@app.errorhandler(400)
def bad_request(error):
    """Handle 400 errors"""
    return jsonify({
        "success": False,
        "message": "Bad request"
    }), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🚀 Flask app starting on port {port}")
    print(f"📱 Environment: {os.environ.get('FLASK_ENV', 'production')}")
    print(f"🔗 Health check: http://localhost:{port}/health")
    print(f"📚 API docs: http://localhost:{port}/api/docs")
    
    app.run(host='0.0.0.0', port=port, debug=debug) 
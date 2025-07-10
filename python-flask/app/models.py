"""
Data models and utilities for Flask application
"""
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import random

@dataclass
class User:
    """User model with role-based access"""
    id: int
    name: str
    email: str
    role: str
    created_at: datetime = None
    last_login: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now() - timedelta(days=random.randint(1, 365))
        if self.last_login is None:
            self.last_login = datetime.now() - timedelta(hours=random.randint(1, 72))
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat(),
            'is_admin': self.role == 'admin'
        }

@dataclass 
class Product:
    """Product model with inventory tracking"""
    id: int
    name: str
    price: float
    category: str
    in_stock: bool
    description: str = ""
    stock_quantity: int = 0
    
    def __post_init__(self):
        if self.stock_quantity == 0:
            self.stock_quantity = random.randint(0, 100) if self.in_stock else 0
        if not self.description:
            self.description = f"High-quality {self.name.lower()} in the {self.category.lower()} category"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'category': self.category,
            'in_stock': self.in_stock,
            'description': self.description,
            'stock_quantity': self.stock_quantity,
            'price_formatted': f"${self.price:.2f}"
        }

@dataclass
class Order:
    """Order model for e-commerce functionality"""
    id: int
    user_id: int
    product_ids: List[int]
    total_amount: float
    status: str
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now() - timedelta(days=random.randint(0, 30))
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_ids': self.product_ids,
            'total_amount': self.total_amount,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'total_formatted': f"${self.total_amount:.2f}"
        }

# Sample data generators
def generate_sample_users() -> List[User]:
    """Generate sample users with realistic data"""
    return [
        User(1, "Alice Johnson", "alice@example.com", "admin"),
        User(2, "Bob Smith", "bob@example.com", "user"), 
        User(3, "Carol Brown", "carol@example.com", "user"),
        User(4, "David Wilson", "david@example.com", "manager"),
        User(5, "Eva Martinez", "eva@example.com", "user"),
        User(6, "Frank Chen", "frank@example.com", "admin"),
        User(7, "Grace Kim", "grace@example.com", "user"),
        User(8, "Henry Davis", "henry@example.com", "manager")
    ]

def generate_sample_products() -> List[Product]:
    """Generate sample products with realistic data"""
    return [
        Product(1, "MacBook Pro", 1299.99, "Electronics", True, "Latest Apple laptop with M1 chip", 15),
        Product(2, "Python Programming Book", 39.99, "Education", True, "Comprehensive guide to Python", 25),
        Product(3, "Ergonomic Office Chair", 249.99, "Furniture", False, "Comfortable chair for long work hours", 0),
        Product(4, "Wireless Headphones", 199.99, "Electronics", True, "Noise-cancelling Bluetooth headphones", 8),
        Product(5, "Standing Desk", 399.99, "Furniture", True, "Adjustable height standing desk", 5),
        Product(6, "Flask Web Development", 29.99, "Education", True, "Learn Flask framework", 12),
        Product(7, "Mechanical Keyboard", 89.99, "Electronics", True, "RGB backlit gaming keyboard", 20),
        Product(8, "Monitor Stand", 49.99, "Furniture", True, "Adjustable monitor stand", 30)
    ]

def generate_sample_orders() -> List[Order]:
    """Generate sample orders with realistic data"""
    return [
        Order(1, 1, [1, 2], 1339.98, "completed"),
        Order(2, 2, [4], 199.99, "shipped"),
        Order(3, 3, [2, 6], 69.98, "completed"),
        Order(4, 1, [7], 89.99, "processing"),
        Order(5, 4, [5, 8], 449.98, "completed"),
        Order(6, 2, [1], 1299.99, "pending"),
        Order(7, 5, [4, 7], 289.98, "shipped"),
        Order(8, 3, [2], 39.99, "completed")
    ]

# Utility functions
def filter_users_by_role(users: List[User], role: Optional[str] = None) -> List[User]:
    """Filter users by role"""
    if not role:
        return users
    return [user for user in users if user.role.lower() == role.lower()]

def filter_products_by_category(products: List[Product], category: Optional[str] = None, in_stock_only: bool = False) -> List[Product]:
    """Filter products by category and stock status"""
    filtered = products
    
    if category:
        filtered = [p for p in filtered if p.category.lower() == category.lower()]
    
    if in_stock_only:
        filtered = [p for p in filtered if p.in_stock]
    
    return filtered

def get_user_orders(orders: List[Order], user_id: int) -> List[Order]:
    """Get all orders for a specific user"""
    return [order for order in orders if order.user_id == user_id]

def calculate_revenue(orders: List[Order]) -> Dict[str, float]:
    """Calculate total revenue and statistics"""
    completed_orders = [o for o in orders if o.status == "completed"]
    total_revenue = sum(order.total_amount for order in completed_orders)
    
    return {
        "total_revenue": total_revenue,
        "completed_orders": len(completed_orders),
        "average_order_value": total_revenue / len(completed_orders) if completed_orders else 0,
        "pending_orders": len([o for o in orders if o.status == "pending"])
    } 
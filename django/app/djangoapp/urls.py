"""
URL configuration for Django Docker app
"""
from django.urls import path
from . import views

urlpatterns = [
    # Home endpoint
    path('', views.home_view, name='home'),
    
    # Health check
    path('health/', views.health_view, name='health'),
    
    # User endpoints
    path('api/users/', views.users_list_view, name='users_list'),
    path('api/users/<int:user_id>/', views.user_detail_view, name='user_detail'),
    path('api/users/create/', views.create_user_view, name='create_user'),
    
    # Product endpoints  
    path('api/products/', views.products_list_view, name='products_list'),
    
    # Stats endpoint
    path('api/stats/', views.stats_view, name='stats'),
] 
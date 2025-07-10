<?php

// Simple Laravel-style API for Docker demonstration
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Sample data
$users = [
    ['id' => 1, 'name' => 'Alice Johnson', 'email' => 'alice@example.com', 'role' => 'admin'],
    ['id' => 2, 'name' => 'Bob Smith', 'email' => 'bob@example.com', 'role' => 'user'],
    ['id' => 3, 'name' => 'Carol Brown', 'email' => 'carol@example.com', 'role' => 'user']
];

$products = [
    ['id' => 1, 'name' => 'Laptop', 'price' => 999.99, 'category' => 'Electronics', 'inStock' => true],
    ['id' => 2, 'name' => 'Book', 'price' => 19.99, 'category' => 'Education', 'inStock' => true],
    ['id' => 3, 'name' => 'Chair', 'price' => 149.99, 'category' => 'Furniture', 'inStock' => false]
];

// Get request URI
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Simple routing
switch ($path) {
    case '/':
        echo json_encode([
            'message' => 'Welcome to Laravel Docker App!',
            'version' => '1.0.0',
            'description' => 'A production-ready Laravel application running in Docker',
            'endpoints' => [
                'health' => '/health',
                'users' => '/api/users',
                'products' => '/api/products'
            ],
            'timestamp' => date('c')
        ]);
        break;
        
    case '/health':
        echo json_encode([
            'status' => 'healthy',
            'service' => 'laravel-docker-app',
            'timestamp' => date('c'),
            'version' => '1.0.0',
            'system' => [
                'php_version' => PHP_VERSION,
                'memory_usage' => memory_get_usage(true),
                'memory_peak' => memory_get_peak_usage(true)
            ]
        ]);
        break;
        
    case '/api/users':
        $role = $_GET['role'] ?? null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
        
        $filteredUsers = $users;
        
        if ($role) {
            $filteredUsers = array_filter($users, function($user) use ($role) {
                return strcasecmp($user['role'], $role) === 0;
            });
        }
        
        if ($limit && $limit > 0) {
            $filteredUsers = array_slice($filteredUsers, 0, $limit);
        }
        
        echo json_encode([
            'success' => true,
            'count' => count($filteredUsers),
            'data' => array_values($filteredUsers)
        ]);
        break;
        
    case '/api/products':
        $category = $_GET['category'] ?? null;
        $inStock = isset($_GET['inStock']) ? $_GET['inStock'] === 'true' : null;
        
        $filteredProducts = $products;
        
        if ($category) {
            $filteredProducts = array_filter($products, function($product) use ($category) {
                return strcasecmp($product['category'], $category) === 0;
            });
        }
        
        if ($inStock !== null) {
            $filteredProducts = array_filter($filteredProducts, function($product) use ($inStock) {
                return $product['inStock'] === $inStock;
            });
        }
        
        echo json_encode([
            'success' => true,
            'count' => count($filteredProducts),
            'data' => array_values($filteredProducts)
        ]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found',
            'available_endpoints' => [
                '/', '/health', '/api/users', '/api/products'
            ]
        ]);
        break;
}
?> 
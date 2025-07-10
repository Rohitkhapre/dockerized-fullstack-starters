package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
import java.time.LocalDateTime;

@SpringBootApplication
@RestController
public class Application {

    private static final List<User> users = Arrays.asList(
        new User(1, "Alice Johnson", "alice@example.com", "admin"),
        new User(2, "Bob Smith", "bob@example.com", "user"),
        new User(3, "Carol Brown", "carol@example.com", "user")
    );

    private static final List<Product> products = Arrays.asList(
        new Product(1, "Laptop", 999.99, "Electronics", true),
        new Product(2, "Book", 19.99, "Education", true),
        new Product(3, "Chair", 149.99, "Furniture", false)
    );

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to Spring Boot Docker App!");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now());
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("health", "/actuator/health");
        endpoints.put("users", "/api/users");
        endpoints.put("products", "/api/products");
        response.put("endpoints", endpoints);
        
        return response;
    }

    @GetMapping("/api/users")
    public Map<String, Object> getUsers(
        @RequestParam(required = false) String role,
        @RequestParam(required = false) Integer limit) {
        
        List<User> filteredUsers = users;
        
        if (role != null) {
            filteredUsers = users.stream()
                .filter(user -> user.getRole().equalsIgnoreCase(role))
                .toList();
        }
        
        if (limit != null && limit > 0) {
            filteredUsers = filteredUsers.subList(0, Math.min(limit, filteredUsers.size()));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", filteredUsers.size());
        response.put("data", filteredUsers);
        
        return response;
    }

    @GetMapping("/api/users/{id}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable int id) {
        Optional<User> user = users.stream()
            .filter(u -> u.getId() == id)
            .findFirst();
            
        Map<String, Object> response = new HashMap<>();
        
        if (user.isPresent()) {
            response.put("success", true);
            response.put("data", user.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/products")
    public Map<String, Object> getProducts(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Boolean inStock) {
        
        List<Product> filteredProducts = products;
        
        if (category != null) {
            filteredProducts = products.stream()
                .filter(product -> product.getCategory().equalsIgnoreCase(category))
                .toList();
        }
        
        if (inStock != null) {
            filteredProducts = filteredProducts.stream()
                .filter(product -> product.isInStock() == inStock)
                .toList();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", filteredProducts.size());
        response.put("data", filteredProducts);
        
        return response;
    }

    // Data classes
    public static class User {
        private int id;
        private String name;
        private String email;
        private String role;

        public User(int id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        // Getters
        public int getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }

    public static class Product {
        private int id;
        private String name;
        private double price;
        private String category;
        private boolean inStock;

        public Product(int id, String name, double price, String category, boolean inStock) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.category = category;
            this.inStock = inStock;
        }

        // Getters
        public int getId() { return id; }
        public String getName() { return name; }
        public double getPrice() { return price; }
        public String getCategory() { return category; }
        public boolean isInStock() { return inStock; }
    }
} 
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Data structures
type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type Product struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Category string  `json:"category"`
	InStock  bool    `json:"inStock"`
}

type Order struct {
	ID        int      `json:"id"`
	UserID    int      `json:"userId"`
	ProductID int      `json:"productId"`
	Quantity  int      `json:"quantity"`
	Total     float64  `json:"total"`
	Status    string   `json:"status"`
	User      *User    `json:"user,omitempty"`
	Product   *Product `json:"product,omitempty"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Count   int         `json:"count,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}

type HealthResponse struct {
	Status    string                 `json:"status"`
	Service   string                 `json:"service"`
	Timestamp string                 `json:"timestamp"`
	Version   string                 `json:"version"`
	System    map[string]interface{} `json:"system"`
}

// Sample data
var users = []User{
	{ID: 1, Name: "Alice Johnson", Email: "alice@example.com", Role: "admin"},
	{ID: 2, Name: "Bob Smith", Email: "bob@example.com", Role: "user"},
	{ID: 3, Name: "Carol Brown", Email: "carol@example.com", Role: "user"},
	{ID: 4, Name: "David Wilson", Email: "david@example.com", Role: "moderator"},
}

var products = []Product{
	{ID: 1, Name: "Laptop", Price: 999.99, Category: "Electronics", InStock: true},
	{ID: 2, Name: "Book", Price: 19.99, Category: "Education", InStock: true},
	{ID: 3, Name: "Chair", Price: 149.99, Category: "Furniture", InStock: false},
	{ID: 4, Name: "Phone", Price: 699.99, Category: "Electronics", InStock: true},
}

var orders = []Order{
	{ID: 1, UserID: 1, ProductID: 1, Quantity: 1, Total: 999.99, Status: "completed"},
	{ID: 2, UserID: 2, ProductID: 2, Quantity: 2, Total: 39.98, Status: "pending"},
	{ID: 3, UserID: 1, ProductID: 4, Quantity: 1, Total: 699.99, Status: "completed"},
}

var startTime = time.Now()

// Helper functions
func writeJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func findUserByID(id int) *User {
	for _, user := range users {
		if user.ID == id {
			return &user
		}
	}
	return nil
}

func findProductByID(id int) *Product {
	for _, product := range products {
		if product.ID == id {
			return &product
		}
	}
	return nil
}

// Handlers
func healthHandler(w http.ResponseWriter, r *http.Request) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	response := HealthResponse{
		Status:    "healthy",
		Service:   "go-docker-app",
		Timestamp: time.Now().Format(time.RFC3339),
		Version:   "1.0.0",
		System: map[string]interface{}{
			"goVersion":       runtime.Version(),
			"numGoroutines":   runtime.NumGoroutine(),
			"memAllocMB":      bToMb(m.Alloc),
			"memTotalAllocMB": bToMb(m.TotalAlloc),
			"memSysMB":        bToMb(m.Sys),
			"uptime":          time.Since(startTime).Seconds(),
		},
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"message":     "Welcome to Go Docker App!",
		"version":     "1.0.0",
		"description": "A production-ready Go web application running in Docker",
		"endpoints": map[string]string{
			"health":   "/health",
			"users":    "/api/users",
			"products": "/api/products",
			"orders":   "/api/orders",
			"docs":     "/api/docs",
		},
		"timestamp": time.Now().Format(time.RFC3339),
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func docsHandler(w http.ResponseWriter, r *http.Request) {
	docs := map[string]interface{}{
		"title":       "Go Docker App API",
		"version":     "1.0.0",
		"description": "A sample Go API with user, product, and order management",
		"endpoints": []map[string]interface{}{
			{"path": "/", "method": "GET", "description": "Root endpoint with app information"},
			{"path": "/health", "method": "GET", "description": "Health check endpoint"},
			{"path": "/api/users", "method": "GET", "description": "Get all users", "query_params": []string{"role", "limit"}},
			{"path": "/api/users/{id}", "method": "GET", "description": "Get user by ID"},
			{"path": "/api/products", "method": "GET", "description": "Get all products", "query_params": []string{"category", "inStock", "limit"}},
			{"path": "/api/products/{id}", "method": "GET", "description": "Get product by ID"},
			{"path": "/api/orders", "method": "GET", "description": "Get all orders", "query_params": []string{"userId", "status", "limit"}},
			{"path": "/api/orders/{id}", "method": "GET", "description": "Get order by ID"},
			{"path": "/api/stats", "method": "GET", "description": "Get application statistics"},
		},
	}

	writeJSONResponse(w, http.StatusOK, docs)
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
	role := r.URL.Query().Get("role")
	limitStr := r.URL.Query().Get("limit")

	filteredUsers := users
	if role != "" {
		var filtered []User
		for _, user := range users {
			if strings.EqualFold(user.Role, role) {
				filtered = append(filtered, user)
			}
		}
		filteredUsers = filtered
	}

	if limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 && limit < len(filteredUsers) {
			filteredUsers = filteredUsers[:limit]
		}
	}

	response := APIResponse{
		Success: true,
		Count:   len(filteredUsers),
		Data:    filteredUsers,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func getUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		response := APIResponse{
			Success: false,
			Message: "Invalid user ID",
		}
		writeJSONResponse(w, http.StatusBadRequest, response)
		return
	}

	user := findUserByID(id)
	if user == nil {
		response := APIResponse{
			Success: false,
			Message: "User not found",
		}
		writeJSONResponse(w, http.StatusNotFound, response)
		return
	}

	response := APIResponse{
		Success: true,
		Data:    user,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func getProductsHandler(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	inStockStr := r.URL.Query().Get("inStock")
	limitStr := r.URL.Query().Get("limit")

	filteredProducts := products

	if category != "" {
		var filtered []Product
		for _, product := range products {
			if strings.EqualFold(product.Category, category) {
				filtered = append(filtered, product)
			}
		}
		filteredProducts = filtered
	}

	if inStockStr != "" {
		inStock := strings.EqualFold(inStockStr, "true")
		var filtered []Product
		for _, product := range filteredProducts {
			if product.InStock == inStock {
				filtered = append(filtered, product)
			}
		}
		filteredProducts = filtered
	}

	if limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 && limit < len(filteredProducts) {
			filteredProducts = filteredProducts[:limit]
		}
	}

	response := APIResponse{
		Success: true,
		Count:   len(filteredProducts),
		Data:    filteredProducts,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func getProductHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		response := APIResponse{
			Success: false,
			Message: "Invalid product ID",
		}
		writeJSONResponse(w, http.StatusBadRequest, response)
		return
	}

	product := findProductByID(id)
	if product == nil {
		response := APIResponse{
			Success: false,
			Message: "Product not found",
		}
		writeJSONResponse(w, http.StatusNotFound, response)
		return
	}

	response := APIResponse{
		Success: true,
		Data:    product,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func getOrdersHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.URL.Query().Get("userId")
	status := r.URL.Query().Get("status")
	limitStr := r.URL.Query().Get("limit")

	filteredOrders := orders

	if userIDStr != "" {
		if userID, err := strconv.Atoi(userIDStr); err == nil {
			var filtered []Order
			for _, order := range orders {
				if order.UserID == userID {
					filtered = append(filtered, order)
				}
			}
			filteredOrders = filtered
		}
	}

	if status != "" {
		var filtered []Order
		for _, order := range filteredOrders {
			if strings.EqualFold(order.Status, status) {
				filtered = append(filtered, order)
			}
		}
		filteredOrders = filtered
	}

	if limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 && limit < len(filteredOrders) {
			filteredOrders = filteredOrders[:limit]
		}
	}

	// Enrich orders with user and product data
	enrichedOrders := make([]Order, len(filteredOrders))
	for i, order := range filteredOrders {
		enrichedOrders[i] = order
		enrichedOrders[i].User = findUserByID(order.UserID)
		enrichedOrders[i].Product = findProductByID(order.ProductID)
	}

	response := APIResponse{
		Success: true,
		Count:   len(enrichedOrders),
		Data:    enrichedOrders,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func getOrderHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		response := APIResponse{
			Success: false,
			Message: "Invalid order ID",
		}
		writeJSONResponse(w, http.StatusBadRequest, response)
		return
	}

	var foundOrder *Order
	for _, order := range orders {
		if order.ID == id {
			foundOrder = &order
			break
		}
	}

	if foundOrder == nil {
		response := APIResponse{
			Success: false,
			Message: "Order not found",
		}
		writeJSONResponse(w, http.StatusNotFound, response)
		return
	}

	// Enrich order with user and product data
	enrichedOrder := *foundOrder
	enrichedOrder.User = findUserByID(foundOrder.UserID)
	enrichedOrder.Product = findProductByID(foundOrder.ProductID)

	response := APIResponse{
		Success: true,
		Data:    enrichedOrder,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func getStatsHandler(w http.ResponseWriter, r *http.Request) {
	totalRevenue := 0.0
	completedOrders := 0
	pendingOrders := 0

	for _, order := range orders {
		if order.Status == "completed" {
			totalRevenue += order.Total
			completedOrders++
		} else if order.Status == "pending" {
			pendingOrders++
		}
	}

	inStockProducts := 0
	outOfStockProducts := 0
	categories := make(map[string]bool)

	for _, product := range products {
		if product.InStock {
			inStockProducts++
		} else {
			outOfStockProducts++
		}
		categories[product.Category] = true
	}

	categoryList := make([]string, 0, len(categories))
	for category := range categories {
		categoryList = append(categoryList, category)
	}

	usersByRole := make(map[string]int)
	for _, user := range users {
		usersByRole[user.Role]++
	}

	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	stats := map[string]interface{}{
		"totalUsers":    len(users),
		"totalProducts": len(products),
		"totalOrders":   len(orders),
		"revenue": map[string]interface{}{
			"total":            totalRevenue,
			"completed_orders": completedOrders,
			"pending_orders":   pendingOrders,
		},
		"products": map[string]interface{}{
			"in_stock":     inStockProducts,
			"out_of_stock": outOfStockProducts,
			"categories":   categoryList,
		},
		"users": map[string]interface{}{
			"by_role": usersByRole,
		},
		"system": map[string]interface{}{
			"goVersion":     runtime.Version(),
			"numGoroutines": runtime.NumGoroutine(),
			"memAllocMB":    bToMb(m.Alloc),
			"uptime":        time.Since(startTime).Seconds(),
		},
	}

	response := APIResponse{
		Success: true,
		Data:    stats,
	}

	writeJSONResponse(w, http.StatusOK, response)
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	response := APIResponse{
		Success: false,
		Message: "Endpoint not found",
		Data: map[string][]string{
			"available_endpoints": {
				"/", "/health", "/api/users", "/api/products",
				"/api/orders", "/api/docs", "/api/stats",
			},
		},
	}

	writeJSONResponse(w, http.StatusNotFound, response)
}

func bToMb(b uint64) uint64 {
	return b / 1024 / 1024
}

func main() {
	// Create router
	r := mux.NewRouter()

	// Register routes
	r.HandleFunc("/", rootHandler).Methods("GET")
	r.HandleFunc("/health", healthHandler).Methods("GET")
	r.HandleFunc("/api/docs", docsHandler).Methods("GET")
	r.HandleFunc("/api/users", getUsersHandler).Methods("GET")
	r.HandleFunc("/api/users/{id:[0-9]+}", getUserHandler).Methods("GET")
	r.HandleFunc("/api/products", getProductsHandler).Methods("GET")
	r.HandleFunc("/api/products/{id:[0-9]+}", getProductHandler).Methods("GET")
	r.HandleFunc("/api/orders", getOrdersHandler).Methods("GET")
	r.HandleFunc("/api/orders/{id:[0-9]+}", getOrderHandler).Methods("GET")
	r.HandleFunc("/api/stats", getStatsHandler).Methods("GET")

	// 404 handler
	r.NotFoundHandler = http.HandlerFunc(notFoundHandler)

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Wrap router with CORS
	handler := c.Handler(r)

	// Start server
	port := ":8080"
	fmt.Printf("🚀 Go Docker App starting on port %s\n", port)
	fmt.Printf("📱 Environment: production\n")
	fmt.Printf("🔗 Health check: http://localhost%s/health\n", port)
	fmt.Printf("📚 API docs: http://localhost%s/api/docs\n", port)

	log.Fatal(http.ListenAndServe(port, handler))
}

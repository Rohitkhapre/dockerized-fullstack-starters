# Go Web Application Docker Stack

Production-ready, security-hardened Docker setup for Go web applications with static binary compilation.

## Features

- **Multi-stage build** with static binary compilation
- **Minimal Alpine base** for smallest possible image
- **Non-root user** with security hardening
- **CGO disabled** for truly static binaries
- **Health checks** and resource limits

## Quick Start

1. Add your Go application to the `app/` directory
2. Ensure `go.mod` and `go.sum` are present
3. Main application should listen on port 8080

```bash
docker compose build
docker compose up
```

Application available at `http://localhost:8081`

## Application Requirements

- Go application with `go.mod` file
- Main application listening on `:8080`
- HTTP server binding to `0.0.0.0:8080`

### Example Go Application:

```go
// main.go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"
)

type Response struct {
    Message string    `json:"message"`
    Time    time.Time `json:"time"`
}

type HealthResponse struct {
    Status  string `json:"status"`
    Service string `json:"service"`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
    response := Response{
        Message: "Hello, World!",
        Time:    time.Now(),
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    response := HealthResponse{
        Status:  "healthy",
        Service: "go-app",
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func main() {
    http.HandleFunc("/", helloHandler)
    http.HandleFunc("/health", healthHandler)
    
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### Example go.mod:
```go
module myapp

go 1.22

require (
    github.com/gorilla/mux v1.8.0
    github.com/joho/godotenv v1.4.0
)
```

## Security Features

- Runs as `gousr:gogrp` (UID/GID 1000)
- Read-only filesystem with tmpfs for temporary files
- All Linux capabilities dropped
- Static binary compilation (CGO_ENABLED=0)
- Minimal Alpine base image (3.19)
- No shell or package manager in final image

## Popular Go Frameworks

### Gin Framework:
```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    
    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "Hello, World!",
        })
    })
    
    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "status": "healthy",
        })
    })
    
    r.Run(":8080")
}
```

### Gorilla Mux:
```go
package main

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
)

func main() {
    r := mux.NewRouter()
    
    r.HandleFunc("/", helloHandler).Methods("GET")
    r.HandleFunc("/health", healthHandler).Methods("GET")
    r.HandleFunc("/api/users", usersHandler).Methods("GET", "POST")
    
    http.ListenAndServe(":8080", r)
}
```

### Echo Framework:
```go
package main

import (
    "net/http"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    e := echo.New()
    
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    
    e.GET("/", func(c echo.Context) error {
        return c.JSON(http.StatusOK, map[string]string{
            "message": "Hello, World!",
        })
    })
    
    e.Logger.Fatal(e.Start(":8080"))
}
```

## Database Integration

### PostgreSQL with lib/pq:
```go
import (
    "database/sql"
    _ "github.com/lib/pq"
)

func initDB() *sql.DB {
    dbURL := os.Getenv("DATABASE_URL")
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        log.Fatal(err)
    }
    return db
}
```

### MongoDB with mongo-driver:
```go
import (
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func initMongo() *mongo.Client {
    mongoURL := os.Getenv("MONGO_URL")
    client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURL))
    if err != nil {
        log.Fatal(err)
    }
    return client
}
```

## Environment Configuration

```go
package main

import (
    "os"
    "github.com/joho/godotenv"
)

func init() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found")
    }
}

func getEnv(key, fallback string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return fallback
}
```

## Production Setup

### With Database:
```yaml
version: '3.8'
services:
  go-app:
    build: .
    ports:
      - "8081:8080"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/goapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: goapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      
  redis:
    image: redis:7-alpine
```

## Performance Optimization

### Build optimizations:
```dockerfile
# In Dockerfile, add build flags
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o server .
```

### Runtime optimizations:
```go
// Set GOMAXPROCS
runtime.GOMAXPROCS(runtime.NumCPU())

// Configure HTTP server timeouts
server := &http.Server{
    Addr:         ":8080",
    Handler:      router,
    ReadTimeout:  15 * time.Second,
    WriteTimeout: 15 * time.Second,
    IdleTimeout:  60 * time.Second,
}
```

## Testing

```go
// main_test.go
package main

import (
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestHealthHandler(t *testing.T) {
    req, err := http.NewRequest("GET", "/health", nil)
    if err != nil {
        t.Fatal(err)
    }
    
    rr := httptest.NewRecorder()
    handler := http.HandlerFunc(healthHandler)
    
    handler.ServeHTTP(rr, req)
    
    if status := rr.Code; status != http.StatusOK {
        t.Errorf("handler returned wrong status code: got %v want %v",
            status, http.StatusOK)
    }
}
```

## Customization

- Change port: Update EXPOSE and bind address
- Add middleware: Logging, CORS, authentication
- Database drivers: Add to go.mod and rebuild
- Environment variables: Use docker-compose.yml

## Troubleshooting

- Build failures: Check Go version compatibility
- Import errors: Verify go.mod dependencies
- Network issues: Ensure binding to 0.0.0.0, not localhost
- Performance: Monitor with pprof and adjust GOMAXPROCS 
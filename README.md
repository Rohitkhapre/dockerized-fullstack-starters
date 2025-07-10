# Dockerized Fullstack Starters

**Production-ready, security-hardened Docker and Docker Compose setups for the most popular web development stacks.** Each stack is self-contained and can be run independently, with combined examples showing how to run multiple stacks together.

## 🚀 Features

- ✅ **Enterprise-ready** production configurations
- 🔒 **Security-hardened** containers with non-root users
- 🏗️ **Multi-stage builds** for optimized image sizes
- 🛡️ **Comprehensive security headers** and best practices
- 📊 **Health checks** and monitoring endpoints
- 📈 **Resource limits** and performance optimization
- 📚 **Detailed documentation** for each stack
- 🔧 **Easy customization** and extensibility

## 📁 Directory Structure

```
dockerized-fullstack-starters/
│
├── node/                    # Node.js (Express) - Port 3000
│   ├── app/                 # Your Node.js application code
│   ├── Dockerfile           # Production-optimized configuration
│   ├── docker-compose.yml   # Single-stack deployment
│   ├── .dockerignore       # Build context optimization
│   └── README.md           # Detailed stack documentation
│
├── react/                   # React - Port 8080
│   ├── app/                 # Your React application code
│   ├── Dockerfile           # Multi-stage build with nginx
│   ├── docker-compose.yml   # Production deployment
│   ├── nginx.conf          # Security-hardened nginx config
│   ├── .dockerignore       
│   └── README.md           
│
├── python-flask/            # Python Flask - Port 5000
│   ├── app/                 # Your Flask application code
│   ├── Dockerfile           # Gunicorn + security hardening
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── django/                  # Django - Port 8000
│   ├── app/                 # Your Django project
│   ├── Dockerfile           # Production Django + Gunicorn
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── rails/                   # Ruby on Rails - Port 3001
│   ├── app/                 # Your Rails application
│   ├── Dockerfile           # Asset pipeline + Puma server
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── go/                      # Go Web Apps - Port 8081
│   ├── app/                 # Your Go application
│   ├── Dockerfile           # Static binary compilation
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── java-spring/             # Java Spring Boot - Port 8082
│   ├── app/                 # Your Spring Boot project
│   ├── Dockerfile           # Maven + JRE optimization
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── php-laravel/             # PHP Laravel - Port 9000
│   ├── app/                 # Your Laravel application
│   ├── Dockerfile           # Composer + PHP-FPM
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── dotnet/                  # ASP.NET Core - Port 8084
│   ├── app/                 # Your .NET application
│   ├── Dockerfile           # SDK + Runtime separation
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── angular/                 # Angular - Port 8085
│   ├── app/                 # Your Angular application
│   ├── Dockerfile           # Angular CLI + nginx
│   ├── docker-compose.yml   
│   ├── nginx.conf          # SPA routing + security headers
│   ├── .dockerignore       
│   └── README.md           
│
├── combined-examples/       # Multi-stack deployments
│   ├── node-react/         # Backend + Frontend combination
│   │   └── docker-compose.yml
│   ├── flask-react/        # Python API + React frontend
│   │   └── docker-compose.yml
│   └── ...                 # More combinations
│
└── README.md               # This file
```

## 🔒 Security Features

All stacks include enterprise-grade security hardening:

### Container Security
- **Non-root execution** with custom user/group (UID/GID 1000)
- **Read-only filesystem** with tmpfs for temporary files
- **Capability dropping** - all Linux capabilities removed
- **No new privileges** security option enabled
- **Pinned base images** with specific versions
- **Minimal attack surface** - only required packages

### Application Security
- **Security headers** configured (CSP, HSTS, XSS protection)
- **Server tokens disabled** (nginx/apache)
- **Build cache cleanup** to reduce image size
- **Strict file permissions** (750) on application files
- **Environment variable** best practices

### Network Security
- **Health check endpoints** for monitoring
- **Resource limits** (memory, CPU) configured
- **Proper port exposure** with documentation
- **CORS configuration** examples where applicable

## 🚦 Quick Start

### Single Stack Usage

Each stack can be run independently:

```bash
# Example: Run Node.js stack
cd node
docker compose up --build

# Example: Run React stack  
cd react
docker compose up --build

# Example: Run Django stack
cd django
docker compose up --build
```

### Combined Stacks

Run multiple stacks together:

```bash
# Example: Node.js API + React Frontend
cd combined-examples/node-react
docker compose up --build

# Example: Flask API + React Frontend
cd combined-examples/flask-react
docker compose up --build
```

## 📚 Stack Documentation

Each stack includes comprehensive documentation:

| Stack | Technology | Port | Documentation |
|-------|------------|------|---------------|
| **Node.js** | Express, Gunicorn | 3000 | [📖 Node.js README](node/README.md) |
| **React** | React, nginx | 8080 | [📖 React README](react/README.md) |
| **Flask** | Python, Gunicorn | 5000 | [📖 Flask README](python-flask/README.md) |
| **Django** | Python, Gunicorn | 8000 | [📖 Django README](django/README.md) |
| **Rails** | Ruby, Puma | 3001 | [📖 Rails README](rails/README.md) |
| **Go** | Go, HTTP server | 8081 | [📖 Go README](go/README.md) |
| **Spring** | Java, Spring Boot | 8082 | [📖 Spring README](java-spring/README.md) |
| **Laravel** | PHP, PHP-FPM | 9000 | [📖 Laravel README](php-laravel/README.md) |
| **.NET** | ASP.NET Core | 8084 | [📖 .NET README](dotnet/README.md) |
| **Angular** | Angular, nginx | 8085 | [📖 Angular README](angular/README.md) |

## 🔧 Getting Started with Your Code

### Step 1: Choose Your Stack
Navigate to the directory for your technology stack.

### Step 2: Add Your Application Code
Place your application code in the `app/` directory of your chosen stack.

### Step 3: Review Requirements
Check the stack's README.md for specific requirements (package.json, requirements.txt, etc.).

### Step 4: Build and Run
```bash
# Build the image
docker compose build

# Run the container
docker compose up

# Run in detached mode
docker compose up -d
```

### Step 5: Customize (Optional)
- Update environment variables in docker-compose.yml
- Modify Dockerfile for additional dependencies
- Adjust nginx configurations for frontend stacks
- Configure database connections

## 🏗️ Production Deployment Considerations

### Environment Variables
- Use Docker secrets or encrypted environment files
- Never commit sensitive data to version control
- Use different configurations for dev/staging/production

### Database Integration
- Use external managed databases in production
- Configure connection pooling and timeouts
- Implement proper backup strategies

### Reverse Proxy & Load Balancing
- Use nginx or Traefik for SSL termination
- Implement load balancing for multiple instances
- Configure rate limiting and security rules

### Monitoring & Logging
- All stacks include health check endpoints
- Configure centralized logging (ELK, Fluentd)
- Set up monitoring (Prometheus, Grafana)
- Implement alerting for critical issues

### Scaling & Orchestration
- Use Docker Swarm or Kubernetes for orchestration
- Configure horizontal pod autoscaling
- Implement blue-green or rolling deployments

## 🛠️ Customization Examples

### Change Application Ports
```yaml
# In docker-compose.yml
ports:
  - "your-port:container-port"
```

### Add Database Services
```yaml
# Example: Adding PostgreSQL
services:
  your-app:
    # ... existing configuration
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

### Environment-Specific Configuration
```yaml
# Use .env files
environment:
  - NODE_ENV=${NODE_ENV:-production}
  - DATABASE_URL=${DATABASE_URL}
  - API_KEY=${API_KEY}
```

## 🧪 Development vs Production

These configurations are optimized for **production use**. For development:

- Add volume mounts for live code reloading
- Remove security constraints (read-only, capabilities)
- Use development servers instead of production servers
- Enable debug modes and verbose logging

Example development override:
```yaml
# docker-compose.override.yml
services:
  your-app:
    volumes:
      - ./app:/app
    environment:
      - NODE_ENV=development
    # Remove production security constraints
    cap_drop: []
    read_only: false
```

## 📊 Performance Optimization

### Image Size Optimization
- Multi-stage builds remove build dependencies
- Alpine Linux base images for smaller footprint
- Build cache cleanup and package manager cache removal
- Only production dependencies included

### Runtime Performance
- Resource limits prevent resource exhaustion
- Health checks enable proper load balancing
- Optimized server configurations (worker processes, etc.)
- Static asset optimization and caching

### Build Performance
- Docker layer caching optimized
- Dependency installation separated from code copy
- `.dockerignore` files reduce build context

## 🤝 Contributing

Contributions are welcome! Please feel free to submit:

- **New technology stacks** with similar security standards
- **Security improvements** and best practices
- **Performance optimizations** 
- **Documentation enhancements**
- **Bug fixes and improvements**

### Guidelines
- Follow existing security hardening patterns
- Include comprehensive documentation
- Test configurations thoroughly
- Maintain consistency with existing stacks

## 📋 Requirements

- **Docker Engine** 20.10+ 
- **Docker Compose** v2.0+
- **System requirements** vary by stack (see individual READMEs)

## 🔍 Troubleshooting

### Common Issues

**Build failures:**
- Check Docker version compatibility
- Verify application dependencies and configuration
- Review Dockerfile syntax and paths

**Permission errors:**
- Ensure your application doesn't require root privileges
- Check file ownership and permissions in app/ directory
- Verify tmpfs mounts for writable directories

**Network connectivity:**
- Check port conflicts with existing services
- Verify application binds to 0.0.0.0, not localhost
- Review firewall and Docker network configuration

**Health check failures:**
- Implement health endpoints in your application
- Verify health check commands and timeouts
- Check application startup time vs health check start period

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for the developer community by [Rohit Khapre](mailto:rkhapre111@gmail.com)**

*Ready to deploy. Secure by default. Scalable by design.*

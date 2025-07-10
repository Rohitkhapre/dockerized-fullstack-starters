# 🐳 Dockerized Fullstack Starters

<div align="center">

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

**Production-ready, security-hardened Docker and Docker Compose setups for the most popular web development stacks.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Security](https://img.shields.io/badge/Security-Hardened-green)](https://github.com/Rohitkhapre/dockerized-fullstack-starters)
[![Production](https://img.shields.io/badge/Production-Ready-success)](https://github.com/Rohitkhapre/dockerized-fullstack-starters)

</div>

---

## 🚀 Features

- ✅ **Enterprise-ready** production configurations
- 🔒 **Security-hardened** containers with non-root users
- 🏗️ **Multi-stage builds** for optimized image sizes
- 🛡️ **Comprehensive security headers** and best practices
- 📊 **Health checks** and monitoring endpoints
- 📈 **Resource limits** and performance optimization
- 📚 **Detailed documentation** for each stack
- 🔧 **Easy customization** and extensibility

## 🛠️ Supported Technology Stacks

<div align="center">

| Technology | Logo | Port | Documentation | Status |
|------------|------|------|---------------|--------|
| **Node.js** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) | 3000 | [📖 README](node/README.md) | ✅ Ready |
| **React** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) | 8080 | [📖 README](react/README.md) | ✅ Ready |
| **Flask** | ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) | 5000 | [📖 README](python-flask/README.md) | ✅ Ready |
| **Django** | ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) | 8000 | [📖 README](django/README.md) | ✅ Ready |
| **Rails** | ![Rails](https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white) | 3001 | [📖 README](rails/README.md) | ✅ Ready |
| **Go** | ![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white) | 8081 | [📖 README](go/README.md) | ✅ Ready |
| **Spring Boot** | ![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white) | 8082 | [📖 README](java-spring/README.md) | ✅ Ready |
| **Laravel** | ![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white) | 9000 | [📖 README](php-laravel/README.md) | ✅ Ready |
| **.NET Core** | ![.Net](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white) | 8084 | [📖 README](dotnet/README.md) | ✅ Ready |
| **Angular** | ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) | 8085 | [📖 README](angular/README.md) | ✅ Ready |
| **Redis** | ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) | 6379 | [📖 README](redis/README.md) | ✅ Ready |

</div>

## 📁 Directory Structure

```
dockerized-fullstack-starters/
│
├── 🟢 node/                    # Node.js (Express) - Port 3000
│   ├── app/                 # Your Node.js application code
│   ├── Dockerfile           # Production-optimized configuration
│   ├── docker-compose.yml   # Single-stack deployment
│   ├── .dockerignore       # Build context optimization
│   └── README.md           # Detailed stack documentation
│
├── ⚛️ react/                   # React - Port 8080
│   ├── app/                 # Your React application code
│   ├── Dockerfile           # Multi-stage build with nginx
│   ├── docker-compose.yml   # Production deployment
│   ├── nginx.conf          # Security-hardened nginx config
│   ├── .dockerignore       
│   └── README.md           
│
├── 🐍 python-flask/            # Python Flask - Port 5000
│   ├── app/                 # Your Flask application code
│   ├── Dockerfile           # Gunicorn + security hardening
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── 🎸 django/                  # Django - Port 8000
│   ├── app/                 # Your Django project
│   ├── Dockerfile           # Production Django + Gunicorn
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── 💎 rails/                   # Ruby on Rails - Port 3001
│   ├── app/                 # Your Rails application
│   ├── Dockerfile           # Asset pipeline + Puma server
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── 🐹 go/                      # Go Web Apps - Port 8081
│   ├── app/                 # Your Go application
│   ├── Dockerfile           # Static binary compilation
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── ☕ java-spring/             # Java Spring Boot - Port 8082
│   ├── app/                 # Your Spring Boot project
│   ├── Dockerfile           # Maven + JRE optimization
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── 🐘 php-laravel/             # PHP Laravel - Port 9000
│   ├── app/                 # Your Laravel application
│   ├── Dockerfile           # Composer + PHP-FPM
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── 🔷 dotnet/                  # ASP.NET Core - Port 8084
│   ├── app/                 # Your .NET application
│   ├── Dockerfile           # SDK + Runtime separation
│   ├── docker-compose.yml   
│   ├── .dockerignore       
│   └── README.md           
│
├── 🅰️ angular/                 # Angular - Port 8085
│   ├── app/                 # Your Angular application
│   ├── Dockerfile           # Angular CLI + nginx
│   ├── docker-compose.yml   
│   ├── nginx.conf          # SPA routing + security headers
│   ├── .dockerignore       
│   └── README.md           
│
├── 🔴 redis/                   # Redis Cache - Port 6379
│   ├── Dockerfile           # Optimized Redis configuration
│   ├── docker-compose.yml   # Redis with persistence
│   ├── redis.conf          # Production Redis config
│   ├── .dockerignore       
│   └── README.md           
│
├── 🔗 combined-examples/       # Multi-stack deployments
│   ├── node-react/         # Backend + Frontend combination
│   │   └── docker-compose.yml
│   ├── flask-react/        # Python API + React frontend
│   │   └── docker-compose.yml
│   └── ...                 # More combinations
│
└── 📖 README.md               # This file
```

## 🔒 Security Features

<div align="center">

![Security](https://img.shields.io/badge/Security-First-red?style=for-the-badge&logo=shield&logoColor=white)
![Best Practices](https://img.shields.io/badge/Best-Practices-green?style=for-the-badge&logo=checkmarx&logoColor=white)

</div>

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

<div align="center">

![Docker Compose](https://img.shields.io/badge/docker%20compose-up-blue?style=for-the-badge&logo=docker&logoColor=white)

</div>

### Single Stack Usage

Each stack can be run independently:

```bash
# Example: Run Node.js stack
cd node
docker compose up --build

# Example: Run React stack  
cd react
docker compose up --build

# Example: Run Redis cache
cd redis
docker compose up --build
```

### Combined Stacks

Run multiple stacks together:

```bash
# Example: Node.js API + React Frontend + Redis Cache
cd combined-examples/node-react-redis
docker compose up --build

# Example: Flask API + React Frontend
cd combined-examples/flask-react
docker compose up --build
```

## 📚 Stack Documentation

<div align="center">

![Documentation](https://img.shields.io/badge/Documentation-Complete-brightgreen?style=for-the-badge&logo=gitbook&logoColor=white)

</div>

Each stack includes comprehensive documentation with:
- 🚀 Quick start instructions
- 🔧 Application requirements and examples  
- 🛡️ Security features explanation
- 🏭 Production configuration examples
- 🗄️ Database integration examples
- 🌐 API development patterns
- ⚙️ Customization options
- 🔍 Troubleshooting sections
- ⚡ Performance tuning tips

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

<div align="center">

![Production](https://img.shields.io/badge/Production-Ready-success?style=for-the-badge&logo=kubernetes&logoColor=white)
![Monitoring](https://img.shields.io/badge/Monitoring-Enabled-blue?style=for-the-badge&logo=prometheus&logoColor=white)

</div>

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

<div align="center">

![Performance](https://img.shields.io/badge/Performance-Optimized-orange?style=for-the-badge&logo=speedtest&logoColor=white)

</div>

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

<div align="center">

![Contributors](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge&logo=github&logoColor=white)

</div>

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

<div align="center">

![Requirements](https://img.shields.io/badge/Requirements-Docker%2020.10%2B-blue?style=for-the-badge&logo=docker&logoColor=white)

</div>

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

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for the developer community by [Rohit Khapre](mailto:rkhapre111@gmail.com)**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green?style=for-the-badge)

*Ready to deploy. Secure by default. Scalable by design.*

</div>

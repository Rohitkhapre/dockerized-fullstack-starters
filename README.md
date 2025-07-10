# 🐳 Dockerized Fullstack Starters

<div align="center">

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

**🚀 Production-ready, security-hardened Docker setups for modern web development stacks**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Security](https://img.shields.io/badge/Security-Hardened-green)](https://github.com/Rohitkhapre/dockerized-fullstack-starters)
[![Production](https://img.shields.io/badge/Production-Ready-success)](https://github.com/Rohitkhapre/dockerized-fullstack-starters)

*Ready to deploy. Secure by default. Scalable by design.*

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🛠️ Technology Stacks](#️-technology-stacks)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔒 Security Features](#-security-features)
- [🏗️ Production Deployment](#️-production-deployment)
- [📦 Container Registry](#-container-registry)
- [🔧 Customization](#-customization)
- [📊 Monitoring & Scaling](#-monitoring--scaling)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

This repository provides **enterprise-grade Docker configurations** for the most popular web development technologies. Each stack is:

- ✅ **Production-ready** with optimized configurations
- 🔒 **Security-hardened** with non-root users and minimal attack surface
- 🏗️ **Multi-stage builds** for optimized image sizes
- 📊 **Health checks** and monitoring enabled
- 📚 **Thoroughly documented** with real-world examples
- 🔧 **Easily customizable** for your specific needs

---

## 🛠️ Technology Stacks

<div align="center">

### Frontend Technologies
| Stack | Logo | Port | Documentation | Status |
|-------|------|------|---------------|--------|
| **React** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) | 8080 | [📖 Guide](react/README.md) | ✅ Ready |
| **Angular** | ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) | 8085 | [📖 Guide](angular/README.md) | ✅ Ready |

### Backend Technologies
| Stack | Logo | Port | Documentation | Status |
|-------|------|------|---------------|--------|
| **Node.js** | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) | 3000 | [📖 Guide](node/README.md) | ✅ Ready |
| **Python Flask** | ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) | 5000 | [📖 Guide](python-flask/README.md) | ✅ Ready |
| **Django** | ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) | 8000 | [📖 Guide](django/README.md) | ✅ Ready |
| **Ruby on Rails** | ![Rails](https://img.shields.io/badge/rails-%23CC0000.svg?style=for-the-badge&logo=ruby-on-rails&logoColor=white) | 3001 | [📖 Guide](rails/README.md) | ✅ Ready |
| **Go** | ![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white) | 8081 | [📖 Guide](go/README.md) | ✅ Ready |
| **Spring Boot** | ![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white) | 8082 | [📖 Guide](java-spring/README.md) | ✅ Ready |
| **Laravel** | ![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white) | 9000 | [📖 Guide](php-laravel/README.md) | ✅ Ready |
| **.NET Core** | ![.Net](https://img.shields.io/badge/.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white) | 8084 | [📖 Guide](dotnet/README.md) | ✅ Ready |

### Data & Caching
| Stack | Logo | Port | Documentation | Status |
|-------|------|------|---------------|--------|
| **Redis** | ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) | 6379 | [📖 Guide](redis/README.md) | ✅ Ready |

</div>

---

## 🚀 Quick Start

### Prerequisites

<div align="center">

![Requirements](https://img.shields.io/badge/Requirements-Docker%2020.10%2B-blue?style=for-the-badge&logo=docker&logoColor=white)

</div>

- **Docker Engine** 20.10+
- **Docker Compose** v2.0+
- **Git** for cloning the repository

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Rohitkhapre/dockerized-fullstack-starters.git
cd dockerized-fullstack-starters
```

### 2️⃣ Choose Your Stack

```bash
# Navigate to your preferred technology
cd node          # For Node.js
cd react         # For React
cd python-flask  # For Flask
cd redis         # For Redis
# ... and so on
```

### 3️⃣ Add Your Application Code

```bash
# Place your application in the app/ directory
cp -r /path/to/your/app/* ./app/
```

### 4️⃣ Build and Run

```bash
# Single command to build and run
docker compose up --build

# Run in background (detached mode)
docker compose up --build -d

# View logs
docker compose logs -f
```

### 5️⃣ Access Your Application

Your application will be available at the respective ports:
- **Frontend**: http://localhost:8080 (React/Angular)
- **Backend API**: http://localhost:3000 (Node.js)
- **Cache**: http://localhost:6379 (Redis)

---

## 📁 Project Structure

```
dockerized-fullstack-starters/
│
├── 📱 Frontend Stacks/
│   ├── ⚛️ react/                 # React + nginx
│   └── 🅰️ angular/               # Angular + nginx
│
├── 🖥️ Backend Stacks/
│   ├── 🟢 node/                  # Node.js + Express
│   ├── 🐍 python-flask/          # Python + Flask
│   ├── 🎸 django/                # Python + Django
│   ├── 💎 rails/                 # Ruby on Rails
│   ├── 🐹 go/                    # Go Web Server
│   ├── ☕ java-spring/           # Java + Spring Boot
│   ├── 🐘 php-laravel/           # PHP + Laravel
│   └── 🔷 dotnet/                # .NET Core
│
├── 💾 Data & Caching/
│   └── 🔴 redis/                 # Redis Cache
│
├── 🔗 Combined Examples/
│   ├── node-react/              # Full-stack Node + React
│   ├── flask-react/             # Python API + React
│   └── node-react-redis/        # Complete stack with cache
│
└── 📚 Documentation/
    ├── README.md                # This file
    └── */README.md              # Individual stack guides
```

### Individual Stack Structure

```
technology-name/
├── app/                         # 📁 Your application code goes here
├── Dockerfile                   # 🐳 Production-optimized configuration
├── docker-compose.yml           # 🎼 Orchestration with security settings
├── .dockerignore               # 🚫 Build context optimization
├── README.md                   # 📖 Detailed usage guide
└── additional-configs/         # ⚙️ (nginx.conf, redis.conf, etc.)
```

---

## 🔒 Security Features

<div align="center">

![Security](https://img.shields.io/badge/Security-First-red?style=for-the-badge&logo=shield&logoColor=white)
![Best Practices](https://img.shields.io/badge/Best-Practices-green?style=for-the-badge&logo=checkmarx&logoColor=white)

</div>

### 🛡️ Container Security
- **Non-root execution** with custom users (UID/GID 1000)
- **Read-only filesystems** with tmpfs for temporary files
- **Capability dropping** - all Linux capabilities removed
- **No new privileges** security option enabled
- **Pinned base images** with specific versions
- **Minimal attack surface** - only required packages

### 🔐 Application Security
- **Security headers** configured (CSP, HSTS, XSS protection)
- **Server tokens disabled** (nginx/apache)
- **Build cache cleanup** to reduce image size
- **Strict file permissions** (750) on application files
- **Environment variable** best practices

### 🌐 Network Security
- **Health check endpoints** for monitoring
- **Resource limits** (memory, CPU) configured
- **Proper port exposure** with documentation
- **Network isolation** with custom Docker networks

---

## 🏗️ Production Deployment

<div align="center">

![Production](https://img.shields.io/badge/Production-Ready-success?style=for-the-badge&logo=kubernetes&logoColor=white)
![Monitoring](https://img.shields.io/badge/Monitoring-Enabled-blue?style=for-the-badge&logo=prometheus&logoColor=white)

</div>

### 🌍 Environment Configuration

#### Create Environment Files
```bash
# Create .env file for production
cat > .env << EOF
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db:5432/myapp
REDIS_URL=redis://redis:6379
SECRET_KEY=your-super-secret-key
API_KEY=your-api-key
EOF
```

#### Environment-Specific Compose
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

### 🔄 CI/CD Pipeline Example

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          docker compose -f docker-compose.prod.yml build
          docker compose -f docker-compose.prod.yml up -d
```

---

## 📦 Container Registry

<div align="center">

![Docker Hub](https://img.shields.io/badge/Docker%20Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS ECR](https://img.shields.io/badge/AWS%20ECR-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Google GCR](https://img.shields.io/badge/Google%20GCR-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Azure ACR](https://img.shields.io/badge/Azure%20ACR-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)

</div>

### 🐳 Docker Hub

#### 1. Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

#### 2. Build and Tag Images
```bash
# Build your image
docker build -t your-username/app-name:tag ./node

# Tag for different versions
docker tag your-username/app-name:tag your-username/app-name:latest
docker tag your-username/app-name:tag your-username/app-name:v1.0.0
```

#### 3. Push to Docker Hub
```bash
# Push specific tag
docker push your-username/app-name:tag

# Push all tags
docker push your-username/app-name --all-tags
```

#### 4. Use in Production
```yaml
# docker-compose.prod.yml
services:
  app:
    image: your-username/app-name:v1.0.0
    # Remove 'build' directive for production
```

### ☁️ AWS Elastic Container Registry (ECR)

#### 1. Create ECR Repository
```bash
# Install AWS CLI
aws ecr create-repository --repository-name my-app --region us-west-2
```

#### 2. Get Login Token
```bash
# Get login command
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com
```

#### 3. Build and Push
```bash
# Build image
docker build -t my-app ./node

# Tag for ECR
docker tag my-app:latest 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-app:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
```

#### 4. Deploy from ECR
```yaml
# docker-compose.prod.yml
services:
  app:
    image: 123456789012.dkr.ecr.us-west-2.amazonaws.com/my-app:latest
```

### 🔵 Google Container Registry (GCR)

#### 1. Configure Authentication
```bash
# Install Google Cloud SDK
gcloud auth configure-docker
```

#### 2. Build and Push
```bash
# Build image
docker build -t gcr.io/PROJECT-ID/app-name:tag ./node

# Push to GCR
docker push gcr.io/PROJECT-ID/app-name:tag
```

#### 3. Use in Kubernetes
```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: gcr.io/PROJECT-ID/app-name:tag
```

### 🔷 Azure Container Registry (ACR)

#### 1. Create ACR
```bash
# Create resource group and ACR
az group create --name myResourceGroup --location eastus
az acr create --resource-group myResourceGroup --name myregistry --sku Basic
```

#### 2. Login and Push
```bash
# Login to ACR
az acr login --name myregistry

# Build and push
docker build -t myregistry.azurecr.io/my-app:v1 ./node
docker push myregistry.azurecr.io/my-app:v1
```

### 🚀 Private Registry Setup

#### 1. Docker Registry Server
```yaml
# registry-compose.yml
version: '3.8'
services:
  registry:
    image: registry:2
    ports:
      - "5000:5000"
    environment:
      REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data
    volumes:
      - registry-data:/data
volumes:
  registry-data:
```

#### 2. Push to Private Registry
```bash
# Tag for private registry
docker tag my-app:latest localhost:5000/my-app:latest

# Push to private registry
docker push localhost:5000/my-app:latest
```

### 📋 Registry Best Practices

#### Image Tagging Strategy
```bash
# Semantic versioning
docker tag app:latest your-registry/app:1.2.3
docker tag app:latest your-registry/app:1.2
docker tag app:latest your-registry/app:1
docker tag app:latest your-registry/app:latest

# Environment-based tags
docker tag app:latest your-registry/app:dev
docker tag app:latest your-registry/app:staging
docker tag app:latest your-registry/app:prod
```

#### Multi-Architecture Builds
```bash
# Create buildx builder
docker buildx create --name mybuilder --use

# Build for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 -t your-registry/app:latest --push ./node
```

#### Registry Security
```bash
# Use specific digest for production
docker pull your-registry/app@sha256:abc123...

# Scan images for vulnerabilities
docker scout cves your-registry/app:latest
```

---

## 🔧 Customization

### 📊 Resource Limits
```yaml
# Adjust in docker-compose.yml
services:
  app:
    mem_limit: 1g          # Memory limit
    cpus: 0.5             # CPU limit
    ulimits:
      nofile: 65536       # File descriptor limit
```

### 🔌 Add Database Services
```yaml
# PostgreSQL example
services:
  app:
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 🌐 Reverse Proxy with nginx
```yaml
# nginx-proxy example
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
```

---

## 📊 Monitoring & Scaling

<div align="center">

![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)

</div>

### 📈 Health Monitoring
```yaml
# Enhanced health checks
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 📊 Metrics Collection
```yaml
# Add Prometheus monitoring
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### 🔄 Load Balancing
```yaml
# Multiple app instances
services:
  app:
    deploy:
      replicas: 3
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - app
```

---

## 🤝 Contributing

<div align="center">

![Contributors](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge&logo=github&logoColor=white)

</div>

### 🌟 How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 Contribution Guidelines

- Follow existing security hardening patterns
- Include comprehensive documentation
- Test configurations thoroughly
- Maintain consistency with existing stacks
- Add integration examples where applicable

### 🎯 Areas for Contribution

- **New technology stacks** with similar security standards
- **Security improvements** and best practices
- **Performance optimizations**
- **Documentation enhancements**
- **CI/CD pipeline examples**
- **Kubernetes manifests**

---

## 🔍 Troubleshooting

### 🚨 Common Issues

#### Build Failures
```bash
# Check Docker version
docker --version

# Clean Docker system
docker system prune -a

# Rebuild with no cache
docker compose build --no-cache
```

#### Permission Errors
```bash
# Fix ownership issues
sudo chown -R $USER:$USER ./app

# Check file permissions
ls -la app/
```

#### Network Issues
```bash
# Check port conflicts
netstat -tulpn | grep :3000

# Restart Docker
sudo systemctl restart docker
```

#### Health Check Failures
```bash
# Check application logs
docker compose logs app

# Test health endpoint manually
curl -f http://localhost:3000/health
```

---

## 📞 Support

<div align="center">

![Support](https://img.shields.io/badge/Support-Available-success?style=for-the-badge&logo=github&logoColor=white)

</div>

- 📧 **Email**: [rkhapre111@gmail.com](mailto:rkhapre111@gmail.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Rohitkhapre/dockerized-fullstack-starters/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Rohitkhapre/dockerized-fullstack-starters/discussions)
- 📖 **Documentation**: Individual stack README files

---

## 📄 License

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Rohitkhapre/dockerized-fullstack-starters&type=Date)](https://star-history.com/#Rohitkhapre/dockerized-fullstack-starters&Date)

---

**Built with ❤️ for the developer community**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green?style=for-the-badge)
![Production Ready](https://img.shields.io/badge/Production-Ready-success?style=for-the-badge)

**⭐ Star this repository if it helped you!**

</div>

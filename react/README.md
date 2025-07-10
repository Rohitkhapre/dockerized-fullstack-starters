# React Docker Stack

This directory contains a production-ready, security-hardened Docker setup for React applications with nginx serving.

## Features

- **Multi-stage build** for optimized production builds
- **Nginx static file serving** with security headers
- **Non-root user** with custom user/group for security
- **Security headers** (CSP, HSTS, XSS protection, etc.)
- **Health checks** for container monitoring
- **Security hardening** with dropped capabilities and read-only filesystem
- **Resource limits** for production deployment

## Quick Start

1. **Add your React application code** to the `app/` directory
2. **Ensure you have** `package.json` and build scripts configured
3. **Build and run** the container:

```bash
# Build the image
docker compose build

# Run the container
docker compose up

# Run in detached mode
docker compose up -d
```

Your application will be available at `http://localhost:8080`

## Directory Structure

```
react/
├── app/                 # Your React application code goes here
│   ├── package.json     # Required: React dependencies and build scripts
│   ├── package-lock.json # Required: Locked dependencies
│   ├── public/          # Public assets
│   └── src/             # React source code
├── Dockerfile           # Production-optimized Docker configuration
├── docker-compose.yml   # Container orchestration with security settings
├── nginx.conf          # Secure nginx configuration
├── .dockerignore       # Files to exclude from Docker context
└── README.md           # This file
```

## Application Requirements

Your React application should:

1. **Have a build script** in `package.json` (usually `npm run build`)
2. **Generate a `build/` directory** when built
3. **Include all dependencies** in `package.json`

### Example `package.json`:

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Create React App Setup:

If you don't have a React app yet:

```bash
# In the app/ directory
npx create-react-app . --template typescript  # or without --template for JS
```

## Security Features

### Docker Security:
- **Non-root execution**: Runs as `webuser:webgroup` (UID/GID 1000)
- **Capability dropping**: All Linux capabilities removed
- **Read-only filesystem**: Container filesystem is read-only
- **No new privileges**: Prevents privilege escalation
- **Pinned base images**: Uses specific Node.js and nginx versions

### Nginx Security Headers:
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: XSS filtering
- **Content-Security-Policy**: Controls resource loading
- **Strict-Transport-Security**: Enforces HTTPS (configure for production)
- **Referrer-Policy**: Controls referrer information
- **Server tokens disabled**: Hides nginx version

## Production Deployment

For production deployment, consider:

1. **SSL/TLS**: Configure HTTPS with proper certificates
2. **CDN**: Use CloudFront, CloudFlare, or similar for global distribution
3. **Environment variables**: Use build-time env vars for API endpoints
4. **Monitoring**: Health check endpoint available at `/`
5. **Caching**: Leverage nginx caching and CDN for performance

### SSL Configuration Example:

```nginx
# Add to nginx.conf server block
listen 443 ssl http2;
ssl_certificate /etc/ssl/certs/cert.pem;
ssl_certificate_key /etc/ssl/private/key.pem;
```

## Build Process

The Docker build process:

1. **Build stage**: Uses Node.js to install dependencies and build the React app
2. **Production stage**: Uses nginx to serve the built static files
3. **Optimization**: Only production assets are included in final image

## Customization

### Change the port:
```yaml
# In docker-compose.yml
ports:
  - "3000:80"  # Change 8080 to your preferred port
```

### Add build-time environment variables:
```dockerfile
# In Dockerfile, add before RUN npm run build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
```

```yaml
# In docker-compose.yml
build:
  context: .
  args:
    REACT_APP_API_URL: https://api.example.com
```

### Custom nginx configuration:
Edit `nginx.conf` to modify:
- Caching policies
- Security headers
- Compression settings
- Proxy settings for API calls

### API Proxy Example:
```nginx
# Add to nginx.conf server block
location /api/ {
    proxy_pass http://backend:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Troubleshooting

### Build failures:
- Check logs: `docker compose logs`
- Verify your `package.json` and dependencies
- Ensure build script generates `build/` directory
- Check for TypeScript errors if using TS

### 404 errors on refresh:
- The nginx config includes `try_files $uri $uri/ /index.html` for SPA routing
- Ensure your React app uses client-side routing properly

### Permission errors:
- Files are served as read-only static assets
- No write operations should be needed in production

### Health check failures:
- Ensure nginx is serving files correctly
- Check if the build directory contains an `index.html`

## Performance Optimization

### Nginx caching:
```nginx
# Add to nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Compression:
```nginx
# Add to nginx.conf http block
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### Resource limits:
- **Memory limit**: Adjust `mem_limit` based on your app size
- **CPU limit**: Adjust `cpus` for your performance requirements

## Development vs Production

This setup is optimized for production. For development:
- Use `npm start` for live reloading
- Mount source code as volumes
- Remove nginx and serve directly with webpack dev server

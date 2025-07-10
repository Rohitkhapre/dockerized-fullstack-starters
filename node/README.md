# Node.js Express Docker Stack

This directory contains a production-ready, security-hardened Docker setup for Node.js Express applications.

## Features

- **Multi-stage build** for optimized image size
- **Non-root user** with custom user/group for security
- **Production environment** configuration
- **Health checks** for container monitoring
- **Security hardening** with dropped capabilities and read-only filesystem
- **Resource limits** for production deployment

## Quick Start

1. **Add your Node.js application code** to the `app/` directory
2. **Ensure you have** `package.json` and `package-lock.json` in the `app/` directory
3. **Build and run** the container:

```bash
# Build the image
docker compose build

# Run the container
docker compose up

# Run in detached mode
docker compose up -d
```

Your application will be available at `http://localhost:3000`

## Directory Structure

```
node/
├── app/                 # Your Node.js application code goes here
│   ├── package.json     # Required: Node.js dependencies
│   ├── package-lock.json # Required: Locked dependencies
│   └── index.js         # Your main application file
├── Dockerfile           # Production-optimized Docker configuration
├── docker-compose.yml   # Container orchestration with security settings
├── .dockerignore       # Files to exclude from Docker context
└── README.md           # This file
```

## Application Requirements

Your Node.js application should:

1. **Have a main entry point** (default: `index.js`)
2. **Listen on port 3000** (or update the Dockerfile EXPOSE and compose ports)
3. **Include all dependencies** in `package.json`

### Example `package.json`:

```json
{
  "name": "my-express-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

### Example `index.js`:

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

## Security Features

- **Non-root execution**: Runs as `appuser:appgroup` (UID/GID 1000)
- **Capability dropping**: All Linux capabilities removed
- **Read-only filesystem**: Container filesystem is read-only
- **No new privileges**: Prevents privilege escalation
- **Pinned base images**: Uses specific Node.js version (20.12.2)
- **Strict file permissions**: Application files have 750 permissions

## Production Deployment

For production deployment, consider:

1. **Environment variables**: Use Docker secrets or env files for sensitive data
2. **Reverse proxy**: Use nginx or similar for SSL termination
3. **Monitoring**: Health check endpoint is available at `/health`
4. **Scaling**: Use Docker Swarm or Kubernetes for horizontal scaling

## Customization

### Change the port:
1. Update `EXPOSE` in Dockerfile
2. Update `ports` in docker-compose.yml
3. Update your application to listen on the new port

### Add environment variables:
```yaml
# In docker-compose.yml
environment:
  - NODE_ENV=production
  - DATABASE_URL=your_database_url
  - API_KEY=your_api_key
```

### Mount additional volumes:
```yaml
# In docker-compose.yml
volumes:
  - ./config:/app/config:ro
  - uploads:/app/uploads
```

## Troubleshooting

### Container fails to start:
- Check logs: `docker compose logs`
- Verify your `package.json` and dependencies
- Ensure your app listens on `0.0.0.0:3000`, not `localhost:3000`

### Permission errors:
- Ensure your application doesn't try to write to read-only locations
- Use `/tmp` for temporary files (mounted as tmpfs)

### Health check failures:
- Implement a `/health` endpoint in your application
- Or update the health check command in docker-compose.yml

## Performance Tuning

- **Memory limit**: Adjust `mem_limit` in docker-compose.yml based on your app's needs
- **CPU limit**: Adjust `cpus` for your performance requirements
- **Node.js options**: Add NODE_OPTIONS environment variable for V8 tuning

## Development vs Production

This setup is optimized for production. For development:
- Add volume mounts for live code reloading
- Remove read-only and security constraints
- Use `npm run dev` with nodemon

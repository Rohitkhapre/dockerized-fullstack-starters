# Python Flask Docker Stack

This directory contains a production-ready, security-hardened Docker setup for Python Flask applications with Gunicorn WSGI server.

## Features

- **Gunicorn WSGI server** for production performance
- **Non-root user** with custom user/group for security
- **Python optimization** with unbuffered output and cache removal
- **Health checks** for container monitoring
- **Security hardening** with dropped capabilities and read-only filesystem
- **Resource limits** for production deployment

## Quick Start

1. **Add your Flask application code** to the `app/` directory
2. **Create a `requirements.txt`** file with your dependencies
3. **Ensure your main Flask app** is named `app.py` with an `app` object
4. **Build and run** the container:

```bash
# Build the image
docker compose build

# Run the container
docker compose up

# Run in detached mode
docker compose up -d
```

Your application will be available at `http://localhost:5000`

## Directory Structure

```
python-flask/
├── app/                 # Your Flask application code goes here
│   ├── requirements.txt # Required: Python dependencies
│   ├── app.py          # Required: Main Flask application
│   └── ...             # Your application modules
├── Dockerfile           # Production-optimized Docker configuration
├── docker-compose.yml   # Container orchestration with security settings
├── .dockerignore       # Files to exclude from Docker context
└── README.md           # This file
```

## Application Requirements

Your Flask application should:

1. **Have a main app file** named `app.py` with a Flask app object named `app`
2. **Include all dependencies** in `requirements.txt`
3. **Listen on all interfaces** (`0.0.0.0`) not just localhost
4. **Include gunicorn** in requirements.txt

### Example `requirements.txt`:

```txt
Flask==3.0.0
gunicorn==21.2.0
requests==2.31.0
python-dotenv==1.0.0
```

### Example `app.py`:

```python
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'flask-app'})

@app.route('/api/users')
def get_users():
    # Your API logic here
    return jsonify({'users': []})

if __name__ == '__main__':
    # For development only
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## Security Features

- **Non-root execution**: Runs as `flaskuser:flaskgroup` (UID/GID 1000)
- **Capability dropping**: All Linux capabilities removed
- **Read-only filesystem**: Container filesystem is read-only
- **No new privileges**: Prevents privilege escalation
- **Pinned base images**: Uses specific Python version (3.12.3)
- **Strict file permissions**: Application files have 750 permissions
- **Clean environment**: Pip cache removed, minimal attack surface

## Production Configuration

### Gunicorn Settings:
- **2 workers** for handling concurrent requests
- **Bind to all interfaces** (0.0.0.0:5000)
- **Production-ready** WSGI server

### Environment Variables:
```yaml
# In docker-compose.yml
environment:
  - FLASK_ENV=production
  - SECRET_KEY=your-secret-key
  - DATABASE_URL=your-database-url
```

## Scaling and Performance

### Increase Gunicorn workers:
```dockerfile
# In Dockerfile, modify CMD
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Add database connection:
```python
# In your app.py
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)
```

### Redis for caching:
```txt
# Add to requirements.txt
redis==5.0.0
flask-caching==2.1.0
```

## Development Setup

For local development without Docker:

```bash
cd app/
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Production Deployment

For production deployment, consider:

1. **Environment variables**: Use Docker secrets for sensitive data
2. **Database**: Use external database service (PostgreSQL, MySQL)
3. **Reverse proxy**: Use nginx for SSL termination and load balancing
4. **Monitoring**: Implement proper logging and metrics
5. **Scaling**: Use multiple container instances behind a load balancer

### Example with PostgreSQL:
```yaml
# docker-compose.yml for production
version: '3.8'
services:
  flask-app:
    build: .
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## API Development

### RESTful API structure:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Add to requirements.txt: flask-cors

@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify({'items': []})

@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.get_json()
    # Process data
    return jsonify({'message': 'Item created'}), 201

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404
```

## Customization

### Change the port:
1. Update `EXPOSE` in Dockerfile
2. Update `ports` in docker-compose.yml
3. Update Gunicorn bind address

### Add middleware:
```python
from flask import request
import time

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    diff = time.time() - request.start_time
    print(f"Request took {diff:.2f}s")
    return response
```

### Environment-specific configuration:
```python
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'

class ProductionConfig(Config):
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True

config = {
    'production': ProductionConfig,
    'development': DevelopmentConfig,
    'default': DevelopmentConfig
}
```

## Troubleshooting

### Import errors:
- Ensure all dependencies are in `requirements.txt`
- Check Python path and module structure
- Verify app object is properly named

### Database connection issues:
- Check DATABASE_URL environment variable
- Ensure database service is running
- Verify network connectivity between containers

### Performance issues:
- Increase Gunicorn workers
- Add database connection pooling
- Implement caching (Redis, Memcached)
- Profile your application code

### Memory usage:
- Adjust `mem_limit` in docker-compose.yml
- Monitor memory usage with tools like `htop`
- Optimize database queries

## Logging and Monitoring

### Application logging:
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def hello():
    logger.info('Hello endpoint accessed')
    return 'Hello, World!'
```

### Health check endpoint:
The `/health` endpoint is used by Docker health checks and should return service status. 
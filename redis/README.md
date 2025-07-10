# Redis Cache Docker Stack

Production-ready, security-hardened Docker setup for Redis caching server with persistence and monitoring.

## Features

- **Production-optimized** Redis 7.2.4 configuration
- **Non-root user** with security hardening
- **Data persistence** with RDB and AOF
- **Security configurations** with disabled dangerous commands
- **Health checks** and monitoring
- **Resource limits** and performance tuning

## Quick Start

1. **Build and run** the Redis container:

```bash
docker compose build
docker compose up
```

Redis will be available at `localhost:6379`

## Application Integration

### Node.js with Redis:
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  // password: 'your_redis_password' // if authentication enabled
});

client.on('error', (err) => {
  console.log('Redis Client Error', err);
});

await client.connect();

// Set a value
await client.set('key', 'value');

// Get a value
const value = await client.get('key');
console.log(value);
```

### Python with Redis:
```python
import redis

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0)

# Set a value
r.set('key', 'value')

# Get a value
value = r.get('key')
print(value.decode('utf-8'))

# Using Redis as cache decorator
from functools import wraps

def redis_cache(expiration=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            cached = r.get(key)
            if cached:
                return cached.decode('utf-8')
            result = func(*args, **kwargs)
            r.setex(key, expiration, str(result))
            return result
        return wrapper
    return decorator

@redis_cache(expiration=1800)
def expensive_operation(param):
    # Simulate expensive operation
    return f"Result for {param}"
```

### Java Spring Boot with Redis:
```java
// application.yml
spring:
  redis:
    host: localhost
    port: 6379
    timeout: 2000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0

// RedisConfig.java
@Configuration
@EnableCaching
public class RedisConfig {
    
    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(
            new RedisStandaloneConfiguration("localhost", 6379));
    }
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        return template;
    }
}

// Service class
@Service
public class CacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Cacheable(value = "users", key = "#userId")
    public User getUserById(Long userId) {
        // Database call
        return userRepository.findById(userId);
    }
    
    @CacheEvict(value = "users", key = "#user.id")
    public void updateUser(User user) {
        userRepository.save(user);
    }
}
```

## Security Features

- **Non-root execution**: Runs as `redisuser:redisgroup` (UID/GID 1000)
- **Read-only filesystem**: Container filesystem is read-only
- **Capability dropping**: All Linux capabilities removed
- **Dangerous commands disabled**: FLUSHDB, FLUSHALL, EVAL, DEBUG, CONFIG
- **Protected mode**: Enabled by default
- **Custom configuration**: Production-optimized settings

## Production Configuration

### Environment Variables:
```yaml
# In docker-compose.yml
environment:
  - REDIS_PASSWORD=your_secure_password_here
  - REDIS_REPLICATION_MODE=master
```

### Authentication Setup:
```bash
# Uncomment in redis.conf
requirepass your_redis_password_here

# Or set via environment
echo "requirepass ${REDIS_PASSWORD}" >> redis.conf
```

### Master-Slave Replication:
```yaml
# docker-compose.yml for replication
version: '3.8'
services:
  redis-master:
    build: .
    ports:
      - "6379:6379"
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=secure_password
    
  redis-slave:
    build: .
    ports:
      - "6380:6379"
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PORT=6379
      - REDIS_PASSWORD=secure_password
    depends_on:
      - redis-master
```

## Persistence Configuration

### RDB (Point-in-time snapshots):
```conf
# Configured in redis.conf
save 900 1    # Save if at least 1 key changed in 900 seconds
save 300 10   # Save if at least 10 keys changed in 300 seconds
save 60 10000 # Save if at least 10000 keys changed in 60 seconds
```

### AOF (Append Only File):
```conf
# Configured in redis.conf
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec  # Sync every second (balanced performance/durability)
```

## Monitoring and Metrics

### Redis CLI Commands:
```bash
# Connect to Redis
docker compose exec redis redis-cli

# Check server info
INFO

# Monitor commands in real-time
MONITOR

# Check memory usage
MEMORY USAGE key

# Slow log analysis
SLOWLOG GET 10

# Check latency
LATENCY LATEST
```

### Health Check Endpoint:
```bash
# Health check (returns PONG if healthy)
redis-cli ping

# Memory statistics
redis-cli info memory

# Keyspace statistics
redis-cli info keyspace
```

## Performance Optimization

### Memory Optimization:
```conf
# Configure in redis.conf
maxmemory-policy allkeys-lru
maxmemory-samples 5

# Data structure optimizations
hash-max-ziplist-entries 512
list-max-ziplist-size -2
set-max-intset-entries 512
```

### Connection Pooling:
```javascript
// Node.js Redis connection pool
const redis = require('redis');
const client = redis.createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
  pool: {
    min: 2,
    max: 10,
  }
});
```

## Common Use Cases

### Session Storage:
```python
# Flask session with Redis
from flask import Flask, session
from flask_session import Session
import redis

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.from_url('redis://localhost:6379')
Session(app)

@app.route('/login')
def login():
    session['user_id'] = 123
    return 'Logged in'
```

### Pub/Sub Messaging:
```python
import redis

r = redis.Redis(host='localhost', port=6379)

# Publisher
r.publish('notifications', 'Hello subscribers!')

# Subscriber
pubsub = r.pubsub()
pubsub.subscribe('notifications')

for message in pubsub.listen():
    if message['type'] == 'message':
        print(f"Received: {message['data'].decode('utf-8')}")
```

### Rate Limiting:
```python
def rate_limit(key, limit=100, window=3600):
    """Rate limiting using Redis"""
    pipe = r.pipeline()
    pipe.incr(key)
    pipe.expire(key, window)
    result = pipe.execute()
    
    return result[0] <= limit
```

## Customization

### Change Memory Limit:
```yaml
# In docker-compose.yml
mem_limit: 2g  # Adjust based on your needs
```

### Custom Redis Configuration:
```bash
# Edit redis.conf for custom settings
vim redis.conf

# Rebuild container
docker compose build
```

### Enable TLS:
```conf
# Add to redis.conf
tls-port 6380
tls-cert-file /path/to/redis.crt
tls-key-file /path/to/redis.key
tls-ca-cert-file /path/to/ca.crt
```

## Backup and Recovery

### Manual Backup:
```bash
# Create RDB backup
docker compose exec redis redis-cli BGSAVE

# Copy backup from container
docker cp redis-cache:/data/dump.rdb ./backup/

# AOF backup
docker cp redis-cache:/data/appendonly.aof ./backup/
```

### Automated Backup Script:
```bash
#!/bin/bash
# backup-redis.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker compose exec redis redis-cli BGSAVE
docker cp redis-cache:/data/dump.rdb ./backups/redis_backup_$DATE.rdb
echo "Redis backup created: redis_backup_$DATE.rdb"
```

## Troubleshooting

### Connection Issues:
```bash
# Check if Redis is running
docker compose ps

# Check logs
docker compose logs redis

# Test connection
docker compose exec redis redis-cli ping
```

### Memory Issues:
```bash
# Check memory usage
docker compose exec redis redis-cli info memory

# Check slow queries
docker compose exec redis redis-cli slowlog get 10

# Monitor memory in real-time
docker stats redis-cache
```

### Performance Issues:
- Increase memory limit in docker-compose.yml
- Optimize data structures in redis.conf
- Use connection pooling in applications
- Monitor slow log for expensive operations

## Development vs Production

For development:
- Remove password protection
- Disable persistence for faster startup
- Increase log level to debug
- Remove security constraints

Example development override:
```yaml
# docker-compose.override.yml
services:
  redis:
    command: redis-server --loglevel debug --save ""
    cap_drop: []
    read_only: false
``` 
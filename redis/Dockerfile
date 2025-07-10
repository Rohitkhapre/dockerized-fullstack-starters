# Redis Production Docker Image
# Maintainer: Rohit Khapre <rkhapre111@gmail.com>

# Use official Redis Alpine image for minimal size
FROM redis:7.2.4-alpine3.19

# Create non-root user for Redis
RUN addgroup -g 1000 redisgroup && \
    adduser -D -u 1000 -G redisgroup redisuser

# Copy custom Redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf

# Create directories for Redis data and logs
RUN mkdir -p /data /var/log/redis && \
    chown -R redisuser:redisgroup /data /var/log/redis && \
    chmod -R 750 /data /var/log/redis

# Set proper permissions for Redis configuration
RUN chown redisuser:redisgroup /usr/local/etc/redis/redis.conf && \
    chmod 640 /usr/local/etc/redis/redis.conf

# Remove unnecessary packages and clean cache
RUN apk del --no-cache

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD redis-cli ping || exit 1

# Switch to non-root user
USER redisuser

# Expose Redis port
EXPOSE 6379

# Set working directory
WORKDIR /data

# Labels for metadata
LABEL maintainer="Rohit Khapre <rkhapre111@gmail.com>" \
      version="1.0" \
      description="Production-ready Redis server with security hardening" \
      redis.version="7.2.4"

# Start Redis with custom configuration
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"] 
# syntax=docker/dockerfile:1
FROM node:20.12.2-alpine3.19 AS builder
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY app/package*.json ./
ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force
COPY app/ .
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app && chmod -R 750 /app

FROM node:20.12.2-alpine3.19
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app && chmod -R 750 /app
USER appuser:appgroup
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["node", "index.js"]

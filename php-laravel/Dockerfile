# syntax=docker/dockerfile:1
FROM composer:2.7.6 AS builder
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY app/composer.* ./
RUN composer install --no-dev --optimize-autoloader
COPY app/ .

FROM php:8.3.8-fpm-alpine3.19
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY --from=builder /app /app
RUN addgroup -g 1000 laravelgrp && adduser -D -u 1000 -G laravelgrp laravelusr && chown -R laravelusr:laravelgrp /app && chmod -R 750 /app
USER laravelusr:laravelgrp
EXPOSE 9000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:9000/ || exit 1
CMD ["php-fpm"]

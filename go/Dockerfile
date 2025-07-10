# syntax=docker/dockerfile:1
FROM golang:1.22.3-alpine3.19 AS builder
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY app/go.mod app/go.sum ./
RUN go mod download
COPY app/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

FROM alpine:3.19
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY --from=builder /app/server ./server
RUN addgroup -g 1000 gogrp && adduser -D -u 1000 -G gogrp gousr && chown -R gousr:gogrp /app && chmod -R 750 /app
USER gousr:gogrp
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
CMD ["./server"]

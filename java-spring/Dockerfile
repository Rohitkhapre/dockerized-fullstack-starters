# syntax=docker/dockerfile:1
FROM maven:3.9.7-eclipse-temurin-21 AS builder
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY app/pom.xml ./
RUN mvn dependency:go-offline
COPY app/ .
RUN mvn package -DskipTests

FROM eclipse-temurin:21.0.3_9-jre-alpine
LABEL maintainer="Rohit Khapre rkhapre111@gmail.com"
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN addgroup -g 1000 springgrp && adduser -D -u 1000 -G springgrp springusr && chown -R springusr:springgrp /app && chmod -R 750 /app
USER springusr:springgrp
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
CMD ["java", "-jar", "app.jar"]

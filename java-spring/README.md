# Java Spring Boot Docker Stack

Production-ready, security-hardened Docker setup for Spring Boot applications.

## Features

- **Multi-stage build** with Maven dependency caching
- **JRE-only runtime** for smaller images
- **Non-root user** with security hardening
- **Health checks** and actuator endpoints
- **Resource limits** and JVM tuning

## Quick Start

1. Add your Spring Boot application to the `app/` directory
2. Ensure `pom.xml` is configured properly
3. Application should run on port 8080

```bash
docker compose build
docker compose up
```

Application available at `http://localhost:8082`

## Application Requirements

- Spring Boot project with `pom.xml`
- Main class with `@SpringBootApplication`
- Built JAR should be executable

### Example pom.xml:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>
</project>
```

### Example Application:
```java
@SpringBootApplication
@RestController
public class DemoApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
    
    @GetMapping("/")
    public Map<String, String> hello() {
        return Map.of("message", "Hello, World!");
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "healthy", "service", "spring-app");
    }
}
```

## Security Features

- Runs as `springusr:springgrp` (UID/GID 1000)
- Read-only filesystem with tmpfs
- All Linux capabilities dropped
- Eclipse Temurin JRE (21.0.3_9-jre-alpine)
- No development tools in final image

## Configuration

### application.yml:
```yaml
server:
  port: 8080
  
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always

spring:
  datasource:
    url: ${DATABASE_URL:jdbc:h2:mem:testdb}
    username: ${DB_USERNAME:sa}
    password: ${DB_PASSWORD:}
  
  jpa:
    hibernate:
      ddl-auto: update
```

## Database Integration

### PostgreSQL:
```yaml
# docker-compose.yml
services:
  spring-app:
    build: .
    environment:
      - DATABASE_URL=jdbc:postgresql://db:5432/springapp
      - DB_USERNAME=spring
      - DB_PASSWORD=password
    depends_on:
      - db
      
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: springapp
      POSTGRES_USER: spring
      POSTGRES_PASSWORD: password
```

```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

## Customization

- JVM options: Add JAVA_OPTS environment variable
- Database: Update application.yml and dependencies
- Logging: Configure logback-spring.xml
- Profiles: Use SPRING_PROFILES_ACTIVE

## Troubleshooting

- Check logs: `docker compose logs spring-app`
- Memory issues: Adjust mem_limit and JVM heap size
- Database connection: Verify DATABASE_URL format
- Build failures: Check Maven dependencies and Java version 
# .NET ASP.NET Core Docker Stack

Production-ready, security-hardened Docker setup for ASP.NET Core applications.

## Features

- **Multi-stage build** with SDK and runtime separation
- **Alpine runtime** for minimal image size
- **Non-root user** with security hardening
- **Health checks** and built-in diagnostics
- **Resource limits** and performance optimization

## Quick Start

1. Add your ASP.NET Core application to the `app/` directory
2. Ensure `.csproj` file is configured properly
3. Application should run on port 8084

```bash
docker compose build
docker compose up
```

Application available at `http://localhost:8084`

## Application Requirements

- ASP.NET Core project with `.csproj` file
- Program.cs or Startup.cs configuration
- Built application should be executable

### Example .csproj:
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Diagnostics.HealthChecks" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
  </ItemGroup>
</Project>
```

### Example Program.cs:
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure pipeline
app.UseRouting();
app.MapControllers();
app.MapHealthChecks("/health");

app.MapGet("/", () => new { Message = "Hello, .NET!" });

app.Run();
```

### Example Controller:
```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    public IActionResult GetUsers()
    {
        return Ok(new { users = new List<object>() });
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { 
            status = "healthy", 
            service = "dotnet-app",
            timestamp = DateTime.UtcNow 
        });
    }
}
```

## Security Features

- Runs as `dotnetuser:dotnetgrp` (UID/GID 1000)
- Read-only filesystem with tmpfs
- All Linux capabilities dropped
- .NET 8.0.300-alpine3.19 runtime
- Published application (no source code)

## Configuration

### appsettings.json:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=db;Database=MyApp;User=sa;Password=YourPassword123;"
  }
}
```

### Environment Variables:
```yaml
environment:
  - ASPNETCORE_ENVIRONMENT=Production
  - ASPNETCORE_URLS=http://+:8084
  - ConnectionStrings__DefaultConnection=Server=db;Database=MyApp;User=sa;Password=Password123;
```

## Database Integration

### SQL Server:
```yaml
# docker-compose.yml
services:
  dotnet-app:
    build: .
    environment:
      - ConnectionStrings__DefaultConnection=Server=db;Database=MyApp;User=sa;Password=Password123;
    depends_on:
      - db

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=Password123
    volumes:
      - mssql_data:/var/opt/mssql

volumes:
  mssql_data:
```

### Entity Framework:
```csharp
// Add to Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DbContext
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<User> Users { get; set; }
}

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
```

## API Development

### Minimal APIs:
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/api/users", () => Results.Ok(new { users = new List<object>() }));
app.MapPost("/api/users", (User user) => Results.Created($"/api/users/{user.Id}", user));

app.Run();
```

### Authentication:
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

app.UseAuthentication();
app.UseAuthorization();
```

## Customization

- Port: Update ASPNETCORE_URLS environment variable
- Database: Configure connection strings
- Logging: Update appsettings.json or use Serilog
- HTTPS: Configure certificates and update URLs

## Performance Optimization

### Publishing:
```dockerfile
# In Dockerfile
RUN dotnet publish -c Release -o /app/publish --no-restore
```

### Runtime settings:
```json
// runtimeconfig.json
{
  "runtimeOptions": {
    "configProperties": {
      "System.GC.Server": true,
      "System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization": false
    }
  }
}
```

## Monitoring

### Health Checks:
```csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(connectionString)
    .AddRedis(redisConnectionString);

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

### Logging:
```csharp
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
```

## Troubleshooting

- Check logs: `docker compose logs dotnet-app`
- Database migrations: `dotnet ef database update`
- Port conflicts: Verify ASPNETCORE_URLS setting
- SSL issues: Configure development certificates 
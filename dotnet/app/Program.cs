using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddHealthChecks();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure pipeline
app.UseCors("AllowAll");
app.UseRouting();
app.MapControllers();
app.MapHealthChecks("/health");

// Sample data
var users = new List<User>
{
    new(1, "Alice Johnson", "alice@example.com", "admin"),
    new(2, "Bob Smith", "bob@example.com", "user"),
    new(3, "Carol Brown", "carol@example.com", "user")
};

var products = new List<Product>
{
    new(1, "Laptop", 999.99m, "Electronics", true),
    new(2, "Book", 19.99m, "Education", true),
    new(3, "Chair", 149.99m, "Furniture", false)
};

// API Endpoints
app.MapGet("/", () => new
{
    message = "Welcome to .NET Docker App!",
    version = "1.0.0",
    description = "A production-ready .NET application running in Docker",
    endpoints = new
    {
        health = "/health",
        users = "/api/users",
        products = "/api/products"
    },
    timestamp = DateTime.UtcNow
});

app.MapGet("/api/users", (string? role, int? limit) =>
{
    var filteredUsers = users.AsEnumerable();
    
    if (!string.IsNullOrEmpty(role))
    {
        filteredUsers = users.Where(u => 
            string.Equals(u.Role, role, StringComparison.OrdinalIgnoreCase));
    }
    
    if (limit.HasValue && limit > 0)
    {
        filteredUsers = filteredUsers.Take(limit.Value);
    }
    
    var result = filteredUsers.ToList();
    
    return new
    {
        success = true,
        count = result.Count,
        data = result
    };
});

app.MapGet("/api/users/{id:int}", (int id) =>
{
    var user = users.FirstOrDefault(u => u.Id == id);
    
    if (user == null)
    {
        return Results.NotFound(new
        {
            success = false,
            message = "User not found"
        });
    }
    
    return Results.Ok(new
    {
        success = true,
        data = user
    });
});

app.MapGet("/api/products", (string? category, bool? inStock) =>
{
    var filteredProducts = products.AsEnumerable();
    
    if (!string.IsNullOrEmpty(category))
    {
        filteredProducts = products.Where(p => 
            string.Equals(p.Category, category, StringComparison.OrdinalIgnoreCase));
    }
    
    if (inStock.HasValue)
    {
        filteredProducts = filteredProducts.Where(p => p.InStock == inStock.Value);
    }
    
    var result = filteredProducts.ToList();
    
    return new
    {
        success = true,
        count = result.Count,
        data = result
    };
});

app.MapGet("/api/stats", () =>
{
    var process = Process.GetCurrentProcess();
    
    return new
    {
        success = true,
        data = new
        {
            totalUsers = users.Count,
            totalProducts = products.Count,
            usersByRole = users.GroupBy(u => u.Role)
                              .ToDictionary(g => g.Key, g => g.Count()),
            productsInStock = products.Count(p => p.InStock),
            systemInfo = new
            {
                dotnetVersion = Environment.Version.ToString(),
                machineName = Environment.MachineName,
                osVersion = Environment.OSVersion.ToString(),
                workingSet = process.WorkingSet64,
                uptime = DateTime.UtcNow - Process.GetCurrentProcess().StartTime
            }
        }
    };
});

Console.WriteLine("🚀 .NET Docker App starting on port 8080");
Console.WriteLine("📱 Environment: Production");
Console.WriteLine("🔗 Health check: http://localhost:8080/health");
Console.WriteLine("📚 API endpoints: http://localhost:8080/api/users");

app.Run();

// Data models
public record User(int Id, string Name, string Email, string Role);
public record Product(int Id, string Name, decimal Price, string Category, bool InStock); 
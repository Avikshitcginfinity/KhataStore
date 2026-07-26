using BathroomStore; 
using BathroomApp.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddScoped<StoreService>();

var app = builder.Build();

app.UseCors("AllowAll");

app.MapGet("/api/customers", (StoreService service) =>
{
    return service.GetAllCustomers();
});

app.MapGet("/api/items", (StoreService service) =>
{
    return service.GetAllItems();
});

app.MapPost("/api/invoice", (StoreService service, InvoiceRequest request) =>
{
    return service.GenerateInvoice(request.CustomerId, request.Items);
});

app.Run();
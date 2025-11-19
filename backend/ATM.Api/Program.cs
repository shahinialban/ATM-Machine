using ATM.Api.Data;
using ATM.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? new[] {"http://localhost:3000"});
    });
});

builder.Services.AddDbContext<AtmContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AtmContext>();
    context.Database.Migrate();

    if (!context.Accounts.Any())
    {
        var pinHash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes("1234")));

        context.Accounts.Add(new Account
        {
            AccountNumber = "1234567890",
            UserName = "John Doe",
            PinHash = pinHash,
            Balance = 1000m
        });
        context.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ClientPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();

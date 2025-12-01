using ATM.Api.Data;
using ATM.Api.DTOs;
using ATM.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace ATM.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AtmContext _context;
    private readonly IConfiguration _configuration;

    public AdminController(AtmContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet("accounts")]
    public async Task<IActionResult> GetAllAccounts([FromHeader(Name = "adminUsername")] string? adminUsername, [FromHeader(Name = "adminPassword")] string? adminPassword, CancellationToken cancellationToken)
    {
        if (!ValidateAdminCredentials(adminUsername, adminPassword))
        {
            return Unauthorized("Invalid admin credentials");
        }

        var accounts = await _context.Accounts
            .Select(a => new
            {
                a.Id,
                a.AccountNumber,
                a.UserName,
                a.Balance
            })
            .ToListAsync(cancellationToken);

        return Ok(accounts);
    }

    [HttpPost("accounts")]
    public async Task<IActionResult> CreateAccount(CreateAccountRequest request, [FromHeader(Name = "adminUsername")] string? adminUsername, [FromHeader(Name = "adminPassword")] string? adminPassword, CancellationToken cancellationToken)
    {
        if (!ValidateAdminCredentials(adminUsername, adminPassword))
        {
            return Unauthorized("Invalid admin credentials");
        }

        if (string.IsNullOrWhiteSpace(request.AccountNumber) || string.IsNullOrWhiteSpace(request.Pin))
        {
            return BadRequest("Account number and PIN are required");
        }

        if (await _context.Accounts.AnyAsync(a => a.AccountNumber == request.AccountNumber, cancellationToken))
        {
            return BadRequest("Account number already exists");
        }

        var account = new Account
        {
            Id = Guid.NewGuid(),
            AccountNumber = request.AccountNumber,
            UserName = request.UserName ?? "User",
            PinHash = ComputeHash(request.Pin),
            Balance = request.Balance
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            account.Id,
            account.AccountNumber,
            account.UserName,
            account.Balance
        });
    }

    [HttpDelete("accounts/{accountNumber}")]
    public async Task<IActionResult> DeleteAccount(string accountNumber, [FromHeader(Name = "adminUsername")] string? adminUsername, [FromHeader(Name = "adminPassword")] string? adminPassword, CancellationToken cancellationToken)
    {
        if (!ValidateAdminCredentials(adminUsername, adminPassword))
        {
            return Unauthorized("Invalid admin credentials");
        }

        var account = await _context.Accounts
            .Include(a => a.Transactions)
            .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, cancellationToken);

        if (account is null)
        {
            return NotFound();
        }

        _context.Transactions.RemoveRange(account.Transactions);
        _context.Accounts.Remove(account);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Account deleted successfully" });
    }

    [HttpGet("accounts/{accountNumber}/recent")]
    public async Task<IActionResult> GetRecentTransactions(string accountNumber, [FromHeader(Name = "adminUsername")] string? adminUsername, [FromHeader(Name = "adminPassword")] string? adminPassword, CancellationToken cancellationToken)
    {
        if (!ValidateAdminCredentials(adminUsername, adminPassword))
        {
            return Unauthorized("Invalid admin credentials");
        }

        var account = await _context.Accounts
            .Include(a => a.Transactions)
            .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, cancellationToken);

        if (account is null)
        {
            return NotFound();
        }

        var recentTransactions = account.Transactions
            .OrderByDescending(t => t.CreatedAt)
            .Take(3)
            .Select(t => new
            {
                t.Type,
                t.Amount,
                t.CreatedAt,
                t.Description
            })
            .ToList();

        return Ok(recentTransactions);
    }

    private bool ValidateAdminCredentials(string? username, string? password)
    {
        // Prefer values from configuration (e.g. appsettings.json, environment variables)
        // Fallback to the original hard-coded defaults if not configured.
        var configuredUsername = _configuration["AdminCredentials:Username"];
        var configuredPassword = _configuration["AdminCredentials:Password"];

        var expectedUsername = string.IsNullOrWhiteSpace(configuredUsername) ? "admin" : configuredUsername;
        var expectedPassword = string.IsNullOrWhiteSpace(configuredPassword) ? "1234" : configuredPassword;

        return username == expectedUsername && password == expectedPassword;
    }

    private static string ComputeHash(string input)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }
}


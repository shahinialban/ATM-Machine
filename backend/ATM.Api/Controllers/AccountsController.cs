using ATM.Api.Data;
using ATM.Api.DTOs;
using ATM.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading;

namespace ATM.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly AtmContext _context;

    public AccountsController(AtmContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == request.AccountNumber, cancellationToken);
        if (account is null || account.PinHash != ComputeHash(request.Pin))
        {
            return Unauthorized("Invalid credentials");
        }

        await LogTransaction(account, TransactionType.Login, 0, "User login", cancellationToken);

        return Ok(new
        {
            account.Id,
            account.AccountNumber,
            account.UserName,
            account.Balance
        });
    }

    [HttpGet("{accountNumber}/balance")]
    public async Task<IActionResult> GetBalance(string accountNumber, CancellationToken cancellationToken)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, cancellationToken);
        if (account is null)
        {
            return NotFound();
        }

        await LogTransaction(account, TransactionType.BalanceCheck, 0, "Balance inquiry", cancellationToken);

        return Ok(new { account.Balance });
    }

    [HttpPost("{accountNumber}/deposit")]
    public async Task<IActionResult> Deposit(string accountNumber, TransactionRequest request, CancellationToken cancellationToken)
    {
        if (request.Amount <= 0)
        {
            return BadRequest("Amount must be greater than zero");
        }

        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, cancellationToken);
        if (account is null)
        {
            return NotFound();
        }

        account.Balance += request.Amount;
        await LogTransaction(account, TransactionType.Deposit, request.Amount, request.Description ?? "ATM deposit", cancellationToken);
        return Ok(new { account.Balance });
    }

    [HttpPost("{accountNumber}/withdraw")]
    public async Task<IActionResult> Withdraw(string accountNumber, TransactionRequest request, CancellationToken cancellationToken)
    {
        if (request.Amount <= 0)
        {
            return BadRequest("Amount must be greater than zero");
        }

        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, cancellationToken);
        if (account is null)
        {
            return NotFound();
        }

        if (account.Balance < request.Amount)
        {
            return BadRequest("Insufficient funds");
        }

        account.Balance -= request.Amount;
        await LogTransaction(account, TransactionType.Withdrawal, request.Amount, request.Description ?? "ATM withdrawal", cancellationToken);
        return Ok(new { account.Balance });
    }

    [HttpGet("{accountNumber}/transactions")]
    public async Task<IActionResult> GetTransactions(string accountNumber, CancellationToken cancellationToken)
    {
        var account = await _context.Accounts.Include(a => a.Transactions)
            .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, cancellationToken);
        if (account is null)
        {
            return NotFound();
        }

        var history = account.Transactions
            .OrderByDescending(t => t.CreatedAt)
            .Take(20)
            .Select(t => new
            {
                t.Type,
                t.Amount,
                t.CreatedAt,
                t.Description
            });

        return Ok(history);
    }

    private async Task LogTransaction(Account account, TransactionType type, decimal amount, string description, CancellationToken cancellationToken)
    {
        var transaction = new Transaction
        {
            AccountId = account.Id,
            Type = type,
            Amount = amount,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private static string ComputeHash(string input)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }
}


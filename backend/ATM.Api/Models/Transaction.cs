namespace ATM.Api.Models;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? Description { get; set; }

    public Account? Account { get; set; }
}

public enum TransactionType
{
    Deposit,
    Withdrawal,
    BalanceCheck,
    Login
}


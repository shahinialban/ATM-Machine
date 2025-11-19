namespace ATM.Api.Models;

public class Account
{
    public Guid Id { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string PinHash { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}

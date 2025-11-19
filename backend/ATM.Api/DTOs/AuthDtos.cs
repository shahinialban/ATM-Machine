namespace ATM.Api.DTOs;

public record LoginRequest(string AccountNumber, string Pin);
public record TransactionRequest(decimal Amount, string? Description);
public record CreateAccountRequest(string AccountNumber, string Pin, string? UserName, decimal Balance);


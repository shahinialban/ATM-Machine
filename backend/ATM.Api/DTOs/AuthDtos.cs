namespace ATM.Api.DTOs;

public record LoginRequest(string AccountNumber, string Pin);
public record TransactionRequest(decimal Amount, string? Description);


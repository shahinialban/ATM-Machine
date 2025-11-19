using ATM.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ATM.Api.Data;

public class AtmContext : DbContext
{
    public AtmContext(DbContextOptions<AtmContext> options) : base(options)
    {
    }

    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.AccountNumber)
                  .IsRequired()
                  .HasMaxLength(20);
            entity.Property(a => a.PinHash)
                  .IsRequired();
            entity.Property(a => a.Balance)
                  .HasColumnType("numeric(18,2)");

            entity.HasMany(a => a.Transactions)
                  .WithOne(t => t.Account!)
                  .HasForeignKey(t => t.AccountId);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Type)
                  .HasConversion<string>()
                  .HasMaxLength(25);
            entity.Property(t => t.Amount)
                  .HasColumnType("numeric(18,2)");
            entity.Property(t => t.Description)
                  .HasMaxLength(200);
        });

        base.OnModelCreating(modelBuilder);
    }
}

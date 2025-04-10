using Microsoft.EntityFrameworkCore;
using TripPlannerService.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace TripPlannerService.Data;

public class TripDbContext : DbContext
{
    public TripDbContext(DbContextOptions<TripDbContext> options) : base(options) { }

    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<TransportOption> TransportOptions => Set<TransportOption>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Convertire pentru lista de activități
        var converter = new ValueConverter<List<string>, string>(
            v => string.Join(",", v),
            v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
        );

        var comparer = new ValueComparer<List<string>>(
            (c1, c2) => c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        modelBuilder.Entity<Trip>()
            .Property(t => t.Activities)
            .HasConversion(converter)
            .Metadata.SetValueComparer(comparer);

        // Relatie Trip -> Destination
        modelBuilder.Entity<Trip>()
            .HasOne(t => t.Destination)
            .WithMany(d => d.Trips)
            .HasForeignKey(t => t.DestinationId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relatie Trip -> Review
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Trip)
            .WithMany(t => t.Reviews)
            .HasForeignKey(r => r.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Trip>()
            .HasOne(t => t.TransportOption)
            .WithMany(to => to.Trips)
            .HasForeignKey(t => t.TransportOptionId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}

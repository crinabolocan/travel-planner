using Microsoft.EntityFrameworkCore;
using TripPlannerService.Models;

namespace TripPlannerService.Data;

public static class DbInitializer
{
    public static void ApplyMigration(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TripDbContext>();
        db.Database.Migrate(); // Aplica migratiile

        SeedTransportOptions(db);
    }

    private static void SeedTransportOptions(TripDbContext db)
    {
        if (!db.TransportOptions.Any())
        {
            db.TransportOptions.AddRange(
                new TransportOption { Type = "Bus", Company = "Flixbus", Price = 40 }
            );

            db.SaveChanges();
        }
    }
}


using Microsoft.EntityFrameworkCore;

namespace TripPlannerService.Data;

public static class DbInitializer
{
    public static void ApplyMigration(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TripDbContext>();
        db.Database.Migrate(); // ✅ aplică toate migrările
    }
}

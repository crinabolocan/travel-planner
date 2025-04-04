using Microsoft.EntityFrameworkCore;
using UserDataService.Data;

namespace UserDataService;

public static class DbInitializer
{
    public static void Initialize(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<UserDbContext>();
        context.Database.Migrate(); // aplicã automat toate migrãrile
    }
}

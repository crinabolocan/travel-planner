using Microsoft.EntityFrameworkCore;
using UserDataService.Models;

namespace UserDataService.Data;

public class UserDbContext : DbContext
{
	public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

	public DbSet<User> Users => Set<User>();
}

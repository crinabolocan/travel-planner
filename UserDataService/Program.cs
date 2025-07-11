using UserDataService.Data;
using Microsoft.EntityFrameworkCore;
using UserDataService;
using Prometheus;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<UserDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseAuthorization();
app.MapControllers();

app.UseMetricServer();
app.UseHttpMetrics();

app.UseSwagger();
app.UseSwaggerUI();

DbInitializer.Initialize(app);

app.Run();

using System.Text.Json.Serialization;
using EverySecondLetter.Api;
using EverySecondLetter.Services;

var builder = WebApplication.CreateBuilder(args);

// ---- Config ----
var dbSettings = Db.ResolveDatabaseSettings(
    builder.Configuration.GetConnectionString("Default"),
    Environment.GetEnvironmentVariable("DATABASE_URL"),
    Environment.GetEnvironmentVariable("DB_PROVIDER"),
    Environment.GetEnvironmentVariable("SQLITE_PATH"));

builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddGameDependencies(dbSettings);

var app = builder.Build();

// ---- Initialize database ----
await SeedDb.InitializeAsync(
    app.Services.GetRequiredService<EverySecondLetter.Services.Database.IDbConnectionFactory>(),
    dbSettings.Provider);

app.UseSwagger();
app.UseSwaggerUI();
app.UseGameApiPipeline();
app.MapGameEndpoints();

app.Run();

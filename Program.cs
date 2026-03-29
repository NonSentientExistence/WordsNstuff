using System.Text.Json.Serialization;
using EverySecondLetter.Services;
using EverySecondLetter.Services.Database;
using EverySecondLetter.Gameplay.EverySecondLetter;

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

builder.Services.AddSingleton(dbSettings);
if (dbSettings.Provider == DbProvider.Sqlite)
{
    builder.Services.AddSingleton<IDbConnectionFactory>(_ => new SqliteConnectionFactory(dbSettings.ConnectionString));
    builder.Services.AddSingleton<ISqlDialect, SqliteSqlDialect>();
}
else
{
    builder.Services.AddSingleton<IDbConnectionFactory>(_ => new NpgsqlConnectionFactory(dbSettings.ConnectionString));
    builder.Services.AddSingleton<ISqlDialect, PostgresSqlDialect>();
}
builder.Services.AddSingleton<WordsService>();
builder.Services.AddSingleton<EverySecondLetterGameDefinition>();
builder.Services.AddSingleton<GamesService>();

var app = builder.Build();

// ---- Initialize database ----
await SeedDb.InitializeAsync(
    app.Services.GetRequiredService<IDbConnectionFactory>(),
    dbSettings.Provider);

app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();

// ---- Lightweight API error -> ProblemDetails ----
app.Use(async (ctx, next) =>
{
    try
    {
        await next();
    }
    catch (EverySecondLetter.Services.ApiException ex)
    {
        ctx.Response.StatusCode = ex.StatusCode;
        await ctx.Response.WriteAsJsonAsync(new { error = ex.Message, status = ex.StatusCode });
    }
});

app.UseDefaultFiles();
app.UseStaticFiles();

// ---- SPA Fallback: For React routing, rewrite non-file requests to index.html ----
app.Use(async (ctx, next) =>
{
    var path = ctx.Request.Path.Value ?? "/";
    var ext = Path.GetExtension(path);
    
    // Skip API routes, routes with file extensions
    if (!path.StartsWith("/games") && string.IsNullOrEmpty(ext) && path != "/" && path != "/index.html")
    {
        ctx.Request.Path = "/index.html";
    }
    
    await next();
});

// ---- Routes (outer imperative layer) ----

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/client-ip", (HttpContext ctx) =>
{
    var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    return Results.Ok(new { ip });
});

app.MapPost("/games", async (PlayerRegistrationRequest? req, GamesService games) =>
{
    var result = await games.CreateGameAsync(req?.PlayerName);
    return Results.Created($"/games/{result.GameId}", result);
});

app.MapPost("/games/{gameId:guid}/join", async (Guid gameId, PlayerRegistrationRequest? req, HttpRequest http, GamesService games) =>
{
    var playerToken = TryGetPlayerToken(http);
    var result = await games.JoinGameAsync(gameId, req?.PlayerName, playerToken);
    return Results.Ok(result);
});

app.MapGet("/games/{gameId:guid}", async (Guid gameId, GamesService games) =>
{
    try
    {
        var state = await games.GetStateAsync(gameId);
        return Results.Ok(state);
    }
    catch (EverySecondLetter.Services.ApiException ex)
    {
        return Results.Problem(ex.Message, statusCode: ex.StatusCode);
    }
});

app.MapPost("/games/{gameId:guid}/letter", async (Guid gameId, PlayLetterRequest req, HttpRequest http, GamesService games) =>
{
    var playerToken = RequirePlayerToken(http);
    var state = await games.PlayLetterAsync(gameId, playerToken, req.Letter);
    return Results.Ok(state);
});

app.MapPost("/games/{gameId:guid}/claim", async (Guid gameId, HttpRequest http, GamesService games) =>
{
    var playerToken = RequirePlayerToken(http);
    var state = await games.ClaimWordAsync(gameId, playerToken);
    return Results.Ok(state);
});

app.MapPost("/games/{gameId:guid}/accept", async (Guid gameId, HttpRequest http, GamesService games) =>
{
    var playerToken = RequirePlayerToken(http);
    var state = await games.AcceptClaimAsync(gameId, playerToken);
    return Results.Ok(state);
});

app.MapPost("/games/{gameId:guid}/dispute", async (Guid gameId, HttpRequest http, GamesService games) =>
{
    var playerToken = RequirePlayerToken(http);
    var state = await games.DisputeClaimAsync(gameId, playerToken);
    return Results.Ok(state);
});

app.MapPost("/games/{gameId:guid}/validate-word", (Guid gameId, ValidateWordRequest req, WordsService words) =>
{
    if (string.IsNullOrWhiteSpace(req.Word))
        throw new ApiException(400, "Word is required.");

    var isValid = words.IsValid(req.Word);
    return Results.Ok(new { word = req.Word, valid = isValid });
});

app.Run();

static Guid RequirePlayerToken(HttpRequest http)
{
    if (!http.Headers.TryGetValue("X-Player-Token", out var values))
        throw new ApiException(401, "Missing X-Player-Token header.");
    if (!Guid.TryParse(values.FirstOrDefault(), out var token))
        throw new ApiException(401, "Invalid X-Player-Token header.");
    return token;
}

static Guid? TryGetPlayerToken(HttpRequest http)
{
    if (!http.Headers.TryGetValue("X-Player-Token", out var values))
        return null;
    return Guid.TryParse(values.FirstOrDefault(), out var token) ? token : null;
}

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

Database.Initialize();
var greeter = new Greeter();
var lobbyService = new LobbyService();

app.MapGet("/api/hello", () => new { message = "Hello from .NET!" });
app.MapGet("/api/greet/{name}", (string name) => new { message = greeter.Greet(name) });

app.MapPost("/api/lobbies", (HttpRequest request) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");
    var code = lobbyService.CreateLobby(token);
    return Results.Ok(new { code });
});

app.MapPost("/api/lobbies/{code}/join", (string code, HttpRequest request) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");
    var joined = lobbyService.JoinLobby(code, token);
    return joined ? Results.Ok() : Results.BadRequest("Could not join lobby");
});

app.MapGet("/api/lobbies/{code}", (string code) =>
{
    var lobby = lobbyService.GetLobby(code);
    return lobby is not null ? Results.Ok(lobby) : Results.NotFound();
});

app.MapPost("/api/lobbies/{code}/start", (string code, HttpRequest request) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");
    var started = lobbyService.StartGame(code, token);
    return started ? Results.Ok() : Results.BadRequest("Could not start game");
});

app.Run();

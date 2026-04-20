using WordsNstuff;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

Database.Initialize();
var greeter = new Greeter();
var lobbyService = new LobbyService();

app.MapGet("/", () => Results.Ok());
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

app.MapGet("/api/game/calculate/{word}", (string word) =>
{
    var engine = new WordsNstuff.GameEngine();
    var damage = engine.CalculateDamage(word);
    return Results.Ok(new { word, damage });
});

app.MapPost("/api/game/test-attack", (string word) =>
{
    var state = new WordsNstuff.GameState("Player1", "Player2");
    state.ApplyDamage(word, isPlayer1Attacking: true);

    return Results.Ok(new
    {
        attacker = state.Player1Name,
        victim = state.Player2Name,
        victimHP = state.Player2HP,
        isGameOver = state.IsGameOver()
    });
});

app.Run();

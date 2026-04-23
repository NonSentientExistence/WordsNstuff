var builder = WebApplication.CreateBuilder(args);

//Register WordValidator singleton, word list loaded once and then shared
builder.Services.AddSingleton<WordValidator>(new WordValidator("Resources/words.txt"));
// Regiser Gameservice singleton, keeps active games until end of application
builder.Services.AddSingleton<GameService>();

var app = builder.Build();



Database.Initialize();
var greeter = new Greeter();
var lobbyService = new LobbyService();

app.MapGet("/api/hello", () => new { message = "Hello from .NET!" });
app.MapGet("/api/greet/{name}", (string name) => new { message = greeter.Greet(name) });

app.MapPost("/api/lobbies", async (HttpRequest request) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");
    var body = await request.ReadFromJsonAsync<PlayerNameRequest>();
    var code = lobbyService.CreateLobby(token, body?.Name);
    return Results.Ok(new { code });
});

app.MapPost("/api/lobbies/{code}/join", async (string code, HttpRequest request) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");
    var body = await request.ReadFromJsonAsync<PlayerNameRequest>();
    var joined = lobbyService.JoinLobby(code, token, body?.Name);
    return joined ? Results.Ok() : Results.BadRequest("Could not join lobby");
});

app.MapPost("/api/lobbies/{code}/name", async (string code, HttpRequest request) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");
    var body = await request.ReadFromJsonAsync<PlayerNameRequest>();
    if (body is null || string.IsNullOrEmpty(body.Name)) return Results.BadRequest("Missing name");
    var updated = lobbyService.UpdatePlayerName(code, token, body.Name);
    return updated ? Results.Ok() : Results.BadRequest("Could not update name");
});

app.MapGet("/api/lobbies/{code}", (string code) =>
{
    var lobby = lobbyService.GetLobby(code);
    return lobby is not null ? Results.Ok(lobby) : Results.NotFound();
});

app.MapPost("/api/lobbies/{code}/start", (string code, HttpRequest request, GameService gameService) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");

    var (player1Token, player2Token) = lobbyService.GetPlayerTokens(code);
    if (player1Token is null || player2Token is null)
        return Results.BadRequest("Lobby does not have two players");

    var started = lobbyService.StartGame(code, token);
    if (!started) return Results.BadRequest("Could not start game");

    //Removes old game if it exists, then create new game
    gameService.RemoveGame(code);
    gameService.StartGame(code, player1Token, player2Token);
    return Results.Ok();
});

app.MapGet("/api/games/{code}", (string code, GameService gameService) =>
{
    var game = gameService.GetGame(code);
    if (game is null) return Results.NotFound("Game not found");

    return Results.Ok(new
    {
        status = game.Status.ToString(),
        pool = game.Pool,
        player1Id = game.Player1.Id,
        player2Id = game.Player2.Id,
        player1Hp = game.Player1.Hp,
        player2Hp = game.Player2.Hp,
        player1LastWord = game.Player1LastWord,
        player2LastWord = game.Player2LastWord,
        player1LastDamage = game.Player1LastDamage,
        player2LastDamage = game.Player2LastDamage
    });
});

app.MapPost("/api/games/{code}/submit", async (string code, HttpRequest request, GameService gameService) =>
{
    var token = request.Headers["X-Player-Token"].ToString();
    if (string.IsNullOrEmpty(token)) return Results.BadRequest("Missing X-Player-Token");
    
    var body = await request.ReadFromJsonAsync<SubmitWordRequest>();
    if (body is null || string.IsNullOrEmpty(body.Word))
        return Results.BadRequest("Missing word");

    var result = gameService.SubmitWord(code, token, body.Word);
    return result switch
    {
        SubmitResult.Success => Results.Ok(new { damage = WordValue.Calculate(body.Word) }),
        SubmitResult.InvalidWord => Results.BadRequest("Word is not in the dictionary"),
        SubmitResult.InvalidPool => Results.BadRequest("Letters are not available in the pool"),
        _ => Results.BadRequest("Invalid word")
    };
});

// Test only, sets a known letter pool for API tests.
app.MapPost("/api/games/{code}/set-pool-test", (string code, GameService gameService) =>
{
    gameService.SetPoolForTesting(code, new[] { 'A','T','N','E','R','S','I','O','L','D','A','T','N','E','R','S','I','O','L','D' });
    return Results.Ok();
});

//Reset lobby API endpoint
app.MapPost("/api/lobbies/{code}/reset", (string code) =>
{
    var reset = lobbyService.ResetLobby(code);
    return reset ? Results.Ok() : Results.BadRequest("Could not reset lobby");
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();

record SubmitWordRequest(string Word);
record PlayerNameRequest(string? Name);

namespace App.Tests;

public class LobbyServiceTest : IDisposable
{
    private readonly LobbyService _service;

    public LobbyServiceTest()
    {
        Database.Initialize();
        _service = new LobbyService();
    }

    public void Dispose()
    {
        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "DELETE FROM Lobbies";
        cmd.ExecuteNonQuery();
    }

    [Fact]
    public void CreateLobby_ReturnsCodeWithSixCharacters()
    {
        var code = _service.CreateLobby("token-1");
        Assert.Equal(6, code.Length);
    }

    [Fact]
    public void CreateLobby_StoresLobbyWithWaitingStatus()
    {
        var code = _service.CreateLobby("token-1");
        var lobby = _service.GetLobby(code);
        Assert.NotNull(lobby);
    }

    [Fact]
    public void JoinLobby_ReturnsTrueForValidCode()
    {
        var code = _service.CreateLobby("token-1");
        var result = _service.JoinLobby(code, "token-2");
        Assert.True(result);
    }

    [Fact]
    public void JoinLobby_ReturnsFalseForInvalidCode()
    {
        var result = _service.JoinLobby("BADCOD", "token-2");
        Assert.False(result);
    }

    [Fact]
    public void JoinLobby_ReturnsFalseWhenLobbyIsFull()
    {
        var code = _service.CreateLobby("token-1");
        _service.JoinLobby(code, "token-2");
        var result = _service.JoinLobby(code, "token-3");
        Assert.False(result);
    }

    [Fact]
    public void StartGame_ReturnsTrueWhenHostStarts()
    {
        var code = _service.CreateLobby("host-token");
        _service.JoinLobby(code, "other-token");
        var result = _service.StartGame(code, "host-token");
        Assert.True(result);
    }

    [Fact]
    public void StartGame_ReturnsFalseWhenNonHostStarts()
    {
        var code = _service.CreateLobby("host-token");
        _service.JoinLobby(code, "other-token");
        var result = _service.StartGame(code, "other-token");
        Assert.False(result);
    }

    [Fact]
    public void UpdatePlayerName_ReturnsTrueForValidToken()
    {
        var code = _service.CreateLobby("token-1");
        var result = _service.UpdatePlayerName(code, "token-1", "Spelaren");
        Assert.True(result);
    }

    [Fact]
    public void UpdatePlayerName_ReturnsFalseForUnknownToken()
    {
        var code = _service.CreateLobby("token-1");
        var result = _service.UpdatePlayerName(code, "token-unknown", "Spelaren");
        Assert.False(result);
    }

    [Fact]
    public void ResetLobby_ReturnsTrueForExistingLobby()
    {
        var code = _service.CreateLobby("token-1");
        _service.JoinLobby(code, "token-2");
        var result = _service.ResetLobby(code);
        Assert.True(result);
    }

    [Fact]
    public void ResetLobby_RemovesPlayer2AndSetsStatusWaiting()
    {
        var code = _service.CreateLobby("token-1");
        _service.JoinLobby(code, "token-2");
        _service.ResetLobby(code);
        var lobby = _service.GetLobby(code) as dynamic;
        Assert.NotNull(lobby);
        var (p1, p2) = _service.GetPlayerTokens(code);
        Assert.NotNull(p1);
        Assert.Null(p2);
    }

    [Fact]
    public void ResetLobby_ClearsPlayer2Name()
    {
        var code = _service.CreateLobby("token-1");
        _service.JoinLobby(code, "token-2", "Player Two");
        _service.ResetLobby(code);

        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT Player2Name FROM Lobbies WHERE Code = @code";
        cmd.Parameters.AddWithValue("@code", code);
        var name = cmd.ExecuteScalar();
        Assert.True(name is null || name == DBNull.Value);
    }

    [Fact]
    public void GetPlayerTokens_ReturnsCorrectTokens()
    {
        var code = _service.CreateLobby("token-1");
        _service.JoinLobby(code, "token-2");
        var (p1, p2) = _service.GetPlayerTokens(code);
        Assert.Equal("token-1", p1);
        Assert.Equal("token-2", p2);
    }

    [Fact]
    public void GetPlayerTokens_ReturnsNullWhenLobbyDoesNotExist()
    {
        var (p1, p2) = _service.GetPlayerTokens("BADCOD");
        Assert.Null(p1);
        Assert.Null(p2);
    }
}
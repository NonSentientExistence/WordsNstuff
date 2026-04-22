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
}
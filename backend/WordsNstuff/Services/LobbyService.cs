using Microsoft.Data.Sqlite;

public class LobbyService
{
    public string CreateLobby(string playerToken)
    {
        var code = Guid.NewGuid().ToString()[..6].ToUpper();

        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO Lobbies (Code, Player1Token, Status, CreatedAt)
            VALUES (@code, @token, 'waiting', @now)";
        cmd.Parameters.AddWithValue("@code", code);
        cmd.Parameters.AddWithValue("@token", playerToken);
        cmd.Parameters.AddWithValue("@now", DateTime.UtcNow.ToString("o"));
        cmd.ExecuteNonQuery();

        return code;
    }

    public (string? player1Token, string? player2Token) GetPlayerTokens(string code)
{
    using var connection = Database.GetConnection();
    var cmd = connection.CreateCommand();
    cmd.CommandText = "SELECT Player1Token, Player2Token FROM Lobbies WHERE Code = @code";
    cmd.Parameters.AddWithValue("@code", code);
    using var reader = cmd.ExecuteReader();
    if (!reader.Read()) return (null, null);
    return (
        reader.GetString(0),
        reader.IsDBNull(1) ? null : reader.GetString(1)
    );
}

    public bool JoinLobby(string code, string playerToken)
    {
        using var connection = Database.GetConnection();
        var checkCmd = connection.CreateCommand();
        checkCmd.CommandText = "SELECT Player1Token FROM Lobbies WHERE code = @code";
        checkCmd.Parameters.AddWithValue("@code", code);
        var player1 = checkCmd.ExecuteScalar()?.ToString();
        if (player1 == playerToken) return true;
        
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            UPDATE Lobbies 
            SET Player2Token = @token, Status = 'ready'
            WHERE Code = @code AND Player2Token IS NULL AND Player1Token != @token";
        cmd.Parameters.AddWithValue("@code", code);
        cmd.Parameters.AddWithValue("@token", playerToken);
        return cmd.ExecuteNonQuery() > 0;
    }

    public object? GetLobby(string code)
    {
        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT Player1Token, Player2Token, Status FROM Lobbies WHERE Code = @code";
        cmd.Parameters.AddWithValue("@code", code);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read()) return null;

        var playerCount = reader.IsDBNull(1) ? 1 : 2;
        return new
        {
            code,
            playerCount,
            status = reader.GetString(2)
        };
    }

    public bool StartGame(string code, string playerToken)
    {
        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            UPDATE Lobbies 
            SET Status = 'playing'
            WHERE Code = @code AND Player1Token = @token AND Status = 'ready'";
        cmd.Parameters.AddWithValue("@code", code);
        cmd.Parameters.AddWithValue("@token", playerToken);
        return cmd.ExecuteNonQuery() > 0;
    }
}

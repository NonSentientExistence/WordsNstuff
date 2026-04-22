using Microsoft.Data.Sqlite;

public class LobbyService
{
    public string CreateLobby(string playerToken, string? playerName = null)
    {
        var code = Guid.NewGuid().ToString()[..6].ToUpper();

        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            INSERT INTO Lobbies (Code, Player1Token, Player1Name, Status, CreatedAt)
            VALUES (@code, @token, @name, 'waiting', @now)";
        cmd.Parameters.AddWithValue("@code", code);
        cmd.Parameters.AddWithValue("@token", playerToken);
        cmd.Parameters.AddWithValue("@name", (object?)playerName ?? DBNull.Value);
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

    public bool JoinLobby(string code, string playerToken, string? playerName = null)
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
            SET Player2Token = @token, Player2Name = @name, Status = 'ready'
            WHERE Code = @code AND Player2Token IS NULL AND Player1Token != @token";
        cmd.Parameters.AddWithValue("@code", code);
        cmd.Parameters.AddWithValue("@token", playerToken);
        cmd.Parameters.AddWithValue("@name", (object?)playerName ?? DBNull.Value);
        return cmd.ExecuteNonQuery() > 0;
    }

    public bool UpdatePlayerName(string code, string playerToken, string name)
    {
        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = @"
            UPDATE Lobbies
            SET Player1Name = CASE WHEN Player1Token = @token THEN @name ELSE Player1Name END,
                Player2Name = CASE WHEN Player2Token = @token THEN @name ELSE Player2Name END
            WHERE Code = @code AND (Player1Token = @token OR Player2Token = @token)";
        cmd.Parameters.AddWithValue("@code", code);
        cmd.Parameters.AddWithValue("@token", playerToken);
        cmd.Parameters.AddWithValue("@name", name);
        return cmd.ExecuteNonQuery() > 0;
    }

    public object? GetLobby(string code)
    {
        using var connection = Database.GetConnection();
        var cmd = connection.CreateCommand();
        cmd.CommandText = "SELECT Player1Token, Player2Token, Status, Player1Name, Player2Name FROM Lobbies WHERE Code = @code";
        cmd.Parameters.AddWithValue("@code", code);

        using var reader = cmd.ExecuteReader();
        if (!reader.Read()) return null;

        var playerCount = reader.IsDBNull(1) ? 1 : 2;
        return new
        {
            code,
            playerCount,
            status = reader.GetString(2),
            player1Name = reader.IsDBNull(3) ? null : reader.GetString(3),
            player2Name = reader.IsDBNull(4) ? null : reader.GetString(4)
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

using Microsoft.Data.Sqlite;

public static class Database
{
    private const string ConnectionString = "Data Source=wordsnstuff.db";

    public static SqliteConnection GetConnection()
    {
        var connection = new SqliteConnection(ConnectionString);
        connection.Open();
        return connection;
    }

    public static void Initialize()
    {
        using var connection = GetConnection();
        var command = connection.CreateCommand();
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS Lobbies (
                Code TEXT PRIMARY KEY,
                Player1Token TEXT NOT NULL,
                Player2Token TEXT,
                Status TEXT NOT NULL DEFAULT 'waiting',
                CreatedAt TEXT NOT NULL
            )";
        command.ExecuteNonQuery();

        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS Games (
                LobbyCode TEXT PRIMARY KEY,
                CurrentTurnToken TEXT NOT NULL,
                LetterPool TEXT NOT NULL DEFAULT '',
                Player1Hand TEXT NOT NULL DEFAULT '',
                Player2Hand TEXT NOT NULL DEFAULT '',
                Player1Health INTEGER NOT NULL DEFAULT 100,
                Player2Health INTEGER NOT NULL DEFAULT 100
            )";
        command.ExecuteNonQuery();
    }
}

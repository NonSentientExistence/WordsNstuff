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

        // Migrate: add name columns if they don't exist
        foreach (var col in new[] { "Player1Name", "Player2Name" })
        {
            try
            {
                var alter = connection.CreateCommand();
                alter.CommandText = $"ALTER TABLE Lobbies ADD COLUMN {col} TEXT";
                alter.ExecuteNonQuery();
            }
            catch { /* column already exists */ }
        }
    }
}

using System.Data.Common;
using Microsoft.Data.Sqlite;

namespace EverySecondLetter.Services.Database;

public sealed class SqliteConnectionFactory(string connectionString) : IDbConnectionFactory
{
    public async Task<DbConnection> OpenConnectionAsync(CancellationToken cancellationToken = default)
    {
        var conn = new SqliteConnection(connectionString);
        await conn.OpenAsync(cancellationToken);

        await using var pragma = conn.CreateCommand();
        pragma.CommandText = "PRAGMA foreign_keys = ON;";
        await pragma.ExecuteNonQueryAsync(cancellationToken);

        return conn;
    }
}

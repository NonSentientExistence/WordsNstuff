using System.Data.Common;
using Npgsql;

namespace EverySecondLetter.Services.Database;

public sealed class NpgsqlConnectionFactory(string connectionString) : IDbConnectionFactory
{
    public async Task<DbConnection> OpenConnectionAsync(CancellationToken cancellationToken = default)
    {
        var conn = new NpgsqlConnection(connectionString);
        await conn.OpenAsync(cancellationToken);
        return conn;
    }
}

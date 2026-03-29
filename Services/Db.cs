using EverySecondLetter.Services.Database;

namespace EverySecondLetter.Services;

public static class Db
{
    public static DatabaseSettings ResolveDatabaseSettings(string? configuredConnectionString, string? databaseUrl, string? providerOverride, string? sqlitePath)
    {
        var provider = ResolveProvider(configuredConnectionString, databaseUrl, providerOverride, sqlitePath);
        return provider switch
        {
            DbProvider.Postgres => new DatabaseSettings(DbProvider.Postgres, ResolvePostgresConnectionString(configuredConnectionString, databaseUrl)),
            DbProvider.Sqlite => new DatabaseSettings(DbProvider.Sqlite, ResolveSqliteConnectionString(configuredConnectionString, databaseUrl, sqlitePath)),
            _ => throw new InvalidOperationException("Unsupported database provider.")
        };
    }

    private static DbProvider ResolveProvider(string? configuredConnectionString, string? databaseUrl, string? providerOverride, string? sqlitePath)
    {
        if (!string.IsNullOrWhiteSpace(providerOverride))
        {
            if (providerOverride.Equals("sqlite", StringComparison.OrdinalIgnoreCase))
                return DbProvider.Sqlite;
            if (providerOverride.Equals("postgres", StringComparison.OrdinalIgnoreCase) || providerOverride.Equals("postgresql", StringComparison.OrdinalIgnoreCase))
                return DbProvider.Postgres;
        }

        if (!string.IsNullOrWhiteSpace(configuredConnectionString) && configuredConnectionString.Contains("Data Source=", StringComparison.OrdinalIgnoreCase))
            return DbProvider.Sqlite;

        if (!string.IsNullOrWhiteSpace(databaseUrl) && databaseUrl.StartsWith("sqlite", StringComparison.OrdinalIgnoreCase))
            return DbProvider.Sqlite;

        if (!string.IsNullOrWhiteSpace(sqlitePath))
            return DbProvider.Sqlite;

        return DbProvider.Sqlite;
    }

    private static string ResolvePostgresConnectionString(string? configuredConnectionString, string? databaseUrl)
    {
        if (!string.IsNullOrWhiteSpace(configuredConnectionString))
            return configuredConnectionString;

        if (!string.IsNullOrWhiteSpace(databaseUrl))
            return FromPostgresDatabaseUrl(databaseUrl);

        throw new InvalidOperationException("Missing Postgres connection string. Set ConnectionStrings:Default or DATABASE_URL.");
    }

    private static string ResolveSqliteConnectionString(string? configuredConnectionString, string? databaseUrl, string? sqlitePath)
    {
        if (!string.IsNullOrWhiteSpace(configuredConnectionString))
            return EnsureSqliteOptions(configuredConnectionString);

        if (!string.IsNullOrWhiteSpace(databaseUrl) && databaseUrl.StartsWith("sqlite", StringComparison.OrdinalIgnoreCase))
            return EnsureSqliteOptions(FromSqliteDatabaseUrl(databaseUrl));

        if (!string.IsNullOrWhiteSpace(sqlitePath))
            return EnsureSqliteOptions($"Data Source={sqlitePath}");

        return EnsureSqliteOptions("Data Source=every_second_letter.db");
    }

    // Converts postgres://user:pass@host:5432/dbname to Npgsql connection string.
    public static string FromPostgresDatabaseUrl(string databaseUrl)
    {
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':', 2);
        var user = Uri.UnescapeDataString(userInfo[0]);
        var pass = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var host = uri.Host;
        var port = uri.Port;
        var db = uri.AbsolutePath.TrimStart('/');

        // query params might include sslmode=require
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        var sslmode = query.Get("sslmode") ?? query.Get("ssl") ?? "";

        var cs = $"Host={host};Port={port};Database={db};Username={user};Password={pass};";
        if (!string.IsNullOrWhiteSpace(sslmode))
            cs += $"SSL Mode={sslmode};Trust Server Certificate=true;";
        return cs;
    }

    private static string FromSqliteDatabaseUrl(string databaseUrl)
    {
        if (databaseUrl.StartsWith("sqlite:///", StringComparison.OrdinalIgnoreCase))
            return $"Data Source=/{databaseUrl[9..]}";
        if (databaseUrl.StartsWith("sqlite://", StringComparison.OrdinalIgnoreCase))
            return $"Data Source={databaseUrl[9..]}";
        if (databaseUrl.StartsWith("sqlite:", StringComparison.OrdinalIgnoreCase))
            return $"Data Source={databaseUrl[7..]}";

        throw new InvalidOperationException("Invalid sqlite DATABASE_URL format.");
    }

    private static string EnsureSqliteOptions(string connectionString)
    {
        if (connectionString.Contains("Foreign Keys=", StringComparison.OrdinalIgnoreCase))
            return connectionString;

        return connectionString.TrimEnd(';') + ";Foreign Keys=True";
    }
}

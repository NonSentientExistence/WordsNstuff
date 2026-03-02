namespace EverySecondLetter.Services;

public static class Db
{
    // Converts postgres://user:pass@host:5432/dbname to Npgsql connection string.
    public static string FromDatabaseUrl(string databaseUrl)
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
}

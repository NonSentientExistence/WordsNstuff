namespace EverySecondLetter.Services.Database;

public sealed record DatabaseSettings(DbProvider Provider, string ConnectionString);

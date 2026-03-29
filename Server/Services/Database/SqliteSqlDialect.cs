namespace EverySecondLetter.Services.Database;

public sealed class SqliteSqlDialect : ISqlDialect
{
    public string NowExpression => "CURRENT_TIMESTAMP";
    public string ForUpdateClause => string.Empty;
    public string JsonParameter(string parameterName) => parameterName;
    public string JsonToText(string columnName) => columnName;
    public string ClampToZero(string expression) => $"max({expression}, 0)";
}

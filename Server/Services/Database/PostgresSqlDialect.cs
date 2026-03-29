namespace EverySecondLetter.Services.Database;

public sealed class PostgresSqlDialect : ISqlDialect
{
    public string NowExpression => "now()";
    public string ForUpdateClause => "for update";
    public string JsonParameter(string parameterName) => $"{parameterName}::jsonb";
    public string JsonToText(string columnName) => $"{columnName}::text";
    public string ClampToZero(string expression) => $"greatest({expression}, 0)";
}

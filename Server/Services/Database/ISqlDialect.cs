namespace EverySecondLetter.Services.Database;

public interface ISqlDialect
{
    string NowExpression { get; }
    string ForUpdateClause { get; }
    string JsonParameter(string parameterName);
    string JsonToText(string columnName);
    string ClampToZero(string expression);
}

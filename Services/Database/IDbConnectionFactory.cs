using System.Data.Common;

namespace EverySecondLetter.Services.Database;

public interface IDbConnectionFactory
{
    Task<DbConnection> OpenConnectionAsync(CancellationToken cancellationToken = default);
}

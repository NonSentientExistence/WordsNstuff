using EverySecondLetter.Services;

namespace EverySecondLetter.Core.WordGame;

public sealed record ClaimResolutionPlan(
    Guid ClaimerId,
    Guid ResponderId,
    List<PlayerPoints> PointEntries,
    bool GameOver,
    Guid? NextActivePlayerId
);

public sealed class ClaimResolutionEngine
{
    private readonly WordGameRules _rules;

    public ClaimResolutionEngine(WordGameRules rules)
    {
        _rules = rules;
    }

    public ClaimResolutionPlan CreatePlan(
        GameStatus status,
        Guid? pendingClaimerId,
        string? pendingWord,
        Guid? activePlayerId,
        IReadOnlyList<GamePlayerState> players,
        Guid respondingPlayerId,
        bool disputed,
        int contributionCount,
        bool isValidWord)
    {
        if (status != GameStatus.PendingDispute || pendingClaimerId is null || string.IsNullOrWhiteSpace(pendingWord))
            throw new ApiException(409, "No pending claim.");

        EnsurePlayerInGame(players, respondingPlayerId);

        var responderId = activePlayerId ?? throw new ApiException(409, "Game has no active responder.");
        if (respondingPlayerId != responderId)
            throw new ApiException(409, "Only the active player may accept/dispute.");

        var responder = FindPlayer(players, responderId);
        var availableResponses = disputed ? responder.DisputesRemaining : responder.AcceptsRemaining;
        if (availableResponses <= 0)
            throw new ApiException(409, "No remaining accepts/disputes available.");

        var claimerId = pendingClaimerId.Value;
        var baseScore = _rules.GetBaseScore(contributionCount);

        var pointEntries = CreatePointEntries(disputed, isValidWord, baseScore, claimerId, responderId);
        var gameOver = CalculateGameOver(players, responderId, disputed);

        return new ClaimResolutionPlan(
            claimerId,
            responderId,
            pointEntries,
            gameOver,
            gameOver ? null : responderId);
    }

    private List<PlayerPoints> CreatePointEntries(bool disputed, bool isValidWord, int baseScore, Guid claimerId, Guid responderId)
    {
        if (!disputed)
            return new List<PlayerPoints> { new(claimerId, _rules.GetAcceptedScore(baseScore)) };

        if (isValidWord)
            return new List<PlayerPoints> { new(claimerId, _rules.GetValidDisputedScore(baseScore)) };

        return new List<PlayerPoints> { new(responderId, _rules.GetInvalidDisputedScore(baseScore)) };
    }

    private static bool CalculateGameOver(IReadOnlyList<GamePlayerState> players, Guid responderId, bool disputed)
    {
        return players.All(player =>
        {
            var acceptsRemaining = player.AcceptsRemaining;
            var disputesRemaining = player.DisputesRemaining;

            if (player.PlayerId == responderId)
            {
                if (disputed)
                    disputesRemaining--;
                else
                    acceptsRemaining--;
            }

            return acceptsRemaining + disputesRemaining == 0;
        });
    }

    private static void EnsurePlayerInGame(IReadOnlyList<GamePlayerState> players, Guid playerToken)
    {
        if (players.All(player => player.PlayerId != playerToken))
            throw new ApiException(401, "Player token is not part of this game.");
    }

    private static GamePlayerState FindPlayer(IReadOnlyList<GamePlayerState> players, Guid playerId)
    {
        var player = players.FirstOrDefault(p => p.PlayerId == playerId);
        if (player is null)
            throw new ApiException(409, "Player is not part of this game.");

        return player;
    }
}

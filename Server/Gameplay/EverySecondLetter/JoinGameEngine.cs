using EverySecondLetter.Services;

namespace EverySecondLetter.Gameplay.EverySecondLetter;

public sealed record JoinGamePlan(
    bool IsRejoin,
    Guid ResultPlayerId,
    int? TurnOrder,
    bool ShouldStart,
    Guid? ActivePlayerId
);

public sealed class JoinGameEngine
{
  private readonly EverySecondLetterGameDefinition _definition;

  public JoinGameEngine(EverySecondLetterGameDefinition definition)
  {
    _definition = definition;
  }

  public JoinGamePlan CreatePlan(
      GameStatus status,
      IReadOnlyList<GamePlayerState> players,
      Guid joiningPlayerId,
      Guid? existingPlayerToken = null)
  {
    if (existingPlayerToken.HasValue && players.Any(player => player.PlayerId == existingPlayerToken.Value))
    {
      return new JoinGamePlan(true, existingPlayerToken.Value, null, false, null);
    }

    if (!_definition.CanJoin(status, players.Count))
      throw new ApiException(409, "Game is not joinable.");

    var shouldStart = _definition.ShouldStart(players.Count + 1);
    Guid? activePlayerId = shouldStart && players.Count > 0 ? players[0].PlayerId : null;

    return new JoinGamePlan(false, joiningPlayerId, players.Count, shouldStart, activePlayerId);
  }
}
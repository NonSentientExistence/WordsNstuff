using EverySecondLetter.Services;

namespace EverySecondLetter.Gameplay.EverySecondLetter;

public sealed record PlayLetterPlan(
    string NormalizedLetter,
    string UpdatedWord,
    Guid NextActivePlayerId,
    Guid LastLetterPlayerId
);

public sealed class PlayLetterEngine
{
  private readonly EverySecondLetterGameDefinition _definition;

  public PlayLetterEngine(EverySecondLetterGameDefinition definition)
  {
    _definition = definition;
  }

  public PlayLetterPlan CreatePlan(
      GameStatus status,
      string currentWord,
      Guid? activePlayerId,
      IReadOnlyList<GamePlayerState> players,
      Guid playerToken,
      string inputLetter)
  {
    EnsurePlayerInGame(players, playerToken);

    if (status != GameStatus.InProgress)
      throw new ApiException(409, "Game is not in progress.");
    if (activePlayerId != playerToken)
      throw new ApiException(409, "Not your turn.");

    var normalizedLetter = _definition.NormalizeLetter(inputLetter);
    var nextPlayerId = _definition.GetNextPlayerId(players, playerToken);

    return new PlayLetterPlan(
        normalizedLetter,
        currentWord + normalizedLetter,
        nextPlayerId,
        playerToken);
  }

  private static void EnsurePlayerInGame(IReadOnlyList<GamePlayerState> players, Guid playerToken)
  {
    if (players.All(player => player.PlayerId != playerToken))
      throw new ApiException(401, "Player token is not part of this game.");
  }
}
using EverySecondLetter.Core.WordGame;
using EverySecondLetter.Games.EverySecondLetter;
using EverySecondLetter.Services;
using Xunit;

namespace EverySecondLetter.UnitTests;

public sealed class PlayLetterEngineTests
{
  private readonly PlayLetterEngine _sut = new(new EverySecondLetterRules());

  [Fact]
  public void CreatePlan_Throws_WhenPlayerIsNotInGame()
  {
    var players = CreatePlayers();

    var ex = Assert.Throws<ApiException>(() => _sut.CreatePlan(
        GameStatus.InProgress,
        string.Empty,
        players[0].PlayerId,
        players,
        Guid.NewGuid(),
        "A"));

    Assert.Equal(401, ex.StatusCode);
    Assert.Contains("not part of this game", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void CreatePlan_Throws_WhenGameIsNotInProgress()
  {
    var players = CreatePlayers();

    var ex = Assert.Throws<ApiException>(() => _sut.CreatePlan(
        GameStatus.WaitingForPlayers,
        string.Empty,
        players[0].PlayerId,
        players,
        players[0].PlayerId,
        "A"));

    Assert.Equal(409, ex.StatusCode);
    Assert.Contains("not in progress", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void CreatePlan_Throws_WhenItIsNotPlayersTurn()
  {
    var players = CreatePlayers();

    var ex = Assert.Throws<ApiException>(() => _sut.CreatePlan(
        GameStatus.InProgress,
        string.Empty,
        players[0].PlayerId,
        players,
        players[1].PlayerId,
        "A"));

    Assert.Equal(409, ex.StatusCode);
    Assert.Contains("Not your turn", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void CreatePlan_NormalizesLetter_AppendsWord_AndAdvancesTurn()
  {
    var players = CreatePlayers();

    var plan = _sut.CreatePlan(
        GameStatus.InProgress,
        "C",
        players[0].PlayerId,
        players,
        players[0].PlayerId,
        " a ");

    Assert.Equal("A", plan.NormalizedLetter);
    Assert.Equal("CA", plan.UpdatedWord);
    Assert.Equal(players[1].PlayerId, plan.NextActivePlayerId);
    Assert.Equal(players[0].PlayerId, plan.LastLetterPlayerId);
  }

  private static List<GamePlayerState> CreatePlayers()
  {
    return new List<GamePlayerState>
        {
            new(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Player 1", 0, 0, 5, 5),
            new(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Player 2", 1, 0, 5, 5)
        };
  }
}
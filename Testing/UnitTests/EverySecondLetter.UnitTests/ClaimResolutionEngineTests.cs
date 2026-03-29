using EverySecondLetter.Core.WordGame;
using EverySecondLetter.Games.EverySecondLetter;
using EverySecondLetter.Services;
using Xunit;

namespace EverySecondLetter.UnitTests;

public sealed class ClaimResolutionEngineTests
{
  private readonly ClaimResolutionEngine _sut = new(new EverySecondLetterRules());

  [Fact]
  public void CreatePlan_Throws_WhenThereIsNoPendingClaim()
  {
    var players = CreatePlayers();

    var ex = Assert.Throws<ApiException>(() => _sut.CreatePlan(
        GameStatus.InProgress,
        null,
        null,
        players[1].PlayerId,
        players,
        players[1].PlayerId,
        disputed: false,
        contributionCount: 2,
        isValidWord: true));

    Assert.Equal(409, ex.StatusCode);
    Assert.Contains("No pending claim", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void CreatePlan_Throws_WhenResponderIsNotActivePlayer()
  {
    var players = CreatePlayers();

    var ex = Assert.Throws<ApiException>(() => _sut.CreatePlan(
        GameStatus.PendingDispute,
        players[0].PlayerId,
        "CAT",
        players[1].PlayerId,
        players,
        players[0].PlayerId,
        disputed: false,
        contributionCount: 2,
        isValidWord: true));

    Assert.Equal(409, ex.StatusCode);
    Assert.Contains("Only the active player", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void CreatePlan_Throws_WhenResponderHasNoAcceptsLeft()
  {
    var players = CreatePlayers(acceptsRemainingPlayer2: 0);

    var ex = Assert.Throws<ApiException>(() => _sut.CreatePlan(
        GameStatus.PendingDispute,
        players[0].PlayerId,
        "CAT",
        players[1].PlayerId,
        players,
        players[1].PlayerId,
        disputed: false,
        contributionCount: 2,
        isValidWord: true));

    Assert.Equal(409, ex.StatusCode);
    Assert.Contains("No remaining accepts/disputes", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void CreatePlan_Throws_WhenResponderHasNoDisputesLeft()
  {
    var players = CreatePlayers(disputesRemainingPlayer2: 0);

    var ex = Assert.Throws<ApiException>(() => _sut.CreatePlan(
        GameStatus.PendingDispute,
        players[0].PlayerId,
        "TES",
        players[1].PlayerId,
        players,
        players[1].PlayerId,
        disputed: true,
        contributionCount: 2,
        isValidWord: false));

    Assert.Equal(409, ex.StatusCode);
    Assert.Contains("No remaining accepts/disputes", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void CreatePlan_ForAccept_GivesClaimerBaseScore_AndKeepsResponderActive()
  {
    var players = CreatePlayers();

    var plan = _sut.CreatePlan(
        GameStatus.PendingDispute,
        players[0].PlayerId,
        "CAT",
        players[1].PlayerId,
        players,
        players[1].PlayerId,
        disputed: false,
        contributionCount: 2,
        isValidWord: true);

    Assert.Equal(players[0].PlayerId, plan.ClaimerId);
    Assert.Equal(players[1].PlayerId, plan.ResponderId);
    Assert.False(plan.GameOver);
    Assert.Equal(players[1].PlayerId, plan.NextActivePlayerId);
    Assert.Single(plan.PointEntries);
    Assert.Equal(players[0].PlayerId, plan.PointEntries[0].PlayerId);
    Assert.Equal(4, plan.PointEntries[0].Points);
  }

  [Fact]
  public void CreatePlan_ForValidDispute_GivesClaimerOneAndHalfBaseScore()
  {
    var players = CreatePlayers();

    var plan = _sut.CreatePlan(
        GameStatus.PendingDispute,
        players[0].PlayerId,
        "CAT",
        players[1].PlayerId,
        players,
        players[1].PlayerId,
        disputed: true,
        contributionCount: 2,
        isValidWord: true);

    Assert.Single(plan.PointEntries);
    Assert.Equal(players[0].PlayerId, plan.PointEntries[0].PlayerId);
    Assert.Equal(6, plan.PointEntries[0].Points);
  }

  [Fact]
  public void CreatePlan_ForInvalidDispute_GivesResponderHalfBaseScore()
  {
    var players = CreatePlayers();

    var plan = _sut.CreatePlan(
        GameStatus.PendingDispute,
        players[0].PlayerId,
        "TES",
        players[1].PlayerId,
        players,
        players[1].PlayerId,
        disputed: true,
        contributionCount: 2,
        isValidWord: false);

    Assert.Single(plan.PointEntries);
    Assert.Equal(players[1].PlayerId, plan.PointEntries[0].PlayerId);
    Assert.Equal(2, plan.PointEntries[0].Points);
  }

  [Theory]
  [InlineData(false)]
  [InlineData(true)]
  public void CreatePlan_SetsGameOver_WhenLastResponseIsConsumed(bool disputed)
  {
    var players = CreatePlayers(
        acceptsRemainingPlayer1: 0,
        disputesRemainingPlayer1: 0,
        acceptsRemainingPlayer2: disputed ? 0 : 1,
        disputesRemainingPlayer2: disputed ? 1 : 0);

    var plan = _sut.CreatePlan(
        GameStatus.PendingDispute,
        players[0].PlayerId,
        "CAT",
        players[1].PlayerId,
        players,
        players[1].PlayerId,
        disputed,
        contributionCount: 2,
        isValidWord: !disputed);

    Assert.True(plan.GameOver);
    Assert.Null(plan.NextActivePlayerId);
  }

  private static List<GamePlayerState> CreatePlayers(
      int acceptsRemainingPlayer1 = 5,
      int disputesRemainingPlayer1 = 5,
      int acceptsRemainingPlayer2 = 5,
      int disputesRemainingPlayer2 = 5)
  {
    return new List<GamePlayerState>
        {
            new(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Player 1", 0, 0, acceptsRemainingPlayer1, disputesRemainingPlayer1),
            new(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Player 2", 1, 0, acceptsRemainingPlayer2, disputesRemainingPlayer2)
        };
  }
}
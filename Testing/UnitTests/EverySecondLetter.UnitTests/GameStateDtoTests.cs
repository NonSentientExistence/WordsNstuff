using EverySecondLetter.Gameplay.EverySecondLetter;
using Xunit;

namespace EverySecondLetter.UnitTests;

public sealed class GameStateDtoTests
{
  [Fact]
  public void ComputedProperties_ReturnDefaults_WhenPlayersListIsEmpty()
  {
    var sut = new GameStateDto(
        Guid.NewGuid(),
        GameStatus.WaitingForPlayers,
        string.Empty,
        null,
        null,
        new List<GamePlayerState>(),
        null,
        null,
        new List<WordHistoryEntry>());

    Assert.Equal(Guid.Empty, sut.Player1Id);
    Assert.Null(sut.Player2Id);
    Assert.Equal(0, sut.Player1Score);
    Assert.Equal(0, sut.Player2Score);
    Assert.Equal(0, sut.Player1Accepts);
    Assert.Equal(0, sut.Player1Disputes);
    Assert.Equal(0, sut.Player2Accepts);
    Assert.Equal(0, sut.Player2Disputes);
  }

  [Fact]
  public void ComputedProperties_ReturnFirstPlayerValues_WhenOnePlayerExists()
  {
    var player1 = new GamePlayerState(Guid.NewGuid(), "Player 1", 0, 12, 4, 3);
    var sut = new GameStateDto(
        Guid.NewGuid(),
        GameStatus.WaitingForPlayers,
        string.Empty,
        player1.PlayerId,
        null,
        new List<GamePlayerState> { player1 },
        null,
        null,
        new List<WordHistoryEntry>());

    Assert.Equal(player1.PlayerId, sut.Player1Id);
    Assert.Null(sut.Player2Id);
    Assert.Equal(12, sut.Player1Score);
    Assert.Equal(0, sut.Player2Score);
    Assert.Equal(4, sut.Player1Accepts);
    Assert.Equal(3, sut.Player1Disputes);
    Assert.Equal(0, sut.Player2Accepts);
    Assert.Equal(0, sut.Player2Disputes);
  }

  [Fact]
  public void ComputedProperties_ReturnBothPlayerValues_WhenTwoPlayersExist()
  {
    var player1 = new GamePlayerState(Guid.NewGuid(), "Player 1", 0, 12, 4, 3);
    var player2 = new GamePlayerState(Guid.NewGuid(), "Player 2", 1, 7, 2, 1);
    var sut = new GameStateDto(
        Guid.NewGuid(),
        GameStatus.InProgress,
        "CAT",
        player1.PlayerId,
        player2.PlayerId,
        new List<GamePlayerState> { player1, player2 },
        null,
        null,
        new List<WordHistoryEntry>());

    Assert.Equal(player1.PlayerId, sut.Player1Id);
    Assert.Equal(player2.PlayerId, sut.Player2Id);
    Assert.Equal(12, sut.Player1Score);
    Assert.Equal(7, sut.Player2Score);
    Assert.Equal(4, sut.Player1Accepts);
    Assert.Equal(3, sut.Player1Disputes);
    Assert.Equal(2, sut.Player2Accepts);
    Assert.Equal(1, sut.Player2Disputes);
  }
}
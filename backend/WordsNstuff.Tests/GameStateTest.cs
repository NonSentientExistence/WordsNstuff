using WordsNstuff;

namespace App.Tests;

public class GameStateTest
{
  // testa om gamstate aktiveras med två spelare och HP=50
  [Fact]
  public void GameState_InitializedWithTwoPlayers_HasCorrectHP()
  {
    var gameState = new GameState("Player1", "Player2");
    Assert.Equal(50, gameState.Player1HP);
    Assert.Equal(50, gameState.Player2HP);
    Assert.Equal("Player1", gameState.Player1Name);
    Assert.Equal("Player2", gameState.Player2Name);
  }

  // testa om ApplyDamage minskar rätt spelares HP
  [Fact]
  public void ApplyDamage_Player1Word_DamagesPlayer2()
  {
    var gameState = new GameState("Player1", "Player2");
    gameState.ApplyDamage("CAB", isPlayer1Attacking: true);  // "CAB" = 7 damage
    Assert.Equal(50, gameState.Player1HP);  // Player1 oförändrad
    Assert.Equal(43, gameState.Player2HP);  // 50 - 7 = 43
  }

  // testa om ApplyDamage fungerar åt andra hållet
  [Fact]
  public void ApplyDamage_Player2Word_DamagesPlayer1()
  {
    var gameState = new GameState("Player1", "Player2");
    gameState.ApplyDamage("JOY", isPlayer1Attacking: false);  // "JOY" = 13 damage
    Assert.Equal(37, gameState.Player1HP);  // 50 - 13 = 37
    Assert.Equal(50, gameState.Player2HP);  // Oförändrad
  }

  // testa om spelet inte är över när båda har HP kvar
  [Fact]
  public void IsGameOver_BothPlayersAlive_ReturnsFalse()
  {
    var gameState = new GameState("Player1", "Player2");
    Assert.False(gameState.IsGameOver());
  }

  // testa om spelet är över när Player1 har 0 HP
  [Fact]
  public void IsGameOver_Player1AtZeroHP_ReturnsTrue()
  {
    var gameState = new GameState("Player1", "Player2");
    gameState.ApplyDamage("ZZZZQ", isPlayer1Attacking: false);  // Stor damage antag att det tar ner till 0
    Assert.True(gameState.IsGameOver());
  }
}
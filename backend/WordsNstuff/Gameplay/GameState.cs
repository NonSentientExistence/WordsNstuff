// här kan vi hantera state i spelet
using WordsNstuff;  // För GameEngine
using System;

namespace WordsNstuff;

public class GameState
{
  public string Player1Name { get; }
  public string Player2Name { get; }
  public int Player1HP { get; private set; }
  public int Player2HP { get; private set; }

  private readonly GameEngine _gameEngine = new();
  private static readonly Random _random = new();

  private static readonly string[] FunMessages = {
        "Time for retirement! Your word warrior days are over.",
        "Maybe try chasing the ball instead – words aren't your thing!",
        "Epic fail! Did you even try?"
    };

  public GameState(string player1Name, string player2Name)
  {
    Player1Name = player1Name;
    Player2Name = player2Name;
    Player1HP = 50;
    Player2HP = 50;
  }

  public void ApplyDamage(string word, bool isPlayer1Attacking)
  {
    int damage = _gameEngine.CalculateDamage(word);
    if (isPlayer1Attacking)
    {
      Player2HP -= damage;
      if (Player2HP <= 0)
      {
        Player2HP = 0;
        Console.WriteLine($"{Player2Name}: {FunMessages[_random.Next(FunMessages.Length)]}");
      }
    }
    else
    {
      Player1HP -= damage;
      if (Player1HP <= 0)
      {
        Player1HP = 0;
        Console.WriteLine($"{Player1Name}: {FunMessages[_random.Next(FunMessages.Length)]}");
      }
    }
  }

  public bool IsGameOver()
  {
    return Player1HP <= 0 || Player2HP <= 0;
  }
}
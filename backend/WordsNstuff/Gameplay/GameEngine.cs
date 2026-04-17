namespace WordsNstuff;

public class GameEngine
{
  public int CalculateDamage(string word)
  {
    return WordValue.Calculate(word);
  }
}
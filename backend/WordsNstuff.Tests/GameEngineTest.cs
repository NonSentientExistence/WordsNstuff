using Xunit;
using WordsNstuff;


namespace App.Tests;

public class GameEngineTest
{
  // testa damage beräkning for ordet "CAB": C(3) + A(1) + B(3) = 7
  [Fact]
  public void CalculateDamage_Cab_Returns7()
  {
    var engine = new GameEngine();
    var result = engine.CalculateDamage("CAB");
    Assert.Equal(7, result);
  }
  // testa känslighet stora/små bokstäver: "cab" ska ge samma som "CAB"
  [Fact]
  public void CalculateDamage_LowercaseCab_Returns7()
  {
    var engine = new GameEngine();
    var result = engine.CalculateDamage("cab");
    Assert.Equal(7, result);
  }

  // testa hög värde: "JOY" = J(8) + O(1) + Y(4) = 13
  [Fact]
  public void CalculateDamage_Joy_Returns13()
  {
    var engine = new GameEngine();
    var result = engine.CalculateDamage("JOY");
    Assert.Equal(13, result);
  }

  // tsta tom string: Ska returnera 0
  [Fact]
  public void CalculateDamage_EmptyString_Returns0()
  {
    var engine = new GameEngine();
    var result = engine.CalculateDamage("");
    Assert.Equal(0, result);
  }

}
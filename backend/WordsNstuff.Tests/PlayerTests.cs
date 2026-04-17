public class PlayerTests
{
    //Ensure a player starts with full HP
    [Fact]
    public void NewPlayer_StartsGameWithFullHP()
    {
        var player = new Player("player1");
        Assert.Equal(100, player.Hp);
    }

    //Ensure that damage taken reduces the hp of the player
    [Fact]
    public void PlayerTakesDamage_ReducesHP()
    {
        var player = new Player("player1");
        var startHP = player.Hp;
        var damage = 50;
        player.TakeDamage(damage);
        Assert.Equal(startHP - damage, player.Hp);
    }

    //Ensure HP is 0 if taking more damage then current HP, not negative
    [Fact]
    public void PlayerTakesLethalDamage_HPIsZero()
    {
        var player = new Player("player1");
        var damage = player.Hp + 150;
        player.TakeDamage(damage);
        Assert.Equal(0, player.Hp);
    }
    
    //Ensure a player with 0 HP is defeated
    [Fact]
    public void IsDefeated_ReturnsTrueAtZeroHp()
    {
        var player = new Player("player1");
        player.Hp = 0;
        Assert.True(player.IsDefeated());
    }

    //Ensure that player with negative HP is defeated (Edge case)
    [Fact]
    public void PlayerHasNegativeHP_IsDefeated()
    {
        var player = new Player("player1");
        player.Hp = -12;
        Assert.True(player.IsDefeated());
    }

    //Ensure that a playet with HP > 0 is not defeated.
    [Fact]
    public void IsDefeated_ReturnsFalseWhenHpAboveZero()
    {
        var player = new Player("player1");
        Assert.False(player.IsDefeated());
    }

}
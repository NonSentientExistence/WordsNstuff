public class GameStateTests
{
    //Ensure that a game has two created and assigned players
    [Fact]
    public void NewGame_HasTwoPlayers()
    {
        var game = new GameState("player1","player2");
        Assert.NotNull(game.Player1);
        Assert.NotNull(game.Player2);
    }

    //Ensure correct IDs for players
    [Fact]
    public void NewGame_PlayersHaveCorrectID()
    {
        var game = new GameState("player1","player2");
        Assert.Equal("player1", game.Player1.Id);
        Assert.Equal("player2", game.Player2.Id);
    }

    //Ensure that a new game has a letter pool
    [Fact]
    public void NewGame_GameHasLetterPool()
    {
        var game = new GameState("player1","player2");
        Assert.NotNull(game.Pool);
        Assert.NotEmpty(game.Pool);
    }

    // There should be no submitted words at game start
    [Fact]
    public void NewGame_NoWordsHasBeenSubmitted()
    {
        var game = new GameState("player1","player2");
        Assert.Null(game.Player1Word);
        Assert.Null(game.Player2Word);
    }

    //A new game should have status waiting
    [Fact]
    public void NewGame_HasStatusInProgress()
    {
        var game = new GameState("player1","player2");
        Assert.Equal(GameStatus.InProgress, game.Status);
    }
}
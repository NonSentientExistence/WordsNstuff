public class GameEngineTests
{
    //Creates a new engine and game for each test
    private (GameEngine engine, GameState game) CreateGame()
    {
        var game = new GameState("player1", "player2");
        var validator = new WordValidator("Resources/words.txt");

        // Sets a already know pool of letters for SubmitWord_WordWithLettersNotInPool_IsRejected test
        // Will fail due to randomly generated word pool otherwise
        game.Pool.Clear();
        game.Pool.AddRange(new[]
        {
            'C','A','T','D','O','G','Q','U','I','Z',
            'W','O','R','D','S','P','L','A','Y','E'
        });

        var engine = new GameEngine(game, validator);
        return (engine, game);
    }

    //Ensure a word submitted by player 1 is stored with player1
    [Fact]
    public void SubmitWord_StoresWordForPlayer1()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "CAT");
        Assert.Equal("CAT", game.Player1Word);
    }

    //Ensure a word submitted by player 2 is stored with player2 
    [Fact]
    public void SubmitWord_StoresWordForPlayer2()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player2", "DOG");
        Assert.Equal("DOG", game.Player2Word);
    }

    //Ensure a round isn't finished until both players have submitted a word
    [Fact]
    public void SubmitWord_DoesNotResolveRoundWithOnlyOneWord()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "CAT");

        // Only player1 submitted — HP should be untouched
        Assert.Equal(100, game.Player1.Hp);
        Assert.Equal(100, game.Player2.Hp);
    }

    // Ensure that when two players has submitted a word, damage should be dealt to HP
    // CAT = 5 dmg, DOG = 5 DMG
    [Fact]
    public void SubmitWord_ResolveRound_BothPlayersTakeDamage()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "CAT");
        engine.SubmitWord("player2", "DOG");

        Assert.Equal(95, game.Player1.Hp);
        Assert.Equal(95, game.Player2.Hp);
    }

    //Ensure word submits are empty when starting a new round
    [Fact]
    public void ResolveRound_ClearsWordsAfterRound()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "CAT");
        engine.SubmitWord("player2", "DOG");

        Assert.Null(game.Player1Word);
        Assert.Null(game.Player2Word);
    }

    // Ensure a game is over when one player reaches 0 HP
    [Fact]
    public void IsOver_ReturnsTrueWhenPlayerIsDefeated()
    {
        var (engine, game) = CreateGame();
        game.Player1.TakeDamage(100);
        Assert.True(engine.IsOver());
    }

    //Ensure a game isn't finished when both players have HP
    [Fact]
    public void IsOver_ReturnsFalseWhenBothPlayersAlive()
    {
        var (engine, game) = CreateGame();
        Assert.False(engine.IsOver());
    }

    //Ensure game status is updated to Finished when a game is done
    [Fact]
    public void ResolveRound_SetsStatusToFinished_WhenPlayerDefeated()
    {
        var (engine, game) = CreateGame();
        // Deal damage to player2 before finishing off with a word
        game.Player2.TakeDamage(95);
        // Quiz deals 22 damage Q(10)+U(1)+I(1)+Z(10), should kill player 2. 
        engine.SubmitWord("player1", "QUIZ");
        engine.SubmitWord("player2", "CAT");

        Assert.Equal(GameStatus.Finished, game.Status);
    }

    //Ensure Invalid word gets rejected and not stored
    [Fact]
    public void SubmitWord_InvalidWord_IsRejected()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "xzqj");
        Assert.Null(game.Player1Word);
    }

    // Ensure invalid word doesn't deal damage to player
    [Fact]
    public void SubmitWord_InvalidWord_DoesNotDealDamage()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "xzqj");
        engine.SubmitWord("player2", "xzqj");
        Assert.Equal(100, game.Player1.Hp);
        Assert.Equal(100, game.Player2.Hp);
    }

    // Ensure valid word gets stored
    [Fact]
    public void SubmitWord_ValidWord_IsStored()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "cat");
        Assert.Equal("CAT", game.Player1Word);
    }

    // Ensure a word using letters not in the pool is rejected
    [Fact]
    public void SubmitWord_WordWithLettersNotInPool_IsRejected()
    {
        var (engine, game) = CreateGame();
        // Override pool with known letters
        game.Pool.Clear();
        game.Pool.AddRange(new[] { 'C', 'A', 'T' });
        // Test with dog which doesn't have the needed letters in the pool
        var result = engine.SubmitWord("player1", "dog");
        Assert.Equal(SubmitResult.InvalidPool, result);
    }

    [Fact]
    public void NewRound_NewLetterPoolGenerated()
    {
        var (engine, game) = CreateGame();
        var pool1 = new List<char>(game.Pool);
        engine.SubmitWord("player1", "CAT");
        engine.SubmitWord("player2", "DOG");
        var pool2 = game.Pool;

        Assert.NotEqual(pool1, pool2);
    }
     [Fact]
    public void SubmitWord_ValidWord_ReturnSuccess()
    {
        var (engine, game) = CreateGame();
        // Override pool with known letters
        game.Pool.Clear();
        game.Pool.AddRange(new[] { 'C', 'A', 'T' });
        
        var result = engine.SubmitWord("player1", "cat");
        Assert.Equal(SubmitResult.Success, result);
    }

    [Fact]
    public void SubmitWord_NotInDictionary_ReturnInvalidWord()
    {
        var (engine, game) = CreateGame();
        // Override pool with known letters
        game.Pool.Clear();
        game.Pool.AddRange(new[] { 'B', 'Q', 'R' });
        
        var result = engine.SubmitWord("player1", "bqr");
        Assert.Equal(SubmitResult.InvalidWord, result);
    }

    [Fact]
    public void SubmitWord_NotInLetterPool_ReturnInvalidWord()
    {
        var (engine, game) = CreateGame();
        // Override pool with known letters
        game.Pool.Clear();
        game.Pool.AddRange(new[] { 'B', 'Q', 'R' });
        
        var result = engine.SubmitWord("player1", "cat");
        Assert.Equal(SubmitResult.InvalidPool, result);
    }

    // Ensure skipping a round stores an empty string for player 1
    [Fact]
    public void SkipWord_StoresEmptyStringForPlayer1()
    {
        var (engine, game) = CreateGame();
        engine.SkipWord("player1");
        Assert.Equal("", game.Player1Word);
    }

    // Ensure skipping a round stores an empty string for player 1
    [Fact]
    public void SkipWord_StoresEmptyStringForPlayer2()
    {
        var (engine, game) = CreateGame();
        engine.SkipWord("player2");
        Assert.Equal("", game.Player2Word);
    }

    // Ensure skip round deals 0 dmg
    [Fact]
    public void SkipWord_DealsNoDamage()
    {
        var (engine, game) = CreateGame();
        engine.SkipWord("player1");
        engine.SkipWord("player2");
        Assert.Equal(100, game.Player1.Hp);
        Assert.Equal(100, game.Player2.Hp);
    }

    // Ensure round resolves when both players skips 
    [Fact]
    public void SkipWord_ResolvesRoundWhenBothPlayersSkip()
    {
        var (engine, game) = CreateGame();
        engine.SkipWord("player1");
        engine.SkipWord("player2");
        // Words should be cleared after round resolves
        Assert.Null(game.Player1Word);
        Assert.Null(game.Player2Word);
    }

    // Ensure round resolves when player1 submits and player 2 skips
    [Fact]
    public void SkipWord_ResolvesRoundWhenPlayer1SubmitsPlayer2Skips()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player1", "CAT"); // Deals 5 dmg
        engine.SkipWord("player2"); // Deals 0dmg
        // player1 takes 0 dmg, player2 takes 5dmg
        Assert.Equal(100, game.Player1.Hp);
        Assert.Equal(95, game.Player2.Hp);
    }

    // Ensure round resolves when player1 submits and player 2 skips
    [Fact]
    public void SkipWord_ResolvesRoundWhenPlayer2SubmitsPlayer1Skips()
    {
        var (engine, game) = CreateGame();
        engine.SubmitWord("player2", "CAT"); // Deals 5 dmg
        engine.SkipWord("player1"); // Deals 0dmg
        // player2 takes 0 dmg, player1 takes 5dmg
        Assert.Equal(100, game.Player2.Hp);
        Assert.Equal(95, game.Player1.Hp);
    }
}
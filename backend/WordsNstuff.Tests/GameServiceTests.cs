public class GameServiceTests
{
    private readonly GameService _service;

    public GameServiceTests()
    {
        var validator = new WordValidator("Resources/words.txt");
        _service = new GameService(validator);
    }

    //Ensure that starting a game creates and stores a GameState
    [Fact]
    public void StartGame_CreatesGameWithCorrectId()
    {
        _service.StartGame("ABC123", "player1", "player2");
        var game = _service.GetGame("ABC123");
        Assert.NotNull(game);
    }

    //Ensure a created game has the correct players
    [Fact]
    public void StartGame_CreatesGameWithCorrectPlayers()
    {
        _service.StartGame("ABC123", "player1", "player2");
        var game = _service.GetGame("ABC123");
        Assert.Equal("player1", game!.Player1.Id);
        Assert.Equal("player2", game!.Player2.Id);
    }

    //Ensure game doesn't crash if looking up a game that doesn't exists
     [Fact]
    public void GetGame_ReturnsNull_WhenGameDoesNotExist()
    {
        var game = _service.GetGame("DOESNOTEXIST");
        Assert.Null(game);
    }

    //Ensure that a valid, submitted word gets stored with the correct player
    [Fact]
    public void SubmitWord_ValidWord_IsStored()
    {
        _service.StartGame("ABC123", "player1", "player2");
        //Set a pool of words to pass tests, otherwise tests fails due to random letter pool generation
        _service.SetPoolForTesting("ABC123", new[] 
        { 
            'C','A','T','D','O','G','Q','U','I','Z',
            'W','O','R','D','S','P','L','A','Y','E' 
        });

        _service.SubmitWord("ABC123", "player1", "cat");
        var game = _service.GetGame("ABC123");
        Assert.Equal("CAT", game!.Player1Word);
    }

    //Ensure that the game doesn't crash if a word is submitted to a game that doesn't exist
    [Fact]
    public void SubmitWord_ValidWord_GameDoesntExist()
    {
        //Record exception is a helper from Xunit. It will catch any exceptions from the code. If null, then no crash occurred.
    var exception = Record.Exception(() =>
    _service.SubmitWord("DOESNTEXIST", "player1", "cat"));
    Assert.Null(exception);
    }
}    
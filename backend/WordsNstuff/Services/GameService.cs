public class GameService
{
    private readonly Dictionary<string, (GameState state, GameEngine engine)> _games = new();
    private readonly WordValidator _validator;

    public GameService(WordValidator validator)
    {
        _validator = validator;
    }

    public void StartGame(string gameId, string player1Token, string player2Token)
    {
        var state = new GameState(player1Token, player2Token);
        var engine = new GameEngine(state, _validator);

        //Store state and engine under the lobby code
        _games[gameId] = (state, engine);
    }

    public GameState? GetGame(string gameId)
    {
        // Tries to get game by Id, if exists, out will write the dictionary value into game and return state of game. 
        // If it doesn't exists, returns null
        if (_games.TryGetValue(gameId, out var game))
        {
            return game.state;
        }
        else return null; 
    }

    //If submitted to a game that doesn't exist, will do nothing as TryGetValue will return false
    public bool SubmitWord(string gameId, string playerId, string word)
    {
        if (_games.TryGetValue(gameId, out var game))
        return game.engine.SubmitWord(playerId, word);
        return false;    
    }

    // Only for testing, allows for setting a known pool of letters for tests
    public void SetPoolForTesting(string gameId, char[] letters)
    {
        if (_games.TryGetValue(gameId, out var game))
        {
            game.state.Pool.Clear();
            game.state.Pool.AddRange(letters);
        }
    }
}
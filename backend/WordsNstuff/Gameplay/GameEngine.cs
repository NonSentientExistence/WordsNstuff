// här kan vi skriva spelregler, poäng, validering

public class GameEngine
{
    private readonly GameState _state;
    private readonly WordValidator _validator;
    public GameEngine(GameState state, WordValidator validator)
    {
        _state = state;
        _validator = validator;
    }

    public bool SubmitWord(string playerId, string word)
    {
        //Reject if word isn't in the dictionary 
        if (!_validator.IsValid(word)) return false;

        // Check that all letters in the word exist in the pool
    var pool = new List<char>(_state.Pool); // copy so we don't modify the original
    foreach (var letter in word.ToUpper())
    {
        if (!pool.Remove(letter)) return false; // letter not in pool
    }
        // Store the submitted word to the correct player
        if (playerId == _state.Player1.Id)
            _state.Player1Word = word.ToUpper();
        else if (playerId == _state.Player2.Id)
            _state.Player2Word = word.ToUpper();
        else return false;
        // Only resolve round when both players have submitted
        if (_state.Player1Word != null && _state.Player2Word != null)
            ResolveRound();

        return true;
    }

    private void ResolveRound()
    {
        // Calculate damage for each word
        int damage1 = WordValue.Calculate(_state.Player1Word!);
        int damage2 = WordValue.Calculate(_state.Player2Word!);

        // Both players takes damage
        _state.Player1.TakeDamage(damage2); // player1 takes damage from player2's word and vice versa
        _state.Player2.TakeDamage(damage1); 

        _state.Player1LastWord = _state.Player1Word;
        _state.Player2LastWord = _state.Player2Word;
        
        _state.Player1LastDamage = damage2.ToString();
        _state.Player2LastDamage = damage1.ToString();
        // Set word to null for next round
        _state.Player1Word = null;
        _state.Player2Word = null;

        // Check if the game has ended
        if (IsOver())
            _state.Status = GameStatus.Finished;
    }

    public bool IsOver()
    {
        return _state.Player1.IsDefeated() || _state.Player2.IsDefeated();
    }
}
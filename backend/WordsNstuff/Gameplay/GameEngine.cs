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
    public SubmitResult SubmitWord(string playerId, string word)
    {
        //Reject if word isn't in the dictionary
        if (!_validator.IsValid(word)) return SubmitResult.InvalidWord;
        // Check that all letters in the word exist in the pool
        // pool is a copy of the current pool to ensure we don't modify the current word pool
        var pool = new List<char>(_state.Pool);
        foreach (var letter in word.ToUpper())
        {
            if (!pool.Remove(letter)) return SubmitResult.InvalidPool; // letter not in pool
        }
        // Store the submitted word to the correct player
        if (playerId == _state.Player1.Id)
            _state.Player1Word = word.ToUpper();
        else if (playerId == _state.Player2.Id)
            _state.Player2Word = word.ToUpper();
        else return SubmitResult.InvalidWord;
        // Only resolve round when both players have submitted
        if (_state.Player1Word != null && _state.Player2Word != null)
            ResolveRound();
        return SubmitResult.Success;
    }
    private void ResolveRound()
    {
        lock (_state.Lock)
        {
            // Calculate damage for each word
            int damage1 = WordValue.Calculate(_state.Player1Word!);
            int damage2 = WordValue.Calculate(_state.Player2Word!);
            // Both players takes damage
            _state.Player1.TakeDamage(damage2); // player1 takes damage from player2's word and vice versa
            _state.Player2.TakeDamage(damage1);
            // Store last word and damage for display
            _state.Player1LastWord = _state.Player1Word;
            _state.Player2LastWord = _state.Player2Word;
            _state.Player1LastDamage = damage2.ToString();
            _state.Player2LastDamage = damage1.ToString();
            // Set word to null for next round
            _state.Player1Word = null;
            _state.Player2Word = null;
            // Check if the game has ended
            if (IsOver())
            {
                _state.Status = GameStatus.Finished;
                return;
            }
            // Generates a new pool of letters for each new round
            var newPool = LetterPool.Generate(20);
            _state.Pool.Clear();
            _state.Pool.AddRange(newPool);
        }
    }
    public void SkipWord(string playerId)
    {
        // Submit empty, so the round can resolve
        if (playerId == _state.Player1.Id)
            _state.Player1Word = "";
        else if (playerId == _state.Player2.Id)
            _state.Player2Word = "";
        // Resolve if both players have submitted
        if (_state.Player1Word != null && _state.Player2Word != null)
            ResolveRound();
    }
    public bool IsOver()
    {
        return _state.Player1.IsDefeated() || _state.Player2.IsDefeated();
    }
}
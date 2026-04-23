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
        lock (_state.Lock)
        {
            // Store the submitted word to the correct player
            if (playerId == _state.Player1.Id)
                _state.Player1Word = word.ToUpper();
            else if (playerId == _state.Player2.Id)
                _state.Player2Word = word.ToUpper();
            else return SubmitResult.InvalidPlayer;
            // Only resolve round when both players have submitted
            if (_state.Player1Word != null && _state.Player2Word != null)
                ResolveRoundInternal();
        }
        return SubmitResult.Success;
    }
    public void SkipWord(string playerId)
    {
        lock (_state.Lock)
        {
            // Submit empty, so the round can resolve
            if (playerId == _state.Player1.Id)
                _state.Player1Word = "";
            else if (playerId == _state.Player2.Id)
                _state.Player2Word = "";
            // Resolve if both players have submitted
            if (_state.Player1Word != null && _state.Player2Word != null)
                ResolveRoundInternal();
        }
    }
    public bool IsOver()
    {
        return _state.Player1.IsDefeated() || _state.Player2.IsDefeated();
    }

    // Internal resolve without lock, called when lock is already held
    private void ResolveRoundInternal()
    {
        int damage1 = WordValue.Calculate(_state.Player1Word!);
        int damage2 = WordValue.Calculate(_state.Player2Word!);
        _state.Player1.TakeDamage(damage2);
        _state.Player2.TakeDamage(damage1);
        _state.Player1LastWord = _state.Player1Word;
        _state.Player2LastWord = _state.Player2Word;
        _state.Player1LastDamage = damage2;
        _state.Player2LastDamage = damage1;
        _state.Player1Word = null;
        _state.Player2Word = null;
        _state.RoundNumber++;
        if (IsOver())
        {
            _state.Status = GameStatus.Finished;
            return;
        }
        var newPool = LetterPool.Generate(20);
        _state.Pool.Clear();
        _state.Pool.AddRange(newPool);
    }
}
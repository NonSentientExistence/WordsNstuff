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

    public void SubmitWord(string playerId, string word)
    {
        //Reject if word isn't in the dictionary 
        if (!_validator.IsValid(word)) return;
        // Store the submitted word to the correct player
        if (playerId == _state.Player1.Id)
            _state.Player1Word = word.ToUpper();
        else if (playerId == _state.Player2.Id)
            _state.Player2Word = word.ToUpper();

        // Only resolve round when both players have submitted
        if (_state.Player1Word != null && _state.Player2Word != null)
            ResolveRound();
    }

    private void ResolveRound()
    {
        // Calculate damage for each word
        int damage1 = WordValue.Calculate(_state.Player1Word!);
        int damage2 = WordValue.Calculate(_state.Player2Word!);

        // Both players takes damage
        _state.Player1.TakeDamage(damage2); // player1 takes damage from player2's word and vice versa
        _state.Player2.TakeDamage(damage1); 

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
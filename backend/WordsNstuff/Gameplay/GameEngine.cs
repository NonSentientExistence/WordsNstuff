// här kan vi skriva spelregler, poäng, validering

public class GameEngine
{
    private readonly GameState _state;

    public GameEngine(GameState state)
    {
        _state = state;
    }

    public void SubmitWord(string playerId, string word)
    {
        // Store the word for the correct player
        if (playerId == _state.Player1.Id)
            _state.Player1Word = word.ToUpper();
        else if (playerId == _state.Player2.Id)
            _state.Player2Word = word.ToUpper();

        // Only resolve when BOTH players have submitted
        if (_state.Player1Word != null && _state.Player2Word != null)
            ResolveRound();
    }

    private void ResolveRound()
    {
        // Calculate damage for each word
        int damage1 = WordValue.Calculate(_state.Player1Word!);
        int damage2 = WordValue.Calculate(_state.Player2Word!);

        // Both players take damage simultaneously
        _state.Player1.TakeDamage(damage2); // player1 takes damage from player2's word
        _state.Player2.TakeDamage(damage1); // player2 takes damage from player1's word

        // Clear words ready for next round
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
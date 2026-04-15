public class GameState
{
    public string LobbyCode { get; set; } = "";
    public string CurrentTurnToken { get; set; } = "";
    public List<char> LetterPool { get; set; } = new();
    public List<char> Player1Hand { get; set; } = new();
    public List<char> Player2Hand { get; set; } = new();
    public int Player1Health { get; set; } = 100;
    public int Player2Health { get; set; } = 100;
}

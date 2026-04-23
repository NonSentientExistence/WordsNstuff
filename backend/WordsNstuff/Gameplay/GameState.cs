public class GameState
{
    public readonly object Lock = new();
    public string GameId { get; }
    public Player Player1 { get; }
    public Player Player2 { get; }
    public List<char> Pool { get; }
    public GameStatus Status { get; set; }

    // Holds player words, starts at null
    public string? Player1Word { get; set; }
    public string? Player2Word { get; set; }
    public string? Player1LastWord { get; set; }
    public string? Player2LastWord { get; set; }
    public string? Player1LastDamage { get; set; }
    public string? Player2LastDamage { get; set; }
    

    public GameState(string player1Id, string player2Id)
    {
        GameId = Guid.NewGuid().ToString();
        Player1 = new Player(player1Id);
        Player2 = new Player(player2Id);
        Pool = LetterPool.Generate(20);
        Status = GameStatus.InProgress;
    }

}
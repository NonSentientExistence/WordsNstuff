
public class Player
{
    public string Id {get;}
    public int Hp {get; set;}

    public Player(string id)
    {
        Id = id;
        Hp = 100;
    }

    // Player takes damage funtion
    public void TakeDamage(int damage)
    {
        //Ensure that the player HP is never below 0
        Hp = Math.Max(0, Hp - damage);
    }

    public bool IsDefeated()
    {
        return Hp <= 0;
    }
}
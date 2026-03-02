namespace EverySecondLetter.Services;

public sealed class WordsService
{
    // A tiny built-in dictionary for demo purposes.
    // Replace with file/DB-backed validation later without touching the game rules.
    private readonly HashSet<string> _words = new(StringComparer.OrdinalIgnoreCase)
    {
        "hello","world","test","tests","word","game","games","letter","letters",
        "spel","ord","ordspel","testning","kod","koda","koder","api","backend","frontend",
        "hej","du","jag","vi","ni","den","det","som","kan","ska","bra","kul"
    };

    public bool IsValid(string word) =>
        !string.IsNullOrWhiteSpace(word) && _words.Contains(word.Trim());
}

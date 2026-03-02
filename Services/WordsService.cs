using System.Globalization;

namespace EverySecondLetter.Services;

public sealed class WordsService
{
    private readonly HashSet<string> _words;

    public WordsService(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "wordlists", "enable1.txt");

        if (!File.Exists(path))
            throw new InvalidOperationException($"Word list not found at {path}");

        _words = File.ReadLines(path)
            .Select(w => w.Trim())
            .Where(w => w.Length >= 3)                 // disallow words shorter than 3
            .Select(w => w.ToLowerInvariant())         // normalize
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    public bool IsValid(string word)
    {
        if (string.IsNullOrWhiteSpace(word))
            return false;

        return _words.Contains(word.Trim().ToLowerInvariant());
    }
}
public static class LetterPool
{
    // Letter list with multiple copies of common letters, based on letter 
    private static readonly List<char> LetterBag = new()
    {
        'A','A','A','A','A','A','A','A','A',
        'E','E','E','E','E','E','E','E','E','E','E','E',
        'I','I','I','I','I','I','I','I','I',
        'O','O','O','O','O','O','O','O',
        'U','U','U','U',
        'L','L','L','L',
        'N','N','N','N','N','N',
        'S','S','S','S',
        'T','T','T','T','T','T',
        'R','R','R','R','R','R',
        'D','D','D','D',
        'G','G','G',
        'B','B',
        'C','C',
        'M','M',
        'P','P',
        'F','F',
        'H','H',
        'V','V',
        'W','W',
        'Y','Y',
        'K',
        'J',
        'X',
        'Q',
        'Z'
    };

    private static readonly Random Rng = new();

    public static List<char> Generate(int size)
    {
        // Pick 'size' random letters from the bag, with replacement
        return Enumerable.Range(0, size)
                         .Select(_ => LetterBag[Rng.Next(LetterBag.Count)])
                         .ToList();
    }
}
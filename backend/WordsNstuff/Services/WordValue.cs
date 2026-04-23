public static class WordValue
{
    // Dictionary for letter values
    private static readonly Dictionary<char, int> LetterValues = new()
    {
        {'A', 1}, {'E', 1}, {'I', 1}, {'O', 1}, {'U', 1},
        {'L', 1}, {'N', 1}, {'S', 1}, {'T', 1}, {'R', 1},
        {'D', 2}, {'G', 2},
        {'B', 3}, {'C', 3}, {'M', 3}, {'P', 3},
        {'F', 4}, {'H', 4}, {'V', 4}, {'W', 4}, {'Y', 4},
        {'K', 5},
        {'J', 8}, {'X', 8},
        {'Q', 10}, {'Z', 10}
    };

    public static int Calculate(string word)
    {
        //Handles empty string for skip round
        if (string.IsNullOrEmpty(word)) return 0;
        //Convert input string to uppercase to avoid case sensetive errors
        return word.ToUpper()
                    .Sum(letter => LetterValues.GetValueOrDefault(letter, 0));
    }
}
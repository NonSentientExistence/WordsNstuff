using System.ComponentModel.DataAnnotations;

public class WordValidator
{
    private readonly HashSet<string> _words;

    //Using hashset instead of list for performace optimization of word lookup
    public WordValidator(string filePath)
    {
        var fullPath = Path.Combine(AppContext.BaseDirectory, filePath); //Added Path.Combine from Basedir to ensure the path to words.txt is always correct
        _words = File.ReadAllLines(fullPath)
        .Select(w => w.Trim().ToLower())
        .Where(w => w.Length > 1)  //Filters out 1 letter words. 
        .ToHashSet();
    }

    public bool IsValid(string word)
    {
        if (string.IsNullOrEmpty(word)) {
        return false;
        }
        return _words.Contains(word.ToLower());
    }
}
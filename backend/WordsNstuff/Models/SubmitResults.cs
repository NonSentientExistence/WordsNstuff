public enum SubmitResult
{
    Success,
    InvalidWord,    // Word isn't in the dictionary
    InvalidPool     // Word submitted contains letters that are not in the pool
}
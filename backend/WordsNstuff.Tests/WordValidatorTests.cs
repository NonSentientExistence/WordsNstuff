public class WordValidatorTests
{
    private readonly WordValidator _validator;

    public WordValidatorTests()
    {
        _validator = new WordValidator("Resources/words.txt");
    }

    // Ensure some common words are valid words
    [Fact]
    public void CommonWord_IsValid()
    {
        Assert.True(_validator.IsValid("cat"));
        Assert.True(_validator.IsValid("meat"));
        Assert.True(_validator.IsValid("car"));
        Assert.True(_validator.IsValid("him"));
    }

    //Ensure Uppercase words are valid
    [Fact]
    public void CommonWord_IsValid_InUpperCase()
    {
        Assert.True(_validator.IsValid("CAT"));
        Assert.True(_validator.IsValid("MEAT"));
        Assert.True(_validator.IsValid("CAR"));
        Assert.True(_validator.IsValid("HIM"));
    }

    //Ensure incorrect word is invalid
    [Fact]
    public void IncorrectWord_IsNotValid()
    {
        Assert.False(_validator.IsValid("dftjdjdrjd"));
        Assert.False(_validator.IsValid("sjghuhönö"));
        Assert.False(_validator.IsValid("123"));
        Assert.False(_validator.IsValid("!=./&"));
    }

    //Ensure an empty string assesses to IsValid == false and doesn't crash
    [Fact]
    public void EmptyWord_IsNotValid()
    {
        Assert.False(_validator.IsValid(""));
    }

    //Ensure 1 letter word is invalid. filtered out in WordValidator
    [Fact]
    public void OneLetterWord_IsNotValid()
    {
        Assert.False(_validator.IsValid("e"));
        Assert.False(_validator.IsValid("E"));
        Assert.False(_validator.IsValid("c"));
        Assert.False(_validator.IsValid("C"));
    }

}
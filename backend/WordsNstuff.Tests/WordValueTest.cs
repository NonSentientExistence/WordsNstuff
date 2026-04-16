public class WordValueTests
{
    // Test the value of the word Cat. C(3) + A(1) + T(1) = 5
    [Fact]
    public void CalculateWordValue_SimpleWord_ReturnsCorrectSum()
    {
        var result = WordValue.Calculate("CAT");
        Assert.Equal(5, result);
    }

    //Ensure word calculate can handle words case insensitive
    [Fact]
    public void CalculateWordValue_LowercaseWord_ReturnsCorrectSum()
    {
        var result = WordValue.Calculate("cat");
        Assert.Equal(5, result);
    }

    // Word value calculate test with high value letters. J(8) + O(1) + Y(4) = 13
    [Fact]
    public void CalculateWordValue_HighValueLetters_ReturnsCorrectSum()
    {
        var result = WordValue.Calculate("JOY");
        Assert.Equal(13, result);
    }

    // Ensure empty word returns 0 and doesn't crash
    [Fact]
    public void CalculateWordValue_Empty_Returns0()
    {
        var result = WordValue.Calculate("");
        Assert.Equal(0, result);
    }
}
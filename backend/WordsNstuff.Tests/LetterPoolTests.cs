public class LetterPoolTests
{
    //Tests that the pool generator return the correct amount of letters, for now 20
    [Fact]
    public void GenerateLetterPool_ReturnsCorrectPoolSize()
    {
        var pool = LetterPool.Generate(20);
        Assert.Equal(20, pool.Count);
    }

    //Tests so all letters in the pool are valid letters (A - Z)
    [Fact]
    public void GenerateLetterPool_AllValidLetters()
    {
        var pool = LetterPool.Generate(20);
        Assert.All(pool, letter => Assert.InRange(letter, 'A', 'Z'));
    }

    // Ensure that a pool of 100 letters contains at least 1 vovwel, should contain several.
    [Fact]
    public void GenerateLetterPool_ContainsVowels()
    {
        var pool = LetterPool.Generate(100);
        var vowels = new[] { 'A', 'E', 'I', 'O', 'U' };
        Assert.Contains(pool, letter => vowels.Contains(letter));
    }

    // Test so that two generated letter pools are not the same. There is a tiny tiny chance they are but an acceptable risk
    [Fact]
    public void GenerateLetterPool_GeneratedPoolsDiffer()
    {
        var pool1 = LetterPool.Generate(20);
        var pool2 = LetterPool.Generate(20);
        Assert.NotEqual(pool1, pool2);
    }
}
namespace App.Tests;

public class GreeterTest
{
    private readonly Greeter _greeter = new();

    [Fact]
    public void Greet_ReturnsGreetingWithName()
    {
        var result = _greeter.Greet("Anna");
        Assert.Equal("Hello, Anna!", result);
    }

    [Theory]
    [InlineData("Erik", "Hello, Erik!")]
    [InlineData("Maria", "Hello, Maria!")]
    public void Greet_WorksWithDifferentNames(string name, string expected)
    {
        var result = _greeter.Greet(name);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Greet_ThrowsOnEmptyName(string? name)
    {
        Assert.Throws<ArgumentException>(() => _greeter.Greet(name!));
    }
}
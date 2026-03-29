using EverySecondLetter.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Xunit;

namespace EverySecondLetter.UnitTests;

public sealed class WordsServiceTests
{
  [Fact]
  public void Constructor_Throws_WhenWordListFileIsMissing()
  {
    using var tempDir = new TempDirectory();
    var env = new FakeWebHostEnvironment(tempDir.Path);

    var ex = Assert.Throws<InvalidOperationException>(() => new WordsService(env));

    Assert.Contains("Word list not found", ex.Message, StringComparison.OrdinalIgnoreCase);
  }

  [Fact]
  public void IsValid_ReturnsTrue_ForKnownWord_CaseInsensitiveAndTrimmed()
  {
    using var tempDir = new TempDirectory();
    CreateWordList(tempDir.Path, "cat", "dog", "tes");
    var sut = new WordsService(new FakeWebHostEnvironment(tempDir.Path));

    Assert.True(sut.IsValid(" CAT "));
    Assert.True(sut.IsValid("dog"));
  }

  [Theory]
  [InlineData("")]
  [InlineData(" ")]
  [InlineData("unknown")]
  public void IsValid_ReturnsFalse_ForBlankOrUnknownWord(string input)
  {
    using var tempDir = new TempDirectory();
    CreateWordList(tempDir.Path, "cat", "dog");
    var sut = new WordsService(new FakeWebHostEnvironment(tempDir.Path));

    Assert.False(sut.IsValid(input));
  }

  [Fact]
  public void Constructor_IgnoresWordsShorterThanThreeLetters()
  {
    using var tempDir = new TempDirectory();
    CreateWordList(tempDir.Path, "an", "to", "cat");
    var sut = new WordsService(new FakeWebHostEnvironment(tempDir.Path));

    Assert.False(sut.IsValid("an"));
    Assert.False(sut.IsValid("to"));
    Assert.True(sut.IsValid("cat"));
  }

  private static void CreateWordList(string rootPath, params string[] words)
  {
    var wordListDir = System.IO.Path.Combine(rootPath, "wordlists");
    Directory.CreateDirectory(wordListDir);
    File.WriteAllLines(System.IO.Path.Combine(wordListDir, "enable1.txt"), words);
  }

  private sealed class FakeWebHostEnvironment(string contentRootPath) : IWebHostEnvironment
  {
    public string ApplicationName { get; set; } = "EverySecondLetter.UnitTests";
    public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
    public string WebRootPath { get; set; } = string.Empty;
    public string EnvironmentName { get; set; } = "Development";
    public string ContentRootPath { get; set; } = contentRootPath;
    public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
  }

  private sealed class TempDirectory : IDisposable
  {
    public TempDirectory()
    {
      Path = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "esl-tests-" + Guid.NewGuid().ToString("N"));
      Directory.CreateDirectory(Path);
    }

    public string Path { get; }

    public void Dispose()
    {
      if (Directory.Exists(Path))
        Directory.Delete(Path, recursive: true);
    }
  }
}
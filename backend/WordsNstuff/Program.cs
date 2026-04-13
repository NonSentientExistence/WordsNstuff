var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var greeter = new Greeter();

app.MapGet("/api/hello", () => new { message = "Hello from .NET!" });
app.MapGet("/api/greet/{name}", (string name) => new { message = greeter.Greet(name) });

app.Run();
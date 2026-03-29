using EverySecondLetter.Services;

namespace EverySecondLetter.Api;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseGameApiPipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseApiExceptionHandling();
        app.UseDefaultFiles();
        app.UseStaticFiles();
        app.UseGameSpaFallback();

        return app;
    }

    private static IApplicationBuilder UseApiExceptionHandling(this IApplicationBuilder app)
    {
        app.Use(async (ctx, next) =>
        {
            try
            {
                await next();
            }
            catch (ApiException ex)
            {
                ctx.Response.StatusCode = ex.StatusCode;
                await ctx.Response.WriteAsJsonAsync(new { error = ex.Message, status = ex.StatusCode });
            }
        });

        return app;
    }

    private static IApplicationBuilder UseGameSpaFallback(this IApplicationBuilder app)
    {
        app.Use(async (ctx, next) =>
        {
            var path = ctx.Request.Path.Value ?? "/";
            var ext = Path.GetExtension(path);

            if (!path.StartsWith("/games") && string.IsNullOrEmpty(ext) && path != "/" && path != "/index.html")
            {
                ctx.Request.Path = "/index.html";
            }

            await next();
        });

        return app;
    }
}

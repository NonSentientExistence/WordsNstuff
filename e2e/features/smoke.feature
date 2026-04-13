Feature: Smoke-test

    Scenario: Startsidan går att öppna
        Given att jag öppnar startsidan
        Then ska jag se en rubrik på nivå 1 på sidan

    Scenario: API:et svarar via proxyn
        Given att jag öppnar "/api/hello" i webbläsaren
        Then ska jag se texten "Hello from .NET!"
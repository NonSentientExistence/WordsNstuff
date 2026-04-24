Feature: Smoke-test

    Scenario: Home page can be opened
        Given I open the main page
        Then I shall see a level 1 heading on the page

    Scenario: The API responds via the proxy
        Given I open "/api/hello" in the browser
        Then I shall see the text "Hello from .NET!"

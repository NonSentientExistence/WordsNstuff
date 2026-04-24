Feature: Lobby

    Scenario: Create a lobby
        Given I open the main page
        When I press "Create Lobby"
        Then I shall see a lobby code

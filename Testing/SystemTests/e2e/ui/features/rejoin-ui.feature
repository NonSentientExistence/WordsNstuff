Feature: Rejoin scenarios in UI

  Scenario: Player can rejoin after browser refresh
    Given ett spel där både spelarna är aktiva
    When spelare 2 uppdaterar sidan (browser refresh)
    Then återställs spelet automatiskt till samma state
    And spelers stats förblir oförändrade

  Scenario: Rejoin from saved sessionStorage credentials
    Given ett spel med två aktiva spelare
    When spelare 2 öppnar appen i nytt fönster med sparade credentials
    Then visar gränssnittet spelet i samma status

Feature: Rejoin scenarios in UI

  Scenario: Player can rejoin after browser refresh
    Given ett spel där både spelarna är aktiva
    When spelare 2 uppdaterar sidan (browser refresh)
    Then återställs spelet automatiskt till samma state
    And visar sitt player token
    And spelers stats förblir oförändrade

  Scenario: Rejoin shows correct game link and credentials
    Given ett spel med två aktiva spelare
    When spelare 1 kopierar game link
    And öppnar länken i nytt fönster
    Then visar det andra fönstret samma game ID
    When andra spelaren enters sitt redan existerande token
    Then visar gränssnittet spelet i samma status

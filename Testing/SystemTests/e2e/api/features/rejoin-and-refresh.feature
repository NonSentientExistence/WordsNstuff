Feature: Rejoin and browser refresh scenarios

  Scenario: Player can rejoin with their token after refresh
    Given ett spel där spelare 1 och 2 är aktiva
    When spelare 2 gör en rejoin-förfrågan med sitt token
    Then får spelare 2 samma token tillbaka
    And spelet förblir i samma status och samma spelar-state

  Scenario: Rejoin preserves player token and game state
    Given ett spel där några bokstäver lagts och pending dispute
    When spelare 2 rejoinnar
    Then spelet visar samma ordstat, samma spelare, samma pending claim

  Scenario: Rejoin does not duplicate player
    Given ett spel med två spelare
    And spelet är i status InProgress
    When spelare 2 rejoinnar
    Then spelet har fortfarande exakt 2 spelare (ingen duplicering)
    And spelare 2 är samma player ID

  Scenario: New player cannot join via rejoin header in empty game slot
    Given ett nytt spel med spelare 1 enbart
    When en helt ny speler försöker rejoin med ett falskt token
    Then behandlas detta som ny join (ingen rejoin match)
    And spelet startar normalt med två spelare

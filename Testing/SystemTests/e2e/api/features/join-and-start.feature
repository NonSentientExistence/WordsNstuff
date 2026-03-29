Feature: Join and game start flow

  Scenario: Player 2 joins and game auto-starts
    Given ett nytt spel skapats med spelare 1
    When spelare 2 joinnar med samma game ID
    Then spelet har status InProgress och två spelare

  Scenario: Player cannot join when game is InProgress
    Given ett spel i status InProgress med två spelare
    When en tredje spelare försöker att joina
    Then får tredje spelaren status 409 "Game is not joinable"

  Scenario: Cannot rejoin if already in game via new join
    Given ett nytt spel med två spelare
    When spelare 2 försöker att joina samma spel igen
    Then returnerar servern samma spelare 2 token
    And spelet förblir oförändrat (status och spelarantal)

  Scenario: Player names are persisted in game state
    Given ett nytt namngivet spel skapas med spelare Alice
    When spelare Bob joinnar samma spel
    Then game state innehåller spelarnamnen Alice och Bob i turordning

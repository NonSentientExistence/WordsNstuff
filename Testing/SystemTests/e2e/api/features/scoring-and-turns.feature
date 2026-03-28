Feature: Scoring calculation and turn rotation

  Scenario: Accept action: scorer receives baseScore = (letters_placed)²
    Given ett nytt API-spel med två spelare
    When spelare 1 lägger H E L (3 bokstäver) och claimar
    And spelare 2 accepterar
    Then spelare 1 får poäng 9 (3² = 9)
    And ordet återställs till tomt
    And nästa spelers tur är spelare 1 (opponent of claimer)

  Scenario: Accept action consumes one accept from responder
    Given ett nytt API-spel med två spelare
    When spelare 1 lägger C A T och claimar
    And spelare 2 accepterar
    Then spelare 2 har 4 accepts kvar (5 - 1)
    And spelare 1 har fortfarande 5 accepts (ej påverkad)

  Scenario: Dispute valid word: claimer 150% of baseScore
    Given ett nytt API-spel med två spelare
    When spelare 1 lägger C A T (2 letters placed by p1) och claimar
    And spelare 2 bestrider (ord är giltigt)
    Then spelare 1 får poäng 6 (2² × 1.5 = 6)
    And spelare 2 får poäng 0
    And spelare 2 har 4 disputes kvar (5 - 1)

  Scenario: Dispute invalid word: opponent 50% of baseScore
    Given ett nytt API-spel med två spelare
    When spelare 1 lägger T E S (2 letters placed by p1) och claimar
    And spelare 2 bestrider (ord är ogiltigt)
    Then spelare 1 får poäng 0
    And spelare 2 får poäng 2 (2² × 0.5 = 2)
    And spelare 2 har 4 disputes kvar (5 - 1)

  Scenario: Turn rotation after accept/dispute
    Given ett nytt API-spel med två spelare
    When spelare 1 bygger C A T och claimar
    And spelare 2 accepterar
    Then nästa aktiv spelare är spelare 1 (motsats av claimer)
    When spelare 1 bygger C A T igen och claimar
    And spelare 2 accepterar
    Then nästa aktiv spelare är spelare 1 (motsats av claimer)

  Scenario: Multiple scoring scenarios in same game
    Given ett nytt API-spel med två spelare
    When spelare 1 bygger C A T (2 letters) och claimar
    And spelare 2 accepterar
    Then spelare 1 får 4 poäng (2²)
    When spelare 2 bygger D O G (2 letters) och claimar
    And spelare 1 bestrider och ord är giltigt
    Then spelare 2 får 6 poäng (2² × 1.5)
    When spelare 1 bygger T E S (2 letters) och claimar
    And spelare 2 bestrider och ord är ogiltigt
    Then spelare 1 får 0, spelare 2 får 2 poäng totalt (2 + 6 = 8)

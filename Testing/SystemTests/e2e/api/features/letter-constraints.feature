Feature: Letter input constraints and validation

  Scenario: Case insensitivity for letters
    Given ett nytt API-spel med två spelare för bokstavstester
    When spelare 1 lägger bokstaven 'a' (lowercase)
    And spelare 2 lägger bokstaven 'B' (uppercase)
    And spelare 1 lägger bokstaven 'c' (lowercase)
    Then ordet är "ABC" (alla konverterade till versaler)

  Scenario: Scandinavian letters accepted (ÅÄÖ)
    Given ett nytt API-spel med två spelare för bokstavstester
    When spelare 1 lägger bokstaven 'Å'
    Then accepteras bokstaven und ordet blir "Å"

  Scenario: Empty letter input rejected
    Given ett nytt API-spel med två spelare för bokstavstester
    When spelare 1 försöker att lägga en tom bokstav
    Then får spelare 1 status 400 "Letter is required"

  Scenario: Multiple characters rejected
    Given ett nytt API-spel med två spelare för bokstavstester
    When spelare 1 försöker att lägga "AB"
    Then får spelare 1 status 400 "Letter must be exactly one character"

  Scenario: Non-letter characters rejected
    Given ett nytt API-spel med två spelare för bokstavstester
    When spelare 1 försöker att lägga '1'
    Then får spelare 1 status 400 "Letter must be A-Z"
    When spelare 1 försöker att lägga '-'
    Then får spelare 1 status 400 "Letter must be A-Z"

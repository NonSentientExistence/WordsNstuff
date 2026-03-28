Feature: Full end-to-end game completion flow

  Scenario: Complete game from creation through multiple rounds to finish
    Given två spelare startar ett nytt spel i UI
    When spelare 1 spelar bokstäver C A T (3 bokstäver)
    Then visar gränssnittet ordet CAT med bokstäver som tiles
    When spelare 1 claimar ordet
    Then visar gränssnittet status PendingDispute
    And visas ordet som pending
    And disputeknappen är tillgänglig för spelare 2
    When spelare 2 accepterar
    Then visar gränssnittet spelare 1 får 4 poäng (2² när p1 lade C och T)
    And ordet återställs till tomt
    When spela flera runor tills båda spelarna har färre accepts
    Then spelet visar rätt poängställning efter varje round
    When båda spelarna förbrukar alla accepts
    Then visar gränssnittet status Finished
    And visar vinnare eller oavgjort

  Scenario: Accept button shows remaining count
    Given ett spel i progress med två spelare
    When spelare 1 bygger CAT och claimar
    Then visar accept-knappen "Accept (5)" för spelare 2
    When spelare 2 accepterar
    Then visar accept-knappen "Accept (4)" för spelare 2
    When spelare 1 bygger CAT igen och claimar
    Then visar accept-knappen "Accept (4)" för spelare 2

  Scenario: Dispute button shows remaining count
    Given ett spel i progress med två spelare
    When spelare 1 bygger CAT och claimar
    Then visar dispute-knappen "Dispute (5)" för spelare 2
    When spelare 2 bestrider (motsättningsord)
    Then visar dispute-knappen "Dispute (4)" för spelare 2

  Scenario: Claim button only available to player who placed last letter
    Given ett spel där spelare 1 låg sista bokstaven
    Then visar gränssnittet claim-knappen som tillgänglig för spelare 1
    And visar claim-knappen som inaktiverad för spelare 2

  Scenario: Minimum 3 letters required for claim
    Given ett spel med två bokstäver i ordet
    Then visar claim-knappen som inaktiverad för båda spelarna

  Scenario: Current word displays as tiles
    Given ett spel i progress
    When spelare 1 lägger H
    Then visar gränssnittet bokstaven H som en tile
    When spelare 2 lägger E
    Then visar gränssnittet bokstäver H och E som tiles

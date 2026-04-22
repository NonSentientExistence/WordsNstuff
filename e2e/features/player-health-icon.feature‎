Feature: Player Health Visualization
  As a player
  I want to see my character's health status visually
  So that I can immediately understand how damaged I am

  Scenario: Healthy player shows green icon
    Given I have 100 HP
    When I look at my health icon
    Then the icon should be green
    And the face should show a smile
    And no cracks or blood should be visible

  Scenario: Damaged player shows yellow icon with bandage
    Given I have 60 HP
    When I look at my health icon
    Then the icon should be yellow
    And a bandage should be visible on the head
    And a small crack should appear

  Scenario: Critical player shows red icon with blood and cracks
    Given I have 20 HP
    When I look at my health icon
    Then the icon should be red
    And the face should show a sad expression
    And blood splatters should be visible
    And multiple cracks should appear
    And the head should shake slightly

  Scenario: Defeated player shows dark red broken icon
    Given I have 0 HP
    When I look at my health icon
    Then the icon should be dark red
    And the icon should be semi-transparent
    And the icon should appear blurred
    And the label should show "0%" with strikethrough

  Scenario: Health icon updates smoothly when taking damage
    Given I have 100 HP
    When I take 40 damage
    Then the icon should transition from green to yellow
    And the health label should update to "60%"
    And a shake animation should play on the icon
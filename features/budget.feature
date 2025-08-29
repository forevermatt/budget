Feature: Budget page loads
  As a user
  I want to see the budget overview
  So that I can manage my budget

  Scenario: Visit the home page and see the Budget heading
    Given the app is built and running
    When I go to the home page
    Then I should see a heading "Budget"
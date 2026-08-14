Feature: Budget management
  As a user
  I want to track my budget categories, accounts, and expenses
  So that I can manage my money

  Background:
    Given the app is running

  Scenario: Visit the home page and see the Budget heading
    When I go to the home page
    Then I should see a heading "Budget"

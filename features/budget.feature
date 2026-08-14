Feature: Budget management
  As a user
  I want to track my budget categories, accounts, and expenses
  So that I can manage my money

  Background:
    Given the app is running

  Scenario: Visit the home page and see the Budget heading
    When I go to the home page
    Then I should see a heading "Budget"

  Scenario: Create a budget category with a monthly amount
    When I go to the new category page
    And I name the category "Groceries"
    And I set its monthly amount to $500.00
    Then the budget overview should show "Groceries" with $500.00 remaining

  Scenario: Create an account
    When I go to the new account page
    And I name the account "Checking"
    Then the accounts list should show "Checking"

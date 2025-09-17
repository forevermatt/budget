Feature: Account Management
  As a user
  I want to add accounts and see them in the list
  So that I can manage my financial accounts

  Scenario: Add a new account and see it in the accounts list
    Given the app is built and running
    When I go to the accounts page
    Then I should see the "Accounts" heading
    And I should see an "Add new account" link
    When I click on "Add new account"
    Then I should see the "New Account" heading
    When I enter "My Savings Account" as the account name
    And I click the done button
    Then I should be redirected to the accounts page
    And I should see "My Savings Account" in the accounts list

  Scenario: View empty accounts list initially
    Given the app is built and running
    When I go to the accounts page
    Then I should see the "Accounts" heading
    And I should see an "Add new account" link
    And I should not see any existing accounts initially
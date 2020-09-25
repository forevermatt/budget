# Budget

A simple way to budget your money and reconcile your statements, built using Svelte.

## Try it out

You can try it out (not yet alpha) here:
https://forevermatt.github.io/svelte-budget/

## Roadmap

- [x] See list of categories with budgeted amounts
- [x] Add a category
- [x] Edit a category
- [x] Add a financial account
- [x] Add nicer buttons (with icons)
- [ ] Edit a financial account
- [x] Record an expense
- [x] Create separate repo to document data structure versions
- [x] Subtract the transaction amount from a category's budget upon completion
      of recording an expense
- [x] Move assembly of new transaction to separate local variable (to simplify
      process of updating remaining amounts for budget categories, both for
      when creating a new transaction and when editing an existing transaction)
- [x] Enable seeing a category's transactions
- [ ] Update Category view to show both budgeted and remaining amounts
- [ ] Add "next" buttons to allow progressing through record-an-expense using
      a mouse
- [x] Autofocus the appropriate input (where applicable) on arrival at each
      page
- [ ] Allow adding a comment/note on each transaction
- [ ] ...

## Data Structure

This application currently adheres to version 1.0.0 of the
https://github.com/forevermatt/budget-data specification.

## Development

### Icons

The list of icons available in the library I'm using can be found here:
https://fontawesome.com/icons?d=gallery

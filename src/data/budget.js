import { getCategory } from './categories'
import { addToList, updateInObject } from '../helpers/data-store-helpers'
import { getCurrentYearMonthString, getMonthAfter, isInPast } from '../helpers/dates'
import { getObjectFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'

const BUDGET = 'budget'

const budgetStore = writable({})
export {budgetStore as budget}

const addCategoryToBudget = (categoryId, budgeted) => {
  updateBudget(categoryId, {
    budgeted: budgeted,
    remaining: budgeted,
    refilled: getCurrentYearMonthString()
  })
}

export const getBudgetDataFor = categoryId => {
  return get(budgetStore)[categoryId] || {}
}

export const getBudgetedFor = categoryId => {
  let budgetCategory = getBudgetDataFor(categoryId)
  return budgetCategory.budgeted || 0
}

const isExistingCategory = id => get(budgetStore).hasOwnProperty(id)

const isNotDeleted = category => !category.deleted

export const loadBudget = () => {
  budgetStore.set(getObjectFromStorage(BUDGET))
}

export const refillBudgetCategories = () => {
  const budget = get(budgetStore)
  const budgetCategoryIds = Object.keys(budget)
  budgetCategoryIds.filter(isNotDeleted).forEach(refillBudgetCategory)
}

const refillBudgetCategory = categoryId => {
  let {budgeted, remaining, refilled} = getBudgetDataFor(categoryId)
  for (let i = 0; isInPast(refilled) && (i < 100); i++) {
    remaining += budgeted
    refilled = getMonthAfter(refilled)
  }
  updateBudget(categoryId, { remaining, refilled })
}

const saveBudget = () => saveToStorage(BUDGET, get(budgetStore))

export const setBudgetedForCategory = (id, budgeted) => {
  const budget = get(budgetStore)
  if (isExistingCategory(id)) {
    updateBudgetedForExistingCategory(id, budgeted)
  } else {
    addCategoryToBudget(id, budgeted)
  }
}

export const sortBudgetByCategory = (budget) => {
  let list = []
  for (var id in budget) {
    if (budget.hasOwnProperty(id)) {
      let category = getCategory(id)
      list.push({
        budgeted: budget[id].budgeted,
        remaining: budget[id].remaining,
        name: category.name,
        id: category.id,
        deleted: category.deleted,
      });
    }
  }
  return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export const subtractAmountFromBudgetCategory = (categoryId, amountToSubtract) => {
  const budgetCategory = getBudgetDataFor(categoryId)
  const oldRemaining = budgetCategory.remaining || 0
  const newRemaining = oldRemaining - amountToSubtract
  updateBudget(categoryId, { remaining: newRemaining })
}

export const updateBudget = (categoryId, changes) => {
  updateInObject(categoryId, changes, budgetStore)
  saveBudget()
}

const updateBudgetedForExistingCategory = (categoryId, budgeted) => {
  const budget = get(budgetStore)
  let categoryAmounts = budget[categoryId]
  let previousBudgeted = categoryAmounts.budgeted
  let previousRemaining = categoryAmounts.remaining
  let remaining = previousRemaining + (budgeted - previousBudgeted)
  updateBudget(categoryId, {budgeted, remaining})
}

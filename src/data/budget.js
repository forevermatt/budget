import { getCategory } from './categories'
import { addToList, updateInObject } from '../helpers/data-store-helpers'
import { getCurrentYearMonthString, getMonthAfter, isInPast } from '../helpers/dates'
import { getObjectFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'

const BUDGET = 'budget'

const budgetStore = writable({})
export {budgetStore as budget}

const addCategoryToBudget = (categoryUuid, budgeted) => {
  updateBudget(categoryUuid, {
    budgeted: budgeted,
    remaining: budgeted,
    refilled: getCurrentYearMonthString()
  })
}

export const getBudgetDataFor = categoryUuid => {
  return get(budgetStore)[categoryUuid] || {}
}

export const getBudgetedFor = categoryUuid => {
  let budgetCategory = getBudgetDataFor(categoryUuid)
  return budgetCategory.budgeted || 0
}

const isExistingCategory = uuid => get(budgetStore).hasOwnProperty(uuid)

export const loadBudget = () => {
  budgetStore.set(getObjectFromStorage(BUDGET))
}

export const refillBudgetCategories = () => {
  const budget = get(budgetStore)
  const budgetCategoryUuids = Object.keys(budget)
  budgetCategoryUuids.forEach(refillBudgetCategory)
}

const refillBudgetCategory = categoryUuid => {
  let {budgeted, remaining, refilled} = getBudgetDataFor(categoryUuid)
  for (let i = 0; isInPast(refilled) && (i < 100); i++) {
    remaining += budgeted
    refilled = getMonthAfter(refilled)
  }
  updateBudget(categoryUuid, { remaining, refilled })
}

const saveBudget = () => saveToStorage(BUDGET, get(budgetStore))

export const setBudgetedForCategory = (uuid, budgeted) => {
  const budget = get(budgetStore)
  if (isExistingCategory(uuid)) {
    updateBudgetedForExistingCategory(uuid, budgeted)
  } else {
    addCategoryToBudget(uuid, budgeted)
  }
}

export const sortBudgetByCategory = (budget) => {
  let list = []
  for (var uuid in budget) {
    if (budget.hasOwnProperty(uuid)) {
      let category = getCategory(uuid)
      list.push({
        budgeted: budget[uuid].budgeted,
        remaining: budget[uuid].remaining,
        name: category.name,
        uuid: category.uuid,
      });
    }
  }
  return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export const subtractAmountFromBudgetCategory = (categoryUuid, amountToSubtract) => {
  const budgetCategory = getBudgetDataFor(categoryUuid)
  const oldRemaining = budgetCategory.remaining || 0
  const newRemaining = oldRemaining - amountToSubtract
  updateBudget(categoryUuid, { remaining: newRemaining })
}

export const updateBudget = (categoryUuid, changes) => {
  updateInObject(categoryUuid, changes, budgetStore)
  saveBudget()
}

const updateBudgetedForExistingCategory = (categoryUuid, budgeted) => {
  const budget = get(budgetStore)
  let categoryAmounts = budget[categoryUuid]
  let previousBudgeted = categoryAmounts.budgeted
  let previousRemaining = categoryAmounts.remaining
  let remaining = previousRemaining + (budgeted - previousBudgeted)
  updateBudget(categoryUuid, {budgeted, remaining})
}

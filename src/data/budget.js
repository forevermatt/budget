import { updateInObject } from '../helpers/data-store-helpers'
import { getMonthAfter, isInPast } from '../helpers/dates'
import { getObjectFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'

const BUDGET = 'budget'

const budgetStore = writable({})
export {budgetStore as budget}

export const getBudgetDataFor = categoryId => {
  return get(budgetStore)[categoryId] || {}
}

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

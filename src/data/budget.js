import { getCategory, updateCategory } from './categories'
import { updateInObject } from '../helpers/data-store-helpers'
import { getMonthAfter, isInPast } from '../helpers/dates'
import { saveToStorage } from './storage'
import { get, writable } from 'svelte/store'

const BUDGET = 'budget'

const budgetStore = writable({})
export {budgetStore as budget}

export const getBudgetDataFor = categoryId => {
  return get(budgetStore)[categoryId] || {}
}

const isNotDeleted = category => !category.deleted

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

export const subtractAmountFromBudgetCategory = async (categoryId, amountToSubtract) => {
  const category = await getCategory(categoryId)
  const oldRemaining = category.remaining || 0
  const newRemaining = oldRemaining - amountToSubtract
  await updateCategory(categoryId, { remaining: newRemaining })
}

export const updateBudget = (categoryId, changes) => {
  updateInObject(categoryId, changes, budgetStore)
  saveBudget()
}

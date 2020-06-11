import { getCategoryFrom } from './categories'
import { addToList, updateInObject } from '../helpers/data-store-helpers'
import { getCurrentYearMonthString } from '../helpers/dates'
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

export const getBudgetedFor = uuid => {
  let budgetCategory = get(budgetStore)[uuid] || {}
  return budgetCategory.budgeted || 0
}

const isExistingCategory = uuid => get(budgetStore).hasOwnProperty(uuid)

export const loadBudget = () => {
  budgetStore.set(getObjectFromStorage(BUDGET))
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

export const sortBudgetByCategory = (budget, categories) => {
  let list = []
  for (var uuid in budget) {
    if (budget.hasOwnProperty(uuid)) {
      let category = getCategoryFrom(uuid, categories)
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
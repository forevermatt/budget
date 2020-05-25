import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getCurrentYearMonthString } from '../helpers/dates'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'

const BUDGETS = 'budgets'

export const budgets = writable([])

export const getBudgetFor = yearMonth => {
  return get(budgets).find(b => b.yearMonth === yearMonth) || {}
}

export const loadBudgets = () => {
  budgets.set(getListFromStorage(BUDGETS))
}

const saveBudgets = () => saveToStorage(BUDGETS, get(budgets))

export const setBudgetForCategory = (uuid, cents, yearMonth) => {
  let budget = getBudgetFor(yearMonth)
  let plan = budget.plan || {}
  
  let amountsForCategory = plan[uuid] || {}
  let newAmountsForCategory = {
    budgeted: cents,
    spent: amountsForCategory.spent || 0,
  }
  
  plan[uuid] = newAmountsForCategory
  updateBudget(yearMonth, {plan})
}

export const setCurrentBudgetForCategory = (uuid, cents) => {
  setBudgetForCategory(uuid, cents, getCurrentYearMonthString())
}

export const sortPlanByCategory = (plan, categories) => {
  let list = []
  for (var categoryUuid in plan) {
    if (plan.hasOwnProperty(categoryUuid)) {
      let category = categories.find(c => c.uuid = categoryUuid) || {}
      list.push({
        'budgeted': plan.budgeted,
        'spent': budgetCategory.spent,
        'category': category,
      });
    }
  }
  return list.sort((a, b) => (a.category.name || '').localeCompare(b.category.name || ''));
}

export const updateBudget = (yearMonth, changes) => {
  updateInList('yearMonth', yearMonth, changes, budgets)
  saveBudgets()
}

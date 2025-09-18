import { getCategory, listCategories, updateCategory } from './categories'
import { updateInObject } from '../helpers/data-store-helpers'
import { getCurrentYearMonthString, getMonthAfter, isInPast } from '../helpers/dates'
import { saveToStorage } from './storage'
import { get, writable } from 'svelte/store'

const BUDGET = 'budget'

const budgetStore = writable({})
export {budgetStore as budget}

const fillBudgetCategory = async (category) => {
  console.debug('Fill', category) // TEMP
  let budgeted = category.budgeted || 0
  let remaining = category.remaining || 0
  remaining += budgeted
  let refilled = getCurrentYearMonthString()
  await updateCategory(category._id, { remaining, refilled })
}

export const getBudgetDataFor = categoryId => {
  return get(budgetStore)[categoryId] || {}
}

const isNotDeleted = category => !category.deleted

export const refillBudgetCategories = async () => {
  const categories = await listCategories()
  await Promise.allSettled(categories.map(async (category) => {
    if (category.refilled) {
      await refillBudgetCategory(category)
    } else {
      await fillBudgetCategory(category)
    }
  }))
}

const refillBudgetCategory = async (category) => {
  let {budgeted, remaining, refilled} = category
  for (let i = 0; isInPast(refilled) && (i < 100); i++) {
    console.debug('Refill', category) // TEMP
    remaining += budgeted
    refilled = getMonthAfter(refilled)
  }
  await updateCategory(category._id, { remaining, refilled })
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

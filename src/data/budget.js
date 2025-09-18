import { getCategory, listCategories, updateCategory } from './categories'
import { getCurrentYearMonthString, getMonthAfter, isInPast } from '../helpers/dates'
import { writable } from 'svelte/store'

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

export const subtractAmountFromBudgetCategory = async (categoryId, amountToSubtract) => {
  const category = await getCategory(categoryId)
  const oldRemaining = category.remaining || 0
  const newRemaining = oldRemaining - amountToSubtract
  await updateCategory(categoryId, { remaining: newRemaining })
}

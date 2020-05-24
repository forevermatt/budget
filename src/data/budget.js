import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getObjectFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'

const BUDGET = 'budget'

export const budget = writable({})

export const loadBudget = () => {
  budget.set(getObjectFromStorage(BUDGET))
}

const saveBudget = () => saveToStorage(BUDGET, get(budget))

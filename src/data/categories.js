import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const CATEGORIES = 'categories'

export const categories = writable([])

export const createCategory = name => {
  const existingCategory = get(categories).find(c => c.name === name)
  if (existingCategory) {
    return existingCategory
  } else {
    const newCategory = {
      uuid: uuidv4(),
      name: name,
    }
    addToList(newCategory, categories)
    saveCategories()
    return newCategory
  }
}

export const loadCategories = () => {
  categories.set(getListFromStorage(CATEGORIES))
}

const saveCategories = () => saveToStorage(CATEGORIES, get(categories))

export const updateCategory = (uuid, changes) => {
  updateInList('uuid', uuid, changes, categories)
  saveCategories()
}

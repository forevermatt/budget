import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const CATEGORIES = 'categories'

const categories = writable([])

export const createCategory = name => {
  const existingCategory = get(categories).find(c => c.name === name)
  if (existingCategory) {
    return existingCategory
  } else {
    const newCategory = {
      id: uuidv4(),
      name: name,
    }
    addToList(newCategory, categories)
    saveCategories()
    return newCategory
  }
}

export const deleteCategory = (id) => {
  const changes = { deleted: true }
  updateInList('id', id, changes, categories)
  saveCategories()
}

export const getCategory = (id) => {
  const categories = listCategories()
  return getCategoryFrom(id, categories)
}

const getCategoryFrom = (id, list) => {
  return list.find(item => item.id === id) || {}
}

export const listCategories = () => {
  return getListFromStorage(CATEGORIES)
}

export const loadCategories = () => {
  categories.set(getListFromStorage(CATEGORIES))
}

const saveCategories = () => saveToStorage(CATEGORIES, get(categories))

export const updateCategory = (id, changes) => {
  updateInList('id', id, changes, categories)
  saveCategories()
}

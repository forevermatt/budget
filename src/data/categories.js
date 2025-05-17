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
      uuid: uuidv4(),
      name: name,
    }
    addToList(newCategory, categories)
    saveCategories()
    return newCategory
  }
}

export const deleteCategory = (uuid) => {
  const changes = { deleted: true }
  updateInList('uuid', uuid, changes, categories)
  saveCategories()
}

export const getCategory = (uuid) => {
  const categories = listCategories()
  return getCategoryFrom(uuid, categories)
}

const getCategoryFrom = (uuid, list) => {
  return list.find(item => item.uuid === uuid) || {}
}

export const listCategories = () => {
  return getListFromStorage(CATEGORIES)
}

export const loadCategories = () => {
  categories.set(getListFromStorage(CATEGORIES))
}

const saveCategories = () => saveToStorage(CATEGORIES, get(categories))

export const updateCategory = (uuid, changes) => {
  updateInList('uuid', uuid, changes, categories)
  saveCategories()
}

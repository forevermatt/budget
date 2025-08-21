import database from './database'
import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const CATEGORIES = 'categories'
const ITEM_TYPE_PREFIX = 'c'

const categories = writable([])

export const addCategory = async name => database.insert(ITEM_TYPE_PREFIX, { name })

export const deleteCategory = (id) => {
  const changes = { deleted: true }
  updateInList('id', id, changes, categories)
  saveCategories()
}

export const getCategory = async id => database.get(id)

const getCategoryFrom = (id, list) => {
  return list.find(item => item.id === id) || {}
}

export const listCategories = async () => database.list(ITEM_TYPE_PREFIX)

export const loadCategories = () => {
  categories.set(getListFromStorage(CATEGORIES))
}

const saveCategories = () => saveToStorage(CATEGORIES, get(categories))

export const updateCategory = (id, changes) => {
  updateInList('id', id, changes, categories)
  saveCategories()
}

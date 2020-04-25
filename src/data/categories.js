import { writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

export const categories = writable([])

export const create = name => {
  const newCategory = {
    uuid: uuidv4(),
    name: name,
  }
  addItemToStore(newCategory, categories)
  return newCategory
}

const addItemToStore = (newItem, store) => {
  store.update(existingItems => [newItem, ...existingItems])
}

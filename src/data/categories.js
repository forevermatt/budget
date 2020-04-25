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

export const update = (uuid, changes) => {
  updateItemInStore(uuid, changes, categories)
}

const updateItemInStore = (uuid, changes, store) => {
  store.update(existingItems => {
    const itemToUpdate = existingItems.find(item => item.uuid === uuid)
    const updatedItem = Object.assign({}, itemToUpdate, changes)
    
    for (let i = 0; i < existingItems.length; i++) {
      if (existingItems[i].uuid === uuid) {
        existingItems[i] = updatedItem
        break
      }
    }
    
    return existingItems
  })
}

import { addToList, updateInList } from './helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const CATEGORIES = 'categories'

export const errorMessage = writable('')

export const clear = () => errorMessage.set('')

window.onunhandledrejection = rejection => {
  let error = rejection.reason
  errorMessage.set(error.message)
}

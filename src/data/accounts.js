import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const ACCOUNTS = 'accounts'

export const accounts = writable([])

export const createAccount = name => {
  const newAccount = {
    uuid: uuidv4(),
    name: name,
  }
  addToList(newAccount, accounts)
  saveAccounts()
  return newAccount
}

export const loadAccounts = () => {
  accounts.set(getListFromStorage(ACCOUNTS))
}

const saveAccounts = () => saveToStorage(ACCOUNTS, get(accounts))

export const updateAccount = (uuid, changes) => {
  updateInList('uuid', uuid, changes, accounts)
  saveAccounts()
}

import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const ACCOUNTS = 'accounts'

const accounts = writable([])

export const createAccount = name => {
  const newAccount = {
    uuid: uuidv4(),
    name: name,
  }
  addToList(newAccount, accounts)
  saveAccounts()
  return newAccount
}

export const getAccount = (uuid) => {
  const accounts = listAccounts()
  return getAccountFrom(uuid, accounts)
}

const getAccountFrom = (uuid, list) => {
  return list.find(item => item.uuid === uuid) || {}
}

export const listAccounts = () => {
  return getListFromStorage(ACCOUNTS)
}

export const loadAccounts = () => {
  accounts.set(getListFromStorage(ACCOUNTS))
}

const saveAccounts = () => saveToStorage(ACCOUNTS, get(accounts))

export const updateAccount = (uuid, changes) => {
  updateInList('uuid', uuid, changes, accounts)
  saveAccounts()
}

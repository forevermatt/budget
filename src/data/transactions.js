import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const TRANSACTIONS = 'transactions'

export const transactions = writable([])

export const loadTransactions = () => {
  transactions.set(getListFromStorage(TRANSACTIONS))
}

const saveTransactions = () => saveToStorage(TRANSACTIONS, get(transactions))

export const updateTransaction = (uuid, changes) => {
  updateInList('uuid', uuid, changes, transactions)
  saveTransactions()
}

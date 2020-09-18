import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { subtractAmountFromBudgetCategory } from './budget'

const TRANSACTIONS = 'transactions'

export const transactions = writable([])

export const createTransaction = transactionData => {
  const uuid = uuidv4()
  const transaction = Object.assign({}, transactionData, {uuid})
  addToList(transaction, transactions)
  saveTransactions()
  return transaction
}

export const getTransactionFrom = (uuid, list) => {
  return list.find(item => item.uuid === uuid) || {}
}

export const loadTransactions = () => {
  transactions.set(getListFromStorage(TRANSACTIONS))
}

const saveTransactions = () => saveToStorage(TRANSACTIONS, get(transactions))

export const updateTransaction = (uuid, changes) => {
  updateInList('uuid', uuid, changes, transactions)
  saveTransactions()
}

export const applyTransaction = (uuid) => {
  const transaction = getTransactionFrom(uuid, get(transactions))
  if (transaction.applied) {
    throw new Error('Already applied this one!') // TEMP
  }
  const categoryAmounts = transaction.categoryAmounts || {}
  for (const categoryUuid in categoryAmounts) {
    const categoryAmount = categoryAmounts[categoryUuid] || 0
    subtractAmountFromBudgetCategory(categoryUuid, categoryAmount)
  }
  updateTransaction(uuid, { applied: true })
}

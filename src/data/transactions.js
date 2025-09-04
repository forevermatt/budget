import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { subtractAmountFromBudgetCategory } from './budget'
import database from './database'

const TRANSACTIONS = 'transactions'
const ITEM_TYPE_PREFIX = 't'

const transactions = writable([])
export const transactionInProgress = writable({})

export const startNewPendingTransaction = transactionData => {
  const transaction = Object.assign({}, transactionData)
  transactionInProgress.set(transaction)
}

export const getTransactionsForAccount = accountId => {
  return listTransactions().filter(transaction => {
    return transaction.accountId === accountId
  })
}

export const getTransactionsForCategory = categoryId => {
  return listTransactionsFromStorage().filter(transaction => {
    const categoryAmounts = transaction.categoryAmounts || {}
    return categoryAmounts.hasOwnProperty(categoryId)
  })
}

export const getTransactionFrom = (id, list) => {
  return list.find(item => item.id === id) || {}
}

// Legacy/localStorage-backed list kept for existing code paths
export const listTransactionsFromStorage = () => {
  return getListFromStorage(TRANSACTIONS)
}

export const loadTransactions = () => {
  transactions.set(getListFromStorage(TRANSACTIONS))
}

export const savePendingTransaction = async () => {
  const transaction = get(transactionInProgress)
  await addTransaction(transaction)

  const categoryAmounts = transaction.categoryAmounts || {}
  for (const categoryId in categoryAmounts) {
    const categoryAmount = categoryAmounts[categoryId] || 0
    subtractAmountFromBudgetCategory(categoryId, categoryAmount)
  }

  startNewPendingTransaction({})
}

const saveTransactions = () => saveToStorage(TRANSACTIONS, get(transactions))

export const updateCompletedTransaction = (id, changes) => {
  updateInList('id', id, changes, transactions)
  saveTransactions()
}

export const updatePendingTransaction = (changes) => {
  const pendingTransaction = get(transactionInProgress)
  const updatedPendingTransaction = Object.assign({}, pendingTransaction, changes)
  transactionInProgress.set(updatedPendingTransaction)
}

export const addTransaction = async (values) => database.insert(ITEM_TYPE_PREFIX, values)

export const deleteTransaction = async (id) => database.deleteItem(id)

export const getTransaction = async (id) => database.get(id)

export const listTransactions = async () => database.list(ITEM_TYPE_PREFIX)

export const updateTransaction = async (id, changes) => {
  const existing = await getTransaction(id)
  const revised = { ...existing, ...changes }
  return database.update(revised)
}

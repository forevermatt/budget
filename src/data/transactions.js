import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { subtractAmountFromBudgetCategory } from './budget'

const TRANSACTIONS = 'transactions'

const transactions = writable([])
export const transactionInProgress = writable({})

export const startNewPendingTransaction = transactionData => {
  const transaction = Object.assign({}, transactionData)
  transactionInProgress.set(transaction)
}

export const getTransactionsForAccount = accountUuid => {
  return listTransactions().filter(transaction => {
    return transaction.accountUuid === accountUuid
  })
}

export const getTransactionsForCategory = categoryUuid => {
  return listTransactions().filter(transaction => {
    const categoryAmounts = transaction.categoryAmounts || {}
    return categoryAmounts.hasOwnProperty(categoryUuid)
  })
}

export const getTransactionFrom = (id, list) => {
  return list.find(item => item.id === id) || {}
}

export const listTransactions = () => {
  return getListFromStorage(TRANSACTIONS)
}

export const loadTransactions = () => {
  transactions.set(getListFromStorage(TRANSACTIONS))
}

export const savePendingTransaction = () => {
  const transaction = get(transactionInProgress)
  transaction.id = uuidv4()

  addToList(transaction, transactions)
  saveTransactions()

  const categoryAmounts = transaction.categoryAmounts || {}
  for (const categoryUuid in categoryAmounts) {
    const categoryAmount = categoryAmounts[categoryUuid] || 0
    subtractAmountFromBudgetCategory(categoryUuid, categoryAmount)
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

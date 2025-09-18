import { get, writable } from 'svelte/store'
import { subtractAmountFromBudgetCategory } from './budget'
import database from './database'

const ITEM_TYPE_PREFIX = 't'

export const transactionInProgress = writable({})

export const startNewPendingTransaction = transactionData => {
  const transaction = Object.assign({}, transactionData)
  transactionInProgress.set(transaction)
}

export const getTransactionsForAccount = async (accountId) => {
  const transactions = await listTransactions()
  return transactions.filter(transaction => {
    return transaction.accountId === accountId
  })
}

export const getTransactionsForCategory = async (categoryId) => {
  const transactions = await listTransactions()
  return transactions.filter(transaction => {
    const categoryAmounts = transaction.categoryAmounts || {}
    return categoryAmounts.hasOwnProperty(categoryId)
  })
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

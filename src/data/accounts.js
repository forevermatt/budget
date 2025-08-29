import database from './database'

const ITEM_TYPE_PREFIX = 'a'

// Create a new account; returns the new document id (string) or null
export const createAccount = async (name) => database.insert(ITEM_TYPE_PREFIX, { name })

// Delete an account by id
export const deleteAccount = async (id) => database.deleteItem(id)

// Get a single account document by id
export const getAccount = async (id) => database.get(id)

// List all accounts
export const listAccounts = async () => database.list(ITEM_TYPE_PREFIX)

// No-op loader kept for compatibility with existing code that calls loadAccounts() on mount
export const loadAccounts = () => {}

export const updateAccount = async (id, changes) => {
  const existing = await getAccount(id)
  const revised = { ...existing, ...changes }
  return database.update(revised)
}

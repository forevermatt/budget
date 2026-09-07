import database from './database'

const ITEM_TYPE_PREFIX = 'a'

export const addAccount = async (name) => database.insert(ITEM_TYPE_PREFIX, { name })

export const deleteAccount = async (id) => database.deleteItem(id)

export const getAccount = async (id) => database.get(id)

export const listAccounts = async () => {
  const accounts = await database.list(ITEM_TYPE_PREFIX)
  return accounts.sort((a, b) => a.name.localeCompare(b.name))
}

export const updateAccount = async (id, changes) => {
  const existing = await getAccount(id)
  const revised = { ...existing, ...changes }
  return database.update(revised)
}

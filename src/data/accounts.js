import database from './database'

const ITEM_TYPE_PREFIX = 'a'

export const addAccount = async (name) => database.insert(ITEM_TYPE_PREFIX, { name })

export const deleteAccount = async (id) => database.deleteItem(id)

export const getAccount = async (id) => database.get(id)

export const listAccounts = async () => database.list(ITEM_TYPE_PREFIX)

export const updateAccount = async (id, changes) => {
  const existing = await getAccount(id)
  const revised = { ...existing, ...changes }
  return database.update(revised)
}

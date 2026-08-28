import database from './database'

const ITEM_TYPE_PREFIX = 'c'

export const addCategory = async name => database.insert(ITEM_TYPE_PREFIX, { name })

export const deleteCategory = (id) => database.deleteItem(id)

export const getCategory = async id => database.get(id)

export const listCategories = async () => {
  const categories = await database.list(ITEM_TYPE_PREFIX)
  return categories.sort((a, b) => a.name.localeCompare(b.name))
}

export const updateCategory = async (id, changes) => {
  const existing = await getCategory(id)
  const revised = { ...existing, ...changes }
  return database.update(revised)
}

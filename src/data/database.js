import PouchDB from 'pouchdb-browser'
import { v4 as uuidv4 } from 'uuid'

// CouchDB server configuration (from docker-compose.yml)
const COUCHDB_URL = 'http://localhost:5984'
const COUCHDB_USER = 'admin'
const COUCHDB_PASSWORD = 'password'

// Get or set user ID for per-user database
const getUserId = () => {
  let userId = localStorage.getItem('budget-user-id')
  if (!userId) {
    userId = 'user-' + uuidv4()
    localStorage.setItem('budget-user-id', userId)
  }
  return userId
}

// Create database name for the user
const getDatabaseName = () => {
  const userId = getUserId()
  return `budget-${userId}`
}

// Initialize PouchDB with user-specific database
const databaseName = getDatabaseName()
const pouchDb = new PouchDB(databaseName)

// Set up remote database and sync
const remoteDb = new PouchDB(`${COUCHDB_URL}/${databaseName}`, {
  auth: {
    username: COUCHDB_USER,
    password: COUCHDB_PASSWORD
  }
})

// Set up bidirectional sync
const sync = pouchDb.sync(remoteDb, {
  live: true,
  retry: true
}).on('error', (err) => {
  console.error('Sync error:', err)
})

const deleteItem = async (id) => {
  const doc = await pouchDb.get(id);
  doc._deleted = true;
  await pouchDb.put(doc);
}

const get = async (id) => pouchDb.get(id)

/**
 * @param response
 * @returns Array
 */
const getItemsFromResponse = (response) => {
  return response.rows.map(row => row.doc);
}

const insert = async (itemTypePrefix, values) => {
  const response = await pouchDb.put({
    _id: itemTypePrefix + '-' + uuidv4(),
    ...values,
  });
  
  if (response.ok) {
    return response.id
  }
  
  console.error(response)
  return null
}

const list = async (itemTypePrefix) => {
  const response = await pouchDb.allDocs({
    include_docs: true,
    startkey: itemTypePrefix + '-',
    endkey: itemTypePrefix + '-\ufff0',
  });
  return getItemsFromResponse(response)
}

const update = async (revisedItem) => {
  const response = await pouchDb.put(revisedItem)
  if (!response.ok) {
    console.error(response)
  }
}

export default {
  deleteItem,
  get,
  insert,
  list,
  update,
}

// Export additional utilities for user and sync management
export { getUserId, getDatabaseName, sync }

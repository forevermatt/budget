import PouchDB from 'pouchdb-browser'
import { v4 as uuidv4 } from 'uuid'

const pouchDb = new PouchDB('budget')

const deleteItem = async (id) => {
  const doc = await pouchDb.get(id);
  if (doc.error && doc.status === 404) {
    return
  }
  
  if (doc.error) {
    console.error(doc)
    return
  }
  
  doc._deleted = true;
  await pouchDb.put(doc);
}

const get = async (id) => pouchDb.get(id)

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

import PouchDB from 'pouchdb-browser'
import { v4 as uuidv4 } from 'uuid'

const pouchDb = new PouchDB('budget')

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

export default {
  insert,
  list,
}

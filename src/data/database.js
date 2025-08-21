import PouchDB from 'pouchdb-browser'

const pouchDb = new PouchDB('budget')

const getItemsFromResponse = (response) => {
  return response.rows.map(row => row.doc);
}

export const insertCategory = async (values) => {
  try {
    const response = await pouchDb.post(values);
    console.log(response)
  } catch (error) {
    console.error(error)
  }
  return {}
}

const list = async (itemTypePrefix) => {
  const response = await pouchDb.allDocs({
    include_docs: true,
    startkey: itemTypePrefix + '-',
    endkey: itemTypePrefix + '-\ufff0',
  });
  return getItemsFromResponse(response)
}

export default { insertCategory, list }

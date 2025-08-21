import PouchDB from 'pouchdb-browser'

const pouchDb = new PouchDB('budget')

export const insertCategory = async (values) => {
  try {
    const response = await pouchDb.post(values);
    console.log(response)
  } catch (error) {
    console.error(error)
  }
  return {}
}

export default { insertCategory }

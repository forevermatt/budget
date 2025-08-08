import { database } from './database'
import { addToList, updateInList } from '../helpers/data-store-helpers'
import { getListFromStorage, saveToStorage } from './storage'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

const ACCOUNTS = 'accounts'

export const accounts = writable([])

export const createAccount = name => {
  const newAccount = {
    uuid: uuidv4(),
    name: name,
  }
  addToList(newAccount, accounts)
  saveAccounts()
  return newAccount
}

export const getAccount = async (uuid) => {
  const accounts = await listAccounts()
  return getAccountFrom(uuid, accounts)
}

const getAccountFrom = (uuid, list) => {
  return list.find(item => item.uuid === uuid) || {}
}

export const listAccounts = async () => {
  return getListFromStorage(ACCOUNTS)
}

export const loadAccounts = async () => {
  await migrateFromStorage()
  try {
    const response = await database.allDocs({include_docs: true, descending: true})
    const rows = response.rows
    accounts.set(rows.map(row => row.doc))
  } catch (reason) {
    console.error(
      'Error while loading accounts:',
      reason
    )
  }
}

const migrateFromStorage = async () => {
  const accountsFromStorage = getListFromStorage(ACCOUNTS)
  if (accountsFromStorage.length > 0) {
    const accountsForPouchDB = accountsFromStorage.map(convertAccountUuidToId)
    try {
      const results = await database.bulkDocs(accountsForPouchDB)
      console.debug(
        'Converted accounts from localStorage to PouchDB.',
        'localStorage:',
        accountsFromStorage,
        'PouchDB:',
        accountsForPouchDB,
        'results:',
        results
      )
      await removeMovedAccountsFromStorage(results, accountsFromStorage)
      // results.forEach(result => {
      //   if (result.ok) {
      //     delete accountsFromStorage[result.id]
      //   }
      // })
      // saveToStorage(ACCOUNTS, accountsFromStorage)
    } catch (reason) {
      console.error(
        'Error while accounts from localStorage to PouchDB:',
        reason
      )
    }
  }
}

const convertAccountUuidToId = (account) => {
  const newAccount = {
    ...account,
  }
  newAccount._id = account.uuid
  delete newAccount.uuid
  return newAccount
}

const removeMovedAccountsFromStorage = (results, accountsFromStorage) => {
  results.forEach(result => {
    if (result.ok) {
      removeAccountFromList(result.id, accountsFromStorage)
    }
  })
  saveToStorage(ACCOUNTS, accountsFromStorage)
}

const removeAccountFromList = (accountUuid, accountsList) => {
  for (let i = 0; i < accountsList.length; i++) {
    if (accountUuid === accountsList[i].uuid) {
      delete accountsList[i]
    }
  }
}

const saveAccounts = () => saveToStorage(ACCOUNTS, get(accounts))

export const updateAccount = (uuid, changes) => {
  updateInList('uuid', uuid, changes, accounts)
  saveAccounts()
}

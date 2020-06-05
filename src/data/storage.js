const isArray = Array.isArray

export const getListFromStorage = listName => {
  const list = parseJsonFromStorage(listName)
  return isArray(list) ? list : []
}

export const getObjectFromStorage = objectName => {
  const data = parseJsonFromStorage(objectName)
  return (data !== null) ? data : {}
}

const parseJsonFromStorage = itemName => {
  const stringFromStorage = localStorage.getItem(itemName)
  return JSON.parse(stringFromStorage)
}

export const saveToStorage = (name, data) => {
   localStorage.setItem(name, JSON.stringify(data))
}

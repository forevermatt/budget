const isArray = Array.isArray

export const getListFromStorage = listName => {
  const stringFromStorage = localStorage.getItem(listName)
  const dataFromStorage = JSON.parse(stringFromStorage)
  return isArray(dataFromStorage) ? dataFromStorage : []
}

export const saveToStorage = (name, data) => {
   localStorage.setItem(name, JSON.stringify(data))
}

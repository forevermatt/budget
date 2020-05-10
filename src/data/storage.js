export const getListFromStorage = listName => {
  const stringFromStorage = localStorage.getItem(listName)
  const dataFromStorage = JSON.parse(stringFromStorage)
  if (Array.isArray(dataFromStorage)) {
    return dataFromStorage
  } else {
    return []
  }
}

export const saveToStorage = (name, data) => {
   localStorage.setItem(name, JSON.stringify(data))
}

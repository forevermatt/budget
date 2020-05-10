export const getListFromStorage = listName => {
  const stringFromStorage = localStorage.getItem(listName)
  const dataFromStorage = JSON.parse(stringFromStorage)
  console.log(dataFromStorage, Array.isArray(dataFromStorage)) // TEMP
  if (Array.isArray(dataFromStorage)) {
    return dataFromStorage
  } else {
    return []
  }
}

export const saveToStorage = (name, data) => {
   localStorage.setItem(name, JSON.stringify(data))
}

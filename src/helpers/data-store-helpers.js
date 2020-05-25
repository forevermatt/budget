
export const addToList = (item, store) => {
  store.update(list => [item, ...list])
}

export const updateInList = (idField, id, changes, store) => {
  store.update(list => {
    const itemToUpdate = list.find(item => item[idField] === id)
    const updatedItem = Object.assign({}, itemToUpdate, changes)
    
    for (let i = 0; i < list.length; i++) {
      if (list[i][idField] === id) {
        list[i] = updatedItem
        break
      }
    }
    
    return list
  })
}

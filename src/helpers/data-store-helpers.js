
export const addToList = (item, store) => {
  store.update(list => [item, ...list])
}

export const updateInList = (uuid, changes, store) => {
  store.update(list => {
    const itemToUpdate = list.find(item => item.uuid === uuid)
    const updatedItem = Object.assign({}, itemToUpdate, changes)
    
    for (let i = 0; i < list.length; i++) {
      if (list[i].uuid === uuid) {
        list[i] = updatedItem
        break
      }
    }
    
    return list
  })
}


export const addToList = (item, store) => {
  store.update(list => [item, ...list])
}

export const updateInList = (idField, id, changes, store) => {
  store.update(list => {
    const itemToUpdate = list.find(item => item[idField] === id)
    const updatedItem = Object.assign({}, itemToUpdate, changes)
    
    let found = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i][idField] === id) {
        found = true
        list[i] = updatedItem
        break
      }
    }
    
    if (!found) {
      list.push(updatedItem)
    }
    
    return list
  })
}

export const updateInObject = (property, changes, store) => {
  store.update(data => {
    if (data.hasOwnProperty(property)) {
      data[property] = Object.assign(data[property], changes)
    } else {
      data[property] = changes
    }
    return data
  })
}

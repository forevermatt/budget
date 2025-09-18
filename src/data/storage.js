export const saveToStorage = (name, data) => {
   localStorage.setItem(name, JSON.stringify(data))
}

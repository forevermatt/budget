import { writable } from 'svelte/store'

export const errorMessage = writable('')

export const clearError = () => errorMessage.set('')

window.onunhandledrejection = rejection => {
  let error = rejection.reason
  errorMessage.set(error.message)
}

import { writable } from 'svelte/store'

/**
 * The error the app is currently showing: a sentence the app writes, plus
 * whatever the failure itself said. Both halves matter. The sentence tells the
 * user what broke, and keeping the raw text means an error that arrives with
 * no human wrapper still reads as an error rather than a mystery word.
 */
export const appError = writable(null)

export const clearError = () => appError.set(null)

export const setError = (title, detail = '') => appError.set({ title, detail })

// Anything that fails without being caught still has to say something, so it
// gets a generic sentence and keeps its own text as the detail.
window.onunhandledrejection = rejection => {
  const reason = rejection.reason
  setError('Something went wrong', (reason && reason.message) || String(reason))
}

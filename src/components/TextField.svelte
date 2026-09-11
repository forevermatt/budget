<script>
import Form from './Form.svelte'
import { createEventDispatcher } from 'svelte'

export let id = ''
export let label = '' // The header asks the question, so name the field for a screen reader.
export let value = ''

const dispatch = createEventDispatcher()

let inputElement = {}
</script>

<style>
/* The app-wide container already supplies half the gutter, so 8px more brings
   the field to the 20px inset the design draws. */
.text-field {
  padding: 28px 8px 0;
}

/* The only thing on the screen, so it is drawn in its focused state and needs
   no outline of its own. */
input {
  background: var(--surface-container-lowest);
  border: 2px solid var(--primary);
  border-radius: 14px;
  color: var(--on-surface);
  display: block;
  font-family: inherit;
  font-size: 18px;
  font-weight: 500;
  height: 56px;
  padding: 0 16px;
  width: 100%;
}

input:focus {
  outline: none;
}
</style>

<Form on:submit={() => dispatch('submit', value)} autofocusElement={inputElement}>
  <div class="text-field">
    <input type="text" {id} aria-label={label}
           bind:value bind:this={inputElement} />
  </div>
</Form>

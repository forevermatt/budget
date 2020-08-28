<script>
import Form from './Form.svelte'
import { createEventDispatcher } from 'svelte'

export let title
export let who = ''

const dispatch = createEventDispatcher();

let inputElement = {}

const recordWho = () => {
  dispatch('select', who)
}
</script>

<Form on:submit={recordWho} autofocusElement={inputElement}>
  <h2><label for="who">{ title }</label></h2>
  <input type="text" class="form-control" id="who" bind:value={who} bind:this={inputElement}>
</Form>

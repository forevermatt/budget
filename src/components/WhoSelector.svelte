<script>
import { createEventDispatcher, onMount } from 'svelte';

export let title
export let autofocus = false
export let who = ''

const dispatch = createEventDispatcher();

let element = {}

onMount(() => {
  if (autofocus) {
    element.focus()
  }
})

const recordWho = () => {
  dispatch('select', who)
}
</script>

<form on:submit|preventDefault={recordWho}>
  <h2><label for="who">{ title }</label></h2>
  <input type="text" class="form-control" id="who" bind:value={who} bind:this={element}>
</form>

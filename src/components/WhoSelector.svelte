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

<form class="pad-vertical text-center" on:submit|preventDefault={recordWho}>
  <label for="who"><b>{ title }</b></label>
  <input type="text" id="who" bind:value={who} bind:this={element}>
</form>

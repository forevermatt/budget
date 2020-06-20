<script>
import { createEventDispatcher } from 'svelte';

export let title
export let who = ''

const dispatch = createEventDispatcher();

const recordWho = () => {
  dispatch('select', who)
}
</script>

<form class="pad-vertical text-center" on:submit|preventDefault={recordWho}>
  <label for="who"><b>{ title }</b></label>
  <input type="text" id="who" bind:value={who}>
</form>

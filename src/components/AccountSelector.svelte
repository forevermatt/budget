<script>
import { createEventDispatcher } from 'svelte';

export let accounts = []

const dispatch = createEventDispatcher();
</script>

{#each accounts as account (account.uuid)}
  <p>
    <button class="btn btn-outline-secondary" on:click={() => dispatch('select', account.uuid)}>
      {account.name}
    </button>
  </p>
{/each}

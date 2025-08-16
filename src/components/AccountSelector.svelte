<script>
import { createEventDispatcher } from 'svelte';

export let accounts = []

const dispatch = createEventDispatcher();
</script>

{#each accounts as account (account.id)}
  <p>
    <button class="btn btn-outline-secondary" on:click={() => dispatch('select', account.id)}>
      {account.name}
    </button>
  </p>
{/each}

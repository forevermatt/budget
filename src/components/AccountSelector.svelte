<script>
import { createEventDispatcher } from 'svelte';

export let accounts = []

const dispatch = createEventDispatcher();
</script>

{#each accounts as account (account._id)}
  <p>
    <button class="btn btn-outline-secondary" on:click={() => dispatch('select', account._id)}>
      {account.name}
    </button>
  </p>
{/each}

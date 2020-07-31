<script>
import { createEventDispatcher } from 'svelte';

export let categories = []

const dispatch = createEventDispatcher();

const recordWho = () => {
  dispatch('select', who)
}
</script>

{#each categories as category (category.uuid)}
  <p>
    <button class="btn btn-outline-secondary" on:click={() => dispatch('select', category.uuid)}>
      {category.name}
    </button>
  </p>
{/each}

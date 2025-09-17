<script>
import { createEventDispatcher } from 'svelte';

export let categories = []

const dispatch = createEventDispatcher();

const recordWho = () => {
  dispatch('select', who)
}
</script>

{#each categories as category (category._id)}
  <p>
    <button class="btn btn-outline-secondary" on:click={() => dispatch('select', category._id)}>
      {category.name}
    </button>
  </p>
{/each}

<script>
import { createEventDispatcher } from 'svelte'

export let items = []

const dispatch = createEventDispatcher()
</script>

<style>
/* The app-wide container already supplies half the gutter, so 8px more brings
   the rows to the 20px inset the design draws. */
.picker-list {
  display: flex;
  flex-direction: column;
  padding: 8px 8px 0;
}

/* The same hairline row the account and category histories use, but taller and
   tappable: choosing one is the whole step, so there is no action button. */
.picker-row {
  align-items: center;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--surface-container-low);
  color: var(--on-surface);
  display: flex;
  font-size: 16px;
  font-weight: 500;
  height: 52px;
  padding: 0;
  text-align: left;
  width: 100%;
}
</style>

<div class="picker-list">
  {#each items as { _id, name } (_id)}
    <button class="picker-row" type="button" on:click={() => dispatch('select', _id)}>
      { name }
    </button>
  {/each}
</div>

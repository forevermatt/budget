<script>
import { createCategory } from '../data/categories'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

let name = ''
let element = {}

onMount(() => {
  element.focus()
})

function onSubmit() {
  const newCategory = createCategory(name)
  push(`/category/${newCategory.uuid}/amount`)
}
</script>

<form on:submit|preventDefault={onSubmit}>
  <h2><label for="new-category-name">New Category</label></h2>

  <input class="form-control" bind:value={name} placeholder="New category name"
         bind:this={element} id="new-category-name" />
</form>

<script>
import { createCategory } from '../data/categories'
import { push } from 'svelte-spa-router'

let name = ''

function onSubmit() {
  const newCategory = createCategory(name)
  push(`/category/${newCategory.uuid}/amount`)
}
</script>

<h2>New Category</h2>

<form on:submit|preventDefault={onSubmit}>
  <input class="form-control" bind:value={name} placeholder="New category name" />
</form>

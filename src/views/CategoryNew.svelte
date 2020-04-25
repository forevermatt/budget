<script>
import { create } from '../data/categories'
import { push } from 'svelte-spa-router'

let name = ''

function onSubmit() {
  const newCategory = create(name)
  push(`/category/${newCategory.uuid}/amount`)
}
</script>

<h2>New Category</h2>

<form on:submit={onSubmit} class="form-row">
  <input class="form-control col-6" bind:value={name} placeholder="New category name" />
</form>

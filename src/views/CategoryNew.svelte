<script>
import { create } from '../data/categories'
import { push } from 'svelte-spa-router'

let name = ''

function onSubmit() {
  const newCategory = create(name)
  push(`/category/${newCategory.uuid}/amount`)
}
</script>

<h1>New Category</h1>

<form on:submit={onSubmit}>
  <input bind:value={name} placeholder="New category name" />
</form>

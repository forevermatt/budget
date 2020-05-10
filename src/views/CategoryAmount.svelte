<script>
import { categories, updateCategory } from '../data/categories'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

let amountInDollars = 0

$: uuid = params.uuid
$: category = $categories.find(category => category.uuid === uuid) || {}

function onSubmit() {
  let amount = amountInDollars * 100
  updateCategory(uuid, {amount})
  push(`/budget`)
}
</script>

<h2>Amount for {category.name}</h2>

<form on:submit|preventDefault={onSubmit}>
  <input type="number" class="form-control" step="0.01" min="0" bind:value={amountInDollars} />
</form>

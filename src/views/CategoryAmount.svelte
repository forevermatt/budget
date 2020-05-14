<script>
import AmountInput from '../components/AmountInput.svelte'
import { categories, updateCategory } from '../data/categories'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: category = $categories.find(category => category.uuid === uuid) || {}
$: initialAmount = category.amount || 0

function onSubmit(event) {
  let amount = event.detail
  updateCategory(uuid, {amount})
  push(`/budget`)
}
</script>

<h2>Amount for {category.name}</h2>

<AmountInput amount={initialAmount} on:next={onSubmit} />

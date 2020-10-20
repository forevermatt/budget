<script>
import AmountInput from '../components/AmountInput.svelte'
import { getBudgetedFor, setBudgetedForCategory } from '../data/budget'
import { categories } from '../data/categories'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: category = $categories.find(category => category.uuid === uuid) || {}
$: initialAmount = category && getBudgetedFor(uuid) || 0

function onSubmit(event) {
  let amount = event.detail
  setBudgetedForCategory(uuid, amount)
  push(`/budget`)
}
</script>

<h2>Monthly amount for {category.name}</h2>

<AmountInput amount={initialAmount} on:next={onSubmit} />

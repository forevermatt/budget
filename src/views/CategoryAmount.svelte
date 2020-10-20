<script>
import AmountInput from '../components/AmountInput.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { getBudgetedFor, setBudgetedForCategory } from '../data/budget'
import { categories } from '../data/categories'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: category = $categories.find(category => category.uuid === uuid) || {}
$: initialAmount = category && getBudgetedFor(uuid) || 0

let resultingAmount = 0

const onAmount = () => {
  setBudgetedForCategory(uuid, resultingAmount)
  push(`/budget`)
}
</script>

<h2>Monthly amount for {category.name}</h2>

<AmountInput amount={initialAmount} on:next={onAmount} bind:resultingAmount={resultingAmount} />

<ButtonRow>
  <Button icon={faCheck} name="save" on:click={onAmount} />
  <Button icon={faTimes} name="cancel" url="#/budget" left />
</ButtonRow>

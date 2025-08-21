<script>
import AmountInput from '../components/AmountInput.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { setBudgetedForCategory } from '../data/budget'
import { getCategory } from '../data/categories'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

let category = {}
let resultingAmount = 0

$: initialAmount = category.budgeted || 0

const onAmount = () => {
  setBudgetedForCategory(params.id, resultingAmount)
  push(`/budget`)
}

onMount(async () => {
  category = await getCategory(params.id)
  console.log(category) // TEMP
})
</script>

<h2>Monthly amount for {category.name}</h2>

<AmountInput amount={initialAmount} on:next={onAmount} bind:resultingAmount={resultingAmount} />

<ButtonRow>
  <Button icon={faCheck} name="save" on:click={onAmount} />
  <Button icon={faTimes} name="cancel" url="#/budget" left />
</ButtonRow>

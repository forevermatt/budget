<script>
import AmountInput from '../components/AmountInput.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { refillBudgetCategories } from '../data/budget'
import { getCategory, updateCategory } from '../data/categories'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

export let params = {} // URL parameters provided by router

let category = {}
let resultingAmount = 0

$: id = params.id || ''
$: loadCategory(id)
$: initialAmount = category.budgeted || 0

const loadCategory = async (categoryId) => {
  if (categoryId) {
    category = await getCategory(categoryId) || {}
  }
}

const onAmount = async () => {
  await updateCategory(id, {
    budgeted: resultingAmount,
  })
  
  // In case this is a new category, ensure it has been filled.
  await refillBudgetCategories()

  push(`/budget`)
}
</script>

<h2>Monthly amount for {category.name || '...'}</h2>

<AmountInput amount={initialAmount} on:next={onAmount} bind:resultingAmount={resultingAmount} />

<ButtonRow>
  <Button icon={faCheck} name="save" on:click={onAmount} />
  <Button icon={faTimes} name="cancel" url="#/budget" left />
</ButtonRow>

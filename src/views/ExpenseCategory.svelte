<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import CategorySelector from '../components/CategorySelector.svelte'
import { listCategories } from '../data/categories'
import { transactionInProgress, updatePendingTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

let categories = []

function setCategory(event) {
  let categoryId = event.detail
  let categoryAmounts = {}
  categoryAmounts[categoryId] = $transactionInProgress.amountTotal
  updatePendingTransaction({ categoryAmounts })
  push(`/expense/review/`)
}

onMount(async () => {
  categories = await listCategories()
})
</script>

<h2>Category</h2>

<CategorySelector {categories} on:select={setCategory} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>

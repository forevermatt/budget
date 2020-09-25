<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import CategorySelector from '../components/CategorySelector.svelte'
import { categories } from '../data/categories'
import { transactionInProgress, updatePendingTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

function setCategory(event) {
  let categoryUuid = event.detail
  let categoryAmounts = {}
  categoryAmounts[categoryUuid] = $transactionInProgress.amountTotal
  updatePendingTransaction({ categoryAmounts })
  push(`/expense/review/`)
}
</script>

<h2>Category</h2>

<CategorySelector categories={$categories} on:select={setCategory} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>

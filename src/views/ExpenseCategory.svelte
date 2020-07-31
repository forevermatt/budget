<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import CategorySelector from '../components/CategorySelector.svelte'
import { categories } from '../data/categories'
import { getTransactionFrom, transactions, updateTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: transaction = getTransactionFrom(uuid, $transactions)

function setCategory(event) {
  let categoryUuid = event.detail
  let categoryAmounts = {}
  categoryAmounts[categoryUuid] = transaction.amountTotal
  updateTransaction(uuid, { categoryAmounts })
  push(`/expense/review/${transaction.uuid}`)
}
</script>

<h2>Category</h2>

<CategorySelector categories={$categories} on:select={setCategory} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>

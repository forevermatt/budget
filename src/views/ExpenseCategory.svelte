<script>
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import PickerList from '../components/PickerList.svelte'
import { listCategories } from '../data/categories'
import { transactionInProgress, updatePendingTransaction } from '../data/transactions'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

let categories = []

const setCategory = (event) => {
  const categoryAmounts = {}
  categoryAmounts[event.detail] = $transactionInProgress.amountTotal
  updatePendingTransaction({ categoryAmounts })
  push(`/expense/review/`)
}

onMount(async () => {
  categories = await listCategories()
})
</script>

<DetailHeader title="Category" backUrl="#/expense/amount/" />

<PickerList items={categories} on:select={setCategory} />

<ButtonRow />

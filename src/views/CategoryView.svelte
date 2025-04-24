<script>
import { getBudgetedFor } from '../data/budget'
import { getCategory, updateCategory } from '../data/categories'
import { getTransactionsForCategory } from '../data/transactions'
import { formatAmount } from '../helpers/numbers'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export let params = {} // URL parameters provided by router

$: uuid = params.uuid || ''
$: category = getCategory(uuid)
$: transactions = getTransactionsForCategory(uuid)

const renameCategory = () => {
  let name = prompt('Edit category name:', category.name)
  if (name != null) {
    updateCategory(uuid, {name})
  }
}
</script>

<style>
.editable {
  cursor: pointer;
}
</style>

<h2>
  <b class="editable" on:click={renameCategory}
     title="(Click to rename)">{ category.name }:</b>
  <a class="btn btn-default" href="#/category/{ uuid }/amount">
    <sup>$</sup> { formatAmount(getBudgetedFor(uuid)) }
  </a>
</h2>
<hr class="small" />
<TransactionList {transactions} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>

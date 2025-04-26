<script>
import { getBudgetedFor } from '../data/budget'
import { deleteCategory, getCategory, updateCategory } from '../data/categories'
import { getTransactionsForCategory } from '../data/transactions'
import { formatAmount } from '../helpers/numbers'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import { faEdit, faHome } from '@fortawesome/free-solid-svg-icons'
import Icon from 'fa-svelte'
import { push } from 'svelte-spa-router'

export let params = {} // URL parameters provided by router

$: uuid = params.uuid || ''
$: category = getCategory(uuid)
$: transactions = getTransactionsForCategory(uuid)

const renameCategory = () => {
  let name = prompt('Edit category name:', category.name)
  if (name != null) {
    updateCategory(uuid, {name})
    category = getCategory(uuid)
  }
}

const onDeleteCategory = () => {
  let confirmed = confirm('Are you sure you want to delete ' + category.name + '?')
  if (confirmed) {
    deleteCategory(uuid, {name})
    push(`/budget/`)
  }
}
</script>

<h2>
  <span> { category.name }</span>
  <button class="btn btn-link btn-lg" tabindex="0" on:click={renameCategory}>
    <Icon icon={faEdit} />
  </button>
  <a class="btn btn-default float-right" href="#/category/{ uuid }/amount">
    <sup>$</sup> { formatAmount(getBudgetedFor(uuid)) }
  </a>
</h2>
<hr class="small" />
<TransactionList {transactions} />

<div class="text-center">
  <button class="btn btn-outline-danger" on:click={onDeleteCategory}>Delete category</button>
</div>

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
